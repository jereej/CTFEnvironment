"""
Serializers for the application.
"""
import re
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from baguettes.models import User, MenuItem, OrderItem, Order, CartItem, PlayerProgress

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'password', 'has_premium', 'bad_password']
        extra_kwargs = {
            'password': {'write_only': True},  # Don't expose password in GET
            'bad_password': {'write_only': True, 'required': False},
        }

    def validate_password(self, value):
        errors = []
        if len(value) < 8:
            errors.append("Password must be at least 8 characters long.")
        if not re.search(r"[A-Z]", value):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", value):
            errors.append("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", value):
            errors.append("Password must contain at least one number.")
        if not re.search(r"[@$!%*?&#^()\\-_=+{}[\]:;\"'|<>,./]", value):
            errors.append("Password must contain at least one special character.")
        if errors:
            raise serializers.ValidationError(errors)

        return value
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the MenuItem model.
    """
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'type', 'price', 'is_premium', 'is_initiated_as_premium']


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


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the CartItem model.
    """
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user'
    )
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), source='item'
    )

    class Meta:
        model = CartItem
        fields = ['id', 'user_id', 'item_id', 'amount']


class PlayerProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProgress
        fields = ['session_id', 'task1_done', 'task2_done', 'task3_done', 'task4_done']
