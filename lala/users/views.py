from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import json

def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            # Send the frontend the role or URL to redirect to
            return JsonResponse({"status": "ok", "role": "admin", "redirect_url": "/admin/dashboard"})

        return JsonResponse({"status": "failed", "message": "Invalid credentials"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=400)
