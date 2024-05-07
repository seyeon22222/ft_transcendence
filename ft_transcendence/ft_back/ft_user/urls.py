from django.urls import path
from . import views
from ft_user.views import (
    UserViewSet, FriendView, 
    FriendRejectView ,FriendAcceptView,
    FriendDeleteView
)

app_name = "ft_user"

urlpatterns = [
	path('', views.firstpage, name="firstpage"),
    path('user_login/', views.user_login, name="login"),
    path('user_sign_up/', views.sign_up, name="sign_up"),
    path("user_logout/", views.logout_page, name = "logout"),
    path("user_login_suc/", views.login_suc, name = "success"),
    path("user_pong/", views.pong_with_com, name = "pong_with_computer"),
    path('user_info/', UserViewSet.as_view(), name="user_info"),
    path('friends/', FriendView.as_view(), name='friends'),
    path('friends/<int:user_id>/accept/', FriendAcceptView.as_view(), name='accept-friend'),
    path('friends/<int:friend_request_id>/reject/', FriendRejectView.as_view(), name='reject-friend'),
    path('friends/<int:friend_request_id>/delete/', FriendDeleteView.as_view(), name='delete-friend'),
]
