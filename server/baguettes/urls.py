"""
URL configuration for the app.
"""

from django.urls import path, include
from rest_framework import routers

from baguettes.views import UserViewSet, MenuItemViewSet, OrderItemViewSet, OrderViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'order-items', OrderItemViewSet, basename='orderitem')
router.register(r'orders', OrderViewSet, basename='order')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
