from django.urls import path
from .views import *


app_name = 'api'

urlpatterns = [
    # just for authorized users
    path('accounts/change-password', change_password, name='change_password'),
    path('accounts/log-out', log_out, name='log_out'),
    path('accounts/delete', delete_account, name='delete_account'),
    path('accounts/kill-other', kill_all_other, name='kill_all_other'),
    path('accounts/reset', reset_pass, name='reset_pass'),
    path('accounts/reset-password', reset_pass_form, name='reset_pass_form'),
    path('write', write, name='write'),
    path('write/<id>', edit_post, name='edit_post'),
    path('write/<id>/status', post_status, name='post_status'),
    path('@<username>/<slug>/like', like_post, name='like_post'),
    path('@<username>/<slug>/bookmark', bookmark_post, name='bookmark_post'),
    path('comments/<int:id>', get_post_comments, name='get_post_comments'),
    path('follow/@<username>', follow_people, name='follow_people'),
    path('follow/<name>', follow_tags, name='follow_tags'),
    path('me/followers', my_followers, name='my_followers'),
    path('me/followings', my_followings, name='my_followings'),
    path('me/tags', my_tags, name='my_tags'),
    path('me/posts', my_pub_posts, name='my_pub_posts'),
    path('me/dposts', my_draft_posts, name='my_draft_posts'),
    path('me', me, name='me'),
    path('me/bookmarks', bookmarks, name='bookmarks'),
    path('me/edit', edit, name='edit'),
    path('upload', upload_image, name='upload_image'),
    path('delete/<int:id>', delete_post, name='delete_post'),

    # for all users 
    path('accounts/login', sign_in, name='sign_in'),
    path('accounts/join', sign_up, name='sign_up'),
    path('posts/@<username>', people_posts, name='people_posts'),
    path('posts/<name>', tag_posts, name='tag_posts'),
    path('t/<name>', tag, name='tag'),
    path('p/<id>', post_detail_with_id, name='post_id'),
    path('@<username>', people, name='people'),
    path('@<username>/<slug>', post_detail, name='post'),
    path('add-comment', add_comment, name='add_comment'),
    path('rec', rec_posts, name='rec_posts'),
    path('latests', latest_posts, name='latest_posts'),
    path('top-tags', top_tags, name='top_tags'),
    path('top-users', top_users, name='top_users'),
    path('top-posts', top_posts, name='top_posts'),
    path('search-tags', search_tags, name='search_tags'),
    path('search-users', search_users, name='search_users'),
    path('search-posts', search_posts, name='search_posts'),
    path('base/', base_home, name='base_home'),
    path('base/search', base_search, name='base_search'),
    path('base/bookmarks', base_bookmarks, name='base_bookmarks'),
    path('base/me', base_me, name='base_me'),
    path('base/@<username>', base_user, name='base_user'),
]
