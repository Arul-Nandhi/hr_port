from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('hr_management.api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all: serve React's index.html for any non-API/non-admin route
# This must be LAST so it doesn't override API and admin routes
if settings.REACT_BUILD_DIR.exists():
    urlpatterns += [
        re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html'), name='react_app'),
    ]
