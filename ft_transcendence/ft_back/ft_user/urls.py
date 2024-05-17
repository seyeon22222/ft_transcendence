from django.urls import path, re_path
from . import views
from rest_framework.routers import DefaultRouter
from ft_user.views import (
    UserViewSet, User_login, Sign_up, SignupView,
    UserLoginView, Logout, CheckLogin,ProfileImageUploadView,
    UserInfoChange, UserImageView, SelcetUser,
)

# FriendView, 
#     FriendRejectView ,FriendAcceptView,
#     FriendDeleteView,

app_name = "ft_user"

urlpatterns = [
    path('user/info', UserViewSet.as_view(), name='user'),
    path('user/login', User_login.as_view(), name='login'),
    path('user/sign_up_view', SignupView.as_view(), name='sign_up_view'),
    path('user/sign_up', Sign_up.as_view(), name='sign_up'),
    path('user/login_suc', UserLoginView.as_view(), name='login_suc'),
    path('user/logout', Logout.as_view(), name='logout'),
    # path('friends', FriendView.as_view(), name='friend'),
    # path('friends/accept/', FriendAcceptView.as_view(), name='accept'),
    # path('friends/reject', FriendRejectView.as_view(), name='reject'),
    # path('friends/delete', FriendDeleteView.as_view(), name='delete'),
    path('user/check_login', CheckLogin.as_view(), name="check_login"),
    path('profile_pictures/<str:filename>/', UserImageView.as_view(), name="user_image_view"),
    path('profile/upload', ProfileImageUploadView.as_view(), name='profile_image_upload'),
    path('user/change_info', UserInfoChange.as_view(), name='user_info_change'),
    re_path(r'info/', SelcetUser.as_view(), name='select_user'),
]