from django.urls import path, re_path
from ft_user.views import (
    UserViewSet, User_login, Sign_up,
    Logout, CheckLogin, UserInfoChange, 
    UserImage, SelectUser, UserBlockRequest, 
    UserBlockCheckRequest, UserBlockReleaseRequest, LanguageSet
)
app_name = "ft_user"

urlpatterns = [
    path('user/info', UserViewSet.as_view(), name='user'),
    path('user/login', User_login.as_view(), name='login'),
    path('user/sign_up', Sign_up.as_view(), name='sign_up'),
    path('user/logout', Logout.as_view(), name='logout'),
    path('user/check_login', CheckLogin.as_view(), name="check_login"),
    path('profile_pictures/<str:filename>/', UserImage.as_view(), name="user_image_view"),
    path('user/change_info', UserInfoChange.as_view(), name='user_info_change'),
    path('user/block_request', UserBlockRequest.as_view(), name='user_block'),
    path('user/block_release_request', UserBlockReleaseRequest.as_view(), name='user_block_release'),
    path('user/block_check_request', UserBlockCheckRequest.as_view(),name='user_block_check_request'),
    path('user/language', LanguageSet.as_view(), name="language_setting"),
    re_path(r'info/', SelectUser.as_view(), name='select_user'),
]