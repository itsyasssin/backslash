from django.shortcuts import redirect, render
from .models import Token

def auth(request):
    if request.user.is_authenticated:
        return redirect('/')
    title  = request.META['PATH_INFO'].split("/")[2].replace('-',' ').capitalize()
    return render(request, 'index.html', {'title': title})

def reset_pass(request):
    context = {'title': 'Reset password'}
    user = request.user
    if user.is_authenticated:
        # TODO: send email
        print(f"toke: {Token.generate(user).pk}")
        context['token_sent'] = 1

    return render(request, 'index.html', context)

def change_pass(request):
    context = {'title': 'Change password'}
    token = request.GET.get('token','')
    if Token.check_token(token):
        context['is_valid'] = 1
        
    return render(request, 'index.html', context)
