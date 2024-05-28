from django.urls import path, re_path
from . import views
from rest_framework.routers import DefaultRouter
from ft_user.views import (
    UserViewSet, User_login, Sign_up,
    Logout, CheckLogin,
    UserInfoChange, UserImage, SelectUser, UserBlockRequest, UserBlockCheckRequest, UserBlockReleaseRequest,
    GetUsersOnlineStatus,
)
# FriendView, 
#     FriendRejectView ,FriendAcceptView,
#     FriendDeleteView,
# ProfileImageUploadView,

app_name = "ft_user"

urlpatterns = [
    path('user/info', UserViewSet.as_view(), name='user'),
    path('user/login', User_login.as_view(), name='login'),
    path('user/sign_up', Sign_up.as_view(), name='sign_up'),
    path('user/logout', Logout.as_view(), name='logout'),
    # path('friends', FriendView.as_view(), name='friend'),
    # path('friends/accept/', FriendAcceptView.as_view(), name='accept'),
    # path('friends/reject', FriendRejectView.as_view(), name='reject'),
    # path('friends/delete', FriendDeleteView.as_view(), name='delete'),
    path('user/check_login', CheckLogin.as_view(), name="check_login"),
    path('profile_pictures/<str:filename>/', UserImage.as_view(), name="user_image_view"),
    # path('profile/upload', ProfileImageUploadView.as_view(), name='profile_image_upload'),
    path('user/change_info', UserInfoChange.as_view(), name='user_info_change'),
    path('user/block_request', UserBlockRequest.as_view(), name='user_block'), #seycheon_block
    path('user/block_release_request', UserBlockReleaseRequest.as_view(), name='user_block_release'),  #seycheon_block
    path('user/block_check_request', UserBlockCheckRequest.as_view(),name='user_block_check_request'), #seycheon_block
    path('user/get_users_online_status/', GetUsersOnlineStatus.as_view(), name='get_users_online_status'), #seycheon_online_status
    re_path(r'info/', SelectUser.as_view(), name='select_user'),
]