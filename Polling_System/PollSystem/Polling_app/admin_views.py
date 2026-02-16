from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PollCreateSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStaffUser
from .models import Poll
from .serializers import PollSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Count
from .models import Vote
from .serializers import PollResultsSerializer
from django.http import HttpResponse
import csv
from django.utils import timezone
from .serializers import AdminDashboardSerializer
from django.db import models

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request):

        total_polls = Poll.objects.count()

        active_polls = Poll.objects.filter(
            models.Q(expiry_date__gt=timezone.now()) |
            models.Q(expiry_date__isnull=True)
        ).count()

        expired_polls = Poll.objects.filter(
            expiry_date__lt=timezone.now()
        ).count()

        total_votes = Vote.objects.count()

        data = {
            "total_polls": total_polls,
            "active_polls": active_polls,
            "expired_polls": expired_polls,
            "total_votes": total_votes,
        }

        serializer = AdminDashboardSerializer(data)

        return Response(serializer.data)
    
    

class AdminCreatePollView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request):
        serializer = PollCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Poll created successfully"},
                status=201
            )

        return Response(serializer.errors, status=400)



class AdminPollListView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request):
        polls = Poll.objects.all().order_by("-created_at")
        serializer = PollSerializer(polls, many=True)
        return Response(serializer.data)
    

class PollResultsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, poll_id):

        poll = get_object_or_404(Poll, id=poll_id)

        # ✅ Total Votes
        total_votes = Vote.objects.filter(poll=poll).count()

        # ✅ Count votes per option
        option_counts = (
            Vote.objects.filter(poll=poll)
            .values("option__id", "option__text")
            .annotate(votes=Count("id"))
        )

        results_list = []
        chart_labels = []
        chart_data = []

        for opt in option_counts:
            votes = opt["votes"]

            # Percentage calculation
            percentage = 0
            if total_votes > 0:
                percentage = round((votes / total_votes) * 100, 2)

            results_list.append({
                "option_id": opt["option__id"],
                "option_text": opt["option__text"],
                "votes": votes,
                "percentage": percentage,
            })

            chart_labels.append(opt["option__text"])
            chart_data.append(votes)

        # ✅ Final Response Data
        response_data = {
            "poll_id": poll.id,
            "question": poll.question,
            "total_votes": total_votes,
            "results": results_list,
            "chart_labels": chart_labels,
            "chart_data": chart_data,
        }

        serializer = PollResultsSerializer(response_data)

        return Response(serializer.data)


class ExportPollResultsCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, poll_id):

        poll = get_object_or_404(Poll, id=poll_id)

        # Total votes
        total_votes = Vote.objects.filter(poll=poll).count()

        # Votes per option
        option_counts = (
            Vote.objects.filter(poll=poll)
            .values("option__text")
            .annotate(votes=Count("id"))
        )

        # Create CSV Response
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="poll_{poll.id}_results.csv"'
        )

        writer = csv.writer(response)

        # Header row
        writer.writerow(["Option", "Votes", "Percentage"])

        # Data rows
        for opt in option_counts:
            votes = opt["votes"]

            percentage = 0
            if total_votes > 0:
                percentage = round((votes / total_votes) * 100, 2)

            writer.writerow([
                opt["option__text"],
                votes,
                f"{percentage}%"
            ])

        return response
