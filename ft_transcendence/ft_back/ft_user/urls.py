from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from ft_user.views import (
    UserViewSet, FriendView, 
    FriendRejectView ,FriendAcceptView,
    FriendDeleteView, User_login, Sign_up,
)

app_name = "ft_user"

# urlpatterns = [
# 	path('', views.firstpage, name="firstpage"),
#     path('user_login/', views.user_login, name="login"),
#     path('user_sign_up/', views.sign_up, name="sign_up"),
#     path("user_logout/", views.logout_page, name = "logout"),
#     path("user_login_suc/", views.login_suc, name = "success"),
#     path("user_pong/", views.pong_with_com, name = "pong_with_computer"),
#     path('user_info/', UserViewSet.as_view(), name="user_info"),
#     path('friends/', FriendView.as_view(), name='friends'),
#     path('friends/<int:user_id>/accept/', FriendAcceptView.as_view(), name='accept-friend'),
#     path('friends/<int:friend_request_id>/reject/', FriendRejectView.as_view(), name='reject-friend'),
#     path('friends/<int:friend_request_id>/delete/', FriendDeleteView.as_view(), name='delete-friend'),
# ]

router = DefaultRouter()
router.register(r'user/info', UserViewSet, basename='user')
router.register(r'user/login', User_login, basename='user_login')
router.register(r'user/sign_up', Sign_up, basename='sign_up')
router.register(r'friends', FriendView, basename='friend')
router.register(r'friends/accept/', FriendAcceptView, basename='accept')
router.register(r'friends/reject', FriendRejectView, basename='reject')
router.register(r'friends/delete', FriendDeleteView, basename='delete')

urlpatterns = [
	path('', views.firstpage, name="firstpage"),
    path("user/logout/", views.logout_page, name = "logout"),
    path("user/login_suc/", views.login_suc, name = "success"),
    path("user/pong/", views.pong_with_com, name = "pong_with_computer"),
    path('', include(router.urls)),
]