from django.urls import path, re_path
from .view import (
    UserViewSet, User_login, Sign_up,
    Logout, CheckLogin, UserInfoChange, 
    UserImage, SelectUser, UserBlockRequest, 
    UserBlockCheckRequest, UserBlockReleaseRequest, LanguageSet
)

app_name = "User"

urlpatterns = [
    path('user/info', UserViewSet.UserViewSet.as_view(), name='user'),
    path('user/login', User_login.User_login.as_view(), name='login'),
    path('user/sign_up', Sign_up.Sign_up.as_view(), name='sign_up'),
    path('user/logout', Logout.Logout.as_view(), name='logout'),
    path('user/check_login', CheckLogin.CheckLogin.as_view(), name="check_login"),
    path('profile_pictures/<str:filename>/', UserImage.UserImage.as_view(), name="user_image_view"),
    path('user/change_info', UserInfoChange.UserInfoChange.as_view(), name='user_info_change'),
    path('user/block_request', UserBlockRequest.UserBlockRequest.as_view(), name='user_block'),
    path('user/block_release_request', UserBlockReleaseRequest.UserBlockReleaseRequest.as_view(), name='user_block_release'),
    path('user/block_check_request', UserBlockCheckRequest.UserBlockCheckRequest.as_view(),name='user_block_check_request'),
    path('user/language', LanguageSet.LanguageSet.as_view(), name="language_setting"),
    re_path(r'info/', SelectUser.SelectUser.as_view(), name='select_user'),
]