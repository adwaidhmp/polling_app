from rest_framework import serializers
from .models import User
from .models import Poll, Option

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            full_name=validated_data["full_name"],
            password=validated_data["password"]
        )
        return user
    


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)



class PollSerializer(serializers.ModelSerializer):
    is_active = serializers.ReadOnlyField()

    class Meta:
        model = Poll
        fields = ["id", "question", "expiry_date", "is_active", "created_at"]


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "text"]


class PollDetailSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    is_active = serializers.ReadOnlyField()

    class Meta:
        model = Poll
        fields = ["id", "question", "expiry_date", "is_active", "options"]


class PollCreateSerializer(serializers.ModelSerializer):
    options = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )

    class Meta:
        model = Poll
        fields = ["question", "expiry_date", "options"]

    def create(self, validated_data):
        options_data = validated_data.pop("options")

        poll = Poll.objects.create(**validated_data)

        for opt in options_data:
            Option.objects.create(poll=poll, text=opt)

        return poll
    
class OptionResultSerializer(serializers.Serializer):
    option_id = serializers.IntegerField()
    option_text = serializers.CharField()
    votes = serializers.IntegerField()
    percentage = serializers.FloatField()


class PollResultsSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()
    question = serializers.CharField()
    total_votes = serializers.IntegerField()

    results = OptionResultSerializer(many=True)

    chart_labels = serializers.ListField(child=serializers.CharField())
    chart_data = serializers.ListField(child=serializers.IntegerField())


class UserVoteHistorySerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()
    question = serializers.CharField()
    selected_option = serializers.CharField()
    voted_at = serializers.DateTimeField()
    is_active = serializers.BooleanField()

class AdminDashboardSerializer(serializers.Serializer):
    total_polls = serializers.IntegerField()
    active_polls = serializers.IntegerField()
    expired_polls = serializers.IntegerField()
    total_votes = serializers.IntegerField()