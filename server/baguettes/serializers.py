"""
Serializers for the application.
"""
import re
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from baguettes.models import User, MenuItem, OrderItem, Order, CartItem


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'password', 'has_premium']
        extra_kwargs = {
            'password': {'write_only': True},  # Don't expose password in GET
        }

    def validate_password(self, value):
        # Check password length
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")

        # Check for uppercase, lowercase, number, and special character
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r"[@$!%*?&#^()\\-_=+{}[\]:;\"'|<>,./]", value):
            raise serializers.ValidationError("Password must contain at least one special character.")

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
        fields = ['id', 'name', 'description', 'type', 'price', 'is_premium']


class OrderItemSerializer(serializers.ModelSerializer):
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), source='item'
    )
    order = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all()
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'amount', 'item_id', 'order']
        extra_kwargs = {
            'order': {'required': True},
            'item_id': {'required': True},
            'amount': {'required': True}
        }

    def create(self, validated_data):
        order = validated_data['order']
        item = validated_data['item']
        amount = validated_data['amount']
        existing = OrderItem.objects.filter(order=order, item=item).first()
        if existing:
            existing.amount += amount
            existing.save()
            return existing
        return super().create(validated_data)


class OrderSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user'
    )
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user_id', 'order_items']

    def create(self, validated_data):
        user = validated_data['user']
        order_items_data = validated_data.pop('order_items')

        # Create order
        order = Order.objects.create(user=user)

        # Aggregate duplicate items
        item_amount_map = {}
        for item in order_items_data:
            item_id = item['item'].id
            amount = item['amount']
            item_amount_map[item_id] = item_amount_map.get(item_id, 0) + amount

        # Create each unique item once with total amount
        for item_id, total_amount in item_amount_map.items():
            OrderItem.objects.create(order=order, item_id=item_id, amount=total_amount)

        return order


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
