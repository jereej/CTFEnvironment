"""
Serializers for the application.
"""
from rest_framework import serializers

from baguettes.models import User, MenuItem, OrderItem, Order


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'password', 'has_premium']

class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the MenuItem model.
    """
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'type', 'price', 'is_premium']


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the OrderItem model.
    """
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), source='item'
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'amount', 'item_id', 'order']


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for the Order model.
    """
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user'
    )

    order_items = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=OrderItem.objects.all()
    )

    class Meta:
        model = Order
        fields = ['id', 'user_id', 'order_items']
