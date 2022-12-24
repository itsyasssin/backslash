from django.middleware import csrf
from posts.models import SiteSettings

def token(request):
    data  =  SiteSettings.get_data()
    print(data)
    return {
        'csrfmiddlewaretoken': csrf.get_token(request),
        'host': request.get_host(),
        'sitename': data['name'],
        'favicon': data['favicon'],
        'description': data['description'],
        }
