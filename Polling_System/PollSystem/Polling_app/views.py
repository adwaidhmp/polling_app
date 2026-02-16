from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PollSerializer
from .serializers import PollDetailSerializer
from .models import Poll
from django.shortcuts import get_object_or_404
from .models import Option
from .models import Vote
from .serializers import UserVoteHistorySerializer

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# {
#   "full_name": "Adwaidh",
#   "email": "adwaidh@gmail.com",
#   "password": "test1234"
# }


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]


        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not user.check_password(password):
            return Response(
                {"error": "Invalid password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "is_staff": user.is_staff,
            },
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }, status=status.HTTP_200_OK)


class UserPollListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        polls = Poll.objects.all().order_by("-created_at")
        serializer = PollSerializer(polls, many=True)
        return Response(serializer.data)


class UserPollDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, poll_id):
        poll = get_object_or_404(Poll, id=poll_id)
        serializer = PollDetailSerializer(poll)
        return Response(serializer.data)
    

class VoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, poll_id):
        poll = get_object_or_404(Poll, id=poll_id)

        if not poll.is_active:
            return Response({"error": "Poll expired"}, status=400)

        option_id = request.data.get("option_id")

        if not option_id:
            return Response({"error": "option_id is required"}, status=400)

        option = get_object_or_404(Option, id=option_id, poll=poll)

        if Vote.objects.filter(user=request.user, poll=poll).exists():
            return Response({"error": "Already voted"}, status=status.HTTP_409_CONFLICT)

        Vote.objects.create(user=request.user, poll=poll, option=option)

        return Response({"message": "Vote submitted successfully"}, status=201)
    
class MyVotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        votes = Vote.objects.filter(user=request.user).select_related("poll", "option")

        vote_history = []

        for vote in votes:
            vote_history.append({
                "poll_id": vote.poll.id,
                "question": vote.poll.question,
                "selected_option": vote.option.text,
                "voted_at": vote.voted_at,
                "is_active": vote.poll.is_active,
            })

        serializer = UserVoteHistorySerializer(vote_history, many=True)

        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)