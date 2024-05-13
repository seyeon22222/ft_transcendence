from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from ft_user.views import (
    UserViewSet, FriendView, 
    FriendRejectView ,FriendAcceptView,
    FriendDeleteView, User_login, Sign_up, SignupView,
    UserLoginView, Logout, GetUserData, CurrentUser,
)

app_name = "ft_user"

urlpatterns = [
    path('user/info', GetUserData.as_view(), name='user'),
    path('user/login', User_login.as_view(), name='login'),
    path('user/sign_up_view', SignupView.as_view(), name='sign_up_view'),
    path('user/sign_up', Sign_up.as_view(), name='sign_up'),
    path('user/login_suc', UserLoginView.as_view(), name='login_suc'),
    path('user/logout', Logout.as_view(), name='logout'),
    path('friends', FriendView.as_view(), name='friend'),
    path('friends/accept/', FriendAcceptView.as_view(), name='accept'),
    path('friends/reject', FriendRejectView.as_view(), name='reject'),
    path('friends/delete', FriendDeleteView.as_view(), name='delete'),
]