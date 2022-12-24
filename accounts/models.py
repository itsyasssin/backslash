import os
from uuid import uuid4

import cv2
from django.conf import settings
from datetime import datetime, timedelta, timezone
from django.contrib.auth.models import AbstractUser
from django.core import files, validators
from django.db import models
from django.db.models import Q
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

@deconstructible
class UsernameValidator(validators.RegexValidator):
    regex = r'^(?!.*\.\.)(?!.*\.$)[^\W][a-z0-9_.]{2,29}$'
    message = _('Enter a valid username (eg. user_name)')


class MyUser(AbstractUser):

    username_validator = UsernameValidator()

    username = models.CharField(_('username'), unique=True, max_length=30, validators=[username_validator])
    name = models.CharField(_('full name'), blank=True, max_length=50)
    bio = models.CharField(_('biography'), blank=True, max_length=150)
    email = models.EmailField(_('email address'), unique=True)
    profile = models.ImageField(_('profile image'), default='simple.jpg', upload_to='users/')
    first_name = last_name = None  # use name instead of first_name and last_name
    following_users = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='follower_users')
    following_tags = models.ManyToManyField('posts.tag', blank=True, related_name='users')
    bookmarks_post = models.ManyToManyField('posts.Post', blank=True, related_name='bookmarked_users')
    readed = models.ManyToManyField('posts.Post', blank=True, related_name='readed')
    verified = models.BooleanField(_("verified"), default=False)
    
    
    @property
    def tags(self):
        return self.following_tags.all()

    @property
    def bookmarks(self):
        return self.bookmarks_post.all().order_by('-date')

    @property
    def images(self):
        return self.user_images.all()

    @property
    def images_size(self):
        return sum([i.image.size for i in self.images])

    @property
    def followings(self):
        return self.following_users.all()

    @property
    def posts(self):
        return self.user_posts.filter(user=self, published=True)

    @property
    def dposts(self):
        return self.user_posts.filter(user=self, published=False)

    @property
    def followers(self):
        return self.follower_users.all()

    def __str__(self) -> str:
        return f"{self.username}"

    def set_profile(self, img, ColorConversionCode=cv2.COLOR_BGR2RGB):
        '''
        output-size : 400*400
        output-path : users/(user.id)/(user.id)-profile.png 
        '''

        try:
            imageY, imageX = img.shape[0], img.shape[1]

            maxSize = imageX if imageX < imageY else imageY
            x = 0 if imageY < imageX else int(imageY/2-(maxSize/2))
            y = 0 if imageX < imageY else int(imageX/2-(maxSize/2))

            img = img[x:x+maxSize, y:y+maxSize]
            img = cv2.cvtColor(img, ColorConversionCode)

            img = cv2.resize(img, settings.PROFILE_SIZE)

            path = f'{settings.USER_PATH}/'
            if not os.path.exists(path):
                os.mkdir(path)
            path += f'{uuid4()}.png'

            self.profile.delete()
            cv2.imwrite(path, img)

            self.profile = files.File(open(path, 'rb')).name.replace('web/media', '')
            self.save()
            return True

        except:
            return False

    def as_json(self, user=None):
        data = {
            'id': self.pk,
            'username': self.username,
            'name': self.name,
            'bio': self.bio,
            'email': self.email,
            'profile': self.profile.url if self.profile else '',
            'followers': self.followers.count(),
            'followings' : self.followings.count(),
            'tags': self.tags.count(),
            'followed': (user in self.followers) or (user in self.tags) if user else False,
        }
        return data

    def follow_people(self, user):
        if user in self.followings:
            self.following_users.remove(user)
        else:
            self.following_users.add(user)
            
        return True

    def follow_tags(self, tag):
        if tag in self.tags:
            self.following_tags.remove(tag)
        else:
            self.following_tags.add(tag)
            
        return True

    @classmethod
    @property
    def top(cls):
        query = list(cls.objects.all())
        query.sort(key=lambda user: user.followers.count() + (user.posts.count()*2))
        return query[:100]
        
    @classmethod
    def search(cls, text):
        if text.isspace():
            return []

        query = list(cls.objects.filter(Q(name__icontains=text)|Q( username__istartswith=text)))
        query.sort(key=lambda user: user.followers.count() + (user.posts.count()*2))
        return query[:100]

    
    def send_email(self, subject, plaintext, htmltext, context):
        plain = get_template(plaintext).render(context)
        html = get_template(htmltext).render(context)
        msg = EmailMultiAlternatives(subject, plain, to=[self.email])
        msg.attach_alternative(html, 'text/html')
        return msg.send()



class Token(models.Model):
    id = models.CharField(max_length=200, unique=True, primary_key=True)
    user = models.ForeignKey('accounts.MyUser', verbose_name=_("کاربر"), on_delete=models.CASCADE, related_name="user_tokens")
    date = models.DateTimeField(auto_now=True)
    
    @classmethod
    def generate(cls, user):
        id = str(uuid4()).replace('-','')
        cls.objects.filter(user=user).delete()
        return cls.objects.create(id=id, user=user)

    @classmethod
    def check_token(cls, token):
        try:

            token = cls.objects.get(pk=token)
            now = datetime.now(tz=timezone.utc)
            return token if now - token.date < timedelta(minutes=5) else False
            
        except:
            return False

    def __str__(self):
        return self.user.username
