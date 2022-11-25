from django.urls import path
from .views import InboxView, InboxLikeView, InboxPostView, InboxCommentView, InboxFollowView

urlpatterns = [
  path('<str:aid>/inbox', InboxView.as_view()),
  path('<str:aid>/inbox/likes', InboxLikeView.as_view()),
  path('<str:aid>/inbox/posts', InboxPostView.as_view()),
  path('<str:aid>/inbox/comments', InboxCommentView.as_view()),
  path('<str:aid>/inbox/follows', InboxFollowView.as_view()),
]