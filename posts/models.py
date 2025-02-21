from turtle import width
from django.db import models
from django.utils.translation import gettext_lazy as _


class Post(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name="user_posts")
    title = models.CharField(max_length=50)
    text =  models.TextField(max_length=20_000)
    date = models.DateTimeField(auto_now=True)
    slug = models.CharField(max_length=50)
    published = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', blank=True, related_name='taged_post')
    liked_users = models.ManyToManyField('accounts.MyUser', blank=True, related_name="liked_users")

    @property
    def like_count(self):
        return self.liked_users.all().count()

    def bookmark_post(self, user):
        if user in self.bookmarked_users.all():
            self.bookmarked_users.remove(user)
        else:
            self.bookmarked_users.add(user)

        return True

    def like_post(self, user):
        try:
            if user in self.liked_users.all():
                self.liked_users.remove(user)
            else:
                self.liked_users.add(user)
            return True
        except:
            return False

    def __str__(self):
        return f'{self.title}'
    
    def as_json(self, user=None):
        author_followed = user in self.user.followers if user else False
        liked = user in self.liked_users.all() if user else False
        bookmark = self in user.bookmarks if user else False

        data = {
            'id': self.pk,
            'user': self.user.as_json(user)|{"followed": author_followed },
            'title': self.title,
            'text': self.text,
            'date': self.date,
            'slug': self.slug,
            'isPub': self.published,
            'tags': [i.as_json() for i in self.tags.all()],
            'likes': self.like_count,
            'bookmark': bookmark,
            'liked': liked,
            'comments': self.comments.count()
        }
        return data

    @classmethod
    @property
    def latests(cls):
        return cls.objects.filter(published=True).order_by('-date')

    @property
    def comments(self):
        return self.post_comment.all().filter(replaied_to=None)

    @classmethod
    def followings(cls, user):
        result = []
        for i in user.followings:
            result += [post for post in i.posts]
        return result
        
    @classmethod
    @property
    def top(cls):
        query = list(cls.objects.all())
        query.sort(key=lambda post: post.like_count + len(post.text) * 0.01 + (post.date.timestamp()*2), reverse=True)
        return query[:100]

    @classmethod
    def search(cls, text):
        if text.isspace():
            return []

        query = list(cls.objects.filter(title__icontains=text, published=True))
        # use like count and post length and post date to roder 
        query.sort(key=lambda post: post.like_count + len(post.text) * 0.01 + (post.date.timestamp()*2), reverse=True)
        return query[:100]
        
    @classmethod
    def recommendeds(cls, user=None):
        # this is not a recommended system but work well :)
        if user:
            query = list(set(Post.objects.all())^set(user.readed.all()))
        else:
            query = list(Post.objects.all())
        
        query.sort(key=lambda x: x.like_count + (1.5*x.comments.count()) + (x.date.timestamp()) + ((100 if x.user in user.followings else 0) if user else 0), reverse=True)

        return query

class Tag(models.Model):
    name = models.SlugField(max_length=50, unique=True)

    @property
    def followers(self):
        return self.users.all()

    def as_json(self, user=None):
        data = {
            'id': self.pk, 
            'name': self.name,
            'followers': self.followers.count(),
            'followed':  self in user.tags if user else False
            }
        return data
        
        
    @classmethod
    @property
    def top(cls):
        query = list(cls.objects.all())
        query.sort(key=lambda tag: tag.followers.count(), reverse=True)
        return query[:100]

    @classmethod
    def search(cls, text):
        if text.isspace():
            return []

        query = list(cls.objects.filter(name__istartswith=text))
        query.sort(key=lambda tag: tag.followers.count(), reverse=True)
        return query[:100]

    @property
    def posts(self):
        return self.taged_post.filter(tags=self).order_by('-date')

    def __str__(self):
        return f'{self.name}'
    

class Comment(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name="user_comments")
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, related_name="post_comment")
    text =  models.TextField(max_length=1000)
    date = models.DateTimeField(auto_now=True)
    replaied_to = models.ForeignKey('self', on_delete=models.CASCADE, related_name="responses", null=True, blank=True)


    def as_json(self, with_res=True):
        data = {
            'id': self.pk,
            'user': self.user.as_json(),
            'text':  self.text,
            'data': self.date,
            'replaied_to': self.replaied_to.id if self.replaied_to else 0
            }
        if with_res:
            data['responses']= [i.as_json(False) for i in self.responses.all()]

        return data

    def __str__(self):
        return f'{self.user.name} > {self.post.title}'

class Image(models.Model):
    user = models.ForeignKey('accounts.MyUser', on_delete=models.CASCADE, related_name="user_images")
    image = models.ImageField(upload_to='images/')


class SiteSettings(models.Model):
    DEFAULT_NAME = 'Backslash'
    DEFAULT_DESC = 'A weblog :)'

    name = models.CharField(max_length=50,default=DEFAULT_NAME)
    favicon = models.ImageField(upload_to='images/', blank=True)
    description =  models.CharField(max_length=150, default=DEFAULT_DESC)

    @classmethod
    def get_data(cls):
        last = cls.objects.last()
        data = {}
        if last:
            data['name'] = last.name
            data['description'] = last.description
            data['favicon'] = last.favicon

        else:
            data['name'] = cls.DEFAULT_NAME      
            data['description'] = cls.DEFAULT_DESC      
            data['favicon'] = ''
            
        return data

