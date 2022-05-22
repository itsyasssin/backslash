import os

import cv2
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core import files, validators
from django.db import models
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _
from posts.models import Tag, Post


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
    profile = models.ImageField(_('profile image'), blank=True, upload_to='users/')
    first_name = last_name = None  # use name instead of first_name and last_name
    fallowing_users = models.ManyToManyField('self', symmetrical=False, blank=True)
    fallowing_tags = models.ManyToManyField('posts.tag', blank=True)

    @property
    def tags(self):
        return self.fallowing_tags.all()

    def add_fallowing(self, pk):
        tag = Tag.objects.get(pk=pk)
        self.fallowing_tags.add(tag)
        return self.tags

    @property
    def fallowings(self):
        return self.fallowing_users.all()

    @property
    def posts(self):
        return Post.objects.filter(user=self)

    @property
    def fallowers(self):
        return MyUser.objects.filter(fallowing_users=self)

    def add_fallowing(self, pk):
        user = MyUser.objects.get(pk=pk)
        self.fallowing_users.add(user)
        return self.fallowings

    def del_fallowing(self, pk):
        user = MyUser.objects.get(pk=pk)
        self.fallowing_users.remove(user)
        return self.fallowings

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

            path = f'{settings.USER_PATH}/{self.pk}/'
            if not os.path.exists(path):
                os.mkdir(path)
            path += f'{self.pk}-profile.png'

            self.profile.delete()
            cv2.imwrite(path, img)

            self.profile = files.File(open(path, 'rb')).name.replace('web/users', '')
            self.save()
            return True

        except:
            return False

    def as_json(self):
        data = {
            'id': self.pk,
            'username': self.username,
            'name': self.name,
            'bio': self.bio,
            'email': self.email,
            'profile': self.profile.url if self.profile else '',
        }
        return data

    def fallowings_as_json(self):
        return [u.as_json() for u in self.fallowers]

    def fallowers_as_json(self):
        return [u.as_json() for u in self.fallowers]

    def tags_as_json(self):
        return [t.as_json() for t in self.tags]

    def posts_as_json(self):
        return [i.as_json() for i in self.posts]
