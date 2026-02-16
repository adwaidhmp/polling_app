from django.urls import path
from .views import RegisterView, LoginView, UserPollListView, UserPollDetailView, VoteView, MyVotesView, LogoutView
from .views import RegisterView, LoginView, UserPollListView, UserPollDetailView, VoteView, MyVotesView, LogoutView
from .admin_views import AdminCreatePollView, AdminPollListView ,PollResultsView, ExportPollResultsCSVView, AdminDashboardView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("polls/", UserPollListView.as_view(), name="poll-list"),
    path("polls/<int:poll_id>/", UserPollDetailView.as_view(), name="poll-detail"),
    path("polls/<int:poll_id>/vote/", VoteView.as_view(), name="poll-vote"),
    path("my-votes/", MyVotesView.as_view()),
    path("logout/", LogoutView.as_view(), name="logout"),

    # Admin URLs
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin/polls/create/", AdminCreatePollView.as_view(), name="admin-create-poll"),
    path("admin/polls/", AdminPollListView.as_view(), name="admin-poll-list"),
    path("polls/<int:poll_id>/results/", PollResultsView.as_view()),
    path("polls/<int:poll_id>/export/", ExportPollResultsCSVView.as_view()),
]