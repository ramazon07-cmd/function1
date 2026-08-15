from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'Function Backend API',
        'auth': '/api/auth/',
        'subjects': '/api/subjects/',
        'courses': '/api/courses/',
        'tests': '/api/tests/',
        'attempts': '/api/attempts/',
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/auth/', include('apps.users.urls')),
    path('api/', include('apps.learning.urls')),
]
