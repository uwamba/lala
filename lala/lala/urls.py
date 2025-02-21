from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rentals.views import verify_token
from rentals.views import google_auth


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('rentals.urls')),  # Include the app's URLs here
    path('auth/google/', google_auth, name='google_auth'),
    path('verify-token/', verify_token, name='verify_token'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
