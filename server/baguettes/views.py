"""
This module contains the views for the REST API.
"""
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from django.contrib.auth.hashers import check_password
from django.utils.crypto import get_random_string

from baguettes.models import User, MenuItem, OrderItem, Order, CartItem, PlayerProgress
from baguettes.serializers import UserSerializer, MenuItemSerializer, OrderItemSerializer, OrderSerializer, CartItemSerializer, PlayerProgressSerializer


@extend_schema_view(
    list=extend_schema(summary="List users", description="Retrieve a paginated list of all users.",
                       responses={200: UserSerializer}),
    create=extend_schema(summary="Create user", description="Create a new user with the provided information.",
                         request=UserSerializer, responses={201: UserSerializer, 400: None}),
    retrieve=extend_schema(summary="Retrieve user", description="Get details of a specific user by ID.",
                           responses={200: UserSerializer, 404: None}),
    update=extend_schema(summary="Update user", description="Update all fields of a user.",
                         request=UserSerializer, responses={200: UserSerializer, 400: None, 404: None}),
    partial_update=extend_schema(summary="Partially update user", description="Update one or more fields of a user.",
                                 request=UserSerializer, responses={200: UserSerializer, 400: None, 404: None}),
    destroy=extend_schema(summary="Delete user", description="Delete a user by ID.", responses={204: None, 404: None}),
    orders=extend_schema(summary="List user orders", description="Retrieve all orders for a specific user.",
                         responses={200: OrderSerializer}),
    cart_items=extend_schema(summary="List user cart items", description="Retrieve all cart items for a specific user.",
                         responses={200: CartItemSerializer}))
class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    search_fields = ['name']

    @action(detail=True, methods=['get'])
    # pylint: disable=unused-argument
    def orders(self, request, pk=None):
        """
        Retrieve all orders for a specific user.
        """
        user = self.get_object()
        orders = user.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='cart-items') 
    # pylint: disable=unused-argument
    def cart_items(self, request, pk=None):
        """
        Retrieve all cart items for a specific user.
        """
        user = self.get_object()
        cart_items = user.cart_items.all()
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        bad_pwd = get_random_string(12)   # random 12-char string to fill out the bad password field
        serializer.save(bad_password=bad_pwd)


@extend_schema_view(
    list=extend_schema(summary="List menu items", description="Retrieve a paginated list of all menu items.",
                       responses={200: MenuItemSerializer}),
    create=extend_schema(summary="Create menu item", description="Create a new menu item with the provided details.",
                         request=MenuItemSerializer, responses={201: MenuItemSerializer, 400: None}),
    retrieve=extend_schema(summary="Retrieve menu item", description="Get details of a specific menu item by ID.",
                           responses={200: MenuItemSerializer, 404: None}),
    update=extend_schema(summary="Update menu item", description="Update all fields of a menu item.",
                         request=MenuItemSerializer, responses={200: MenuItemSerializer, 400: None, 404: None}),
    partial_update=extend_schema(summary="Partially update menu item",
                                 description="Update one or more fields of a menu item.", request=MenuItemSerializer,
                                 responses={200: MenuItemSerializer, 400: None, 404: None}),
    destroy=extend_schema(summary="Delete menu item", description="Delete a menu item by ID.",
                          responses={204: None, 404: None}))
class MenuItemViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing menu items.
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


@extend_schema_view(
    list=extend_schema(summary="List orders", description="Retrieve a paginated list of all orders.",
                       responses={200: OrderSerializer}),
    create=extend_schema(summary="Create order",
                         description="Create a new order with the provided details.",
                         request=OrderSerializer, responses={201: OrderSerializer, 400: None}),
    retrieve=extend_schema(summary="Retrieve order",
                           description="Get details of a specific order by ID.",
                           responses={200: OrderSerializer, 404: None}),
    update=extend_schema(summary="Update order", description="Update all fields of an order.",
                         request=OrderSerializer,
                         responses={200: OrderSerializer, 400: None, 404: None}),
    partial_update=extend_schema(summary="Partially update order",
                                 description="Update one or more fields of an order.",
                                 request=OrderSerializer,
                                 responses={200: OrderSerializer, 400: None, 404: None}),
    destroy=extend_schema(summary="Delete order", description="Delete an order by ID.",
                          responses={204: None, 404: None}))
class OrderViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing orders.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save()


@extend_schema_view(
    list=extend_schema(summary="List order items", description="Retrieve a paginated list of all order items.",
                       responses={200: OrderItemSerializer}),
    create=extend_schema(summary="Create order item", description="Create a new order item with the provided details.",
                         request=OrderItemSerializer, responses={201: OrderItemSerializer, 400: None}),
    retrieve=extend_schema(summary="Retrieve order item", description="Get details of a specific order item by ID.",
                           responses={200: OrderItemSerializer, 404: None}),
    update=extend_schema(summary="Update order item", description="Update all fields of an order item.",
                         request=OrderItemSerializer, responses={200: OrderItemSerializer, 400: None, 404: None}),
    partial_update=extend_schema(summary="Partially update order item",
                                 description="Update one or more fields of an order item.", request=OrderItemSerializer,
                                 responses={200: OrderItemSerializer, 400: None, 404: None}),
    destroy=extend_schema(summary="Delete order item", description="Delete an order item by ID.",
                          responses={204: None, 404: None}))
class OrderItemViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing order items.
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


@extend_schema_view(
    list=extend_schema(summary="List cart items", description="Retrieve a list of all order items.",
                       responses={200: CartItemSerializer}),
    create=extend_schema(summary="Create cart item", description="Create a new cart item with the provided details.",
                         request=CartItemSerializer, responses={201: CartItemSerializer, 400: None}),
    retrieve=extend_schema(summary="Retrieve cart item", description="Get details of a specific cart item by ID.",
                           responses={200: CartItemSerializer, 404: None}),
    update=extend_schema(summary="Update cart item", description="Update all fields of an cart item.",
                         request=CartItemSerializer, responses={200: CartItemSerializer, 400: None, 404: None}),
    partial_update=extend_schema(summary="Partially update cart item",
                                 description="Update one or more fields of an cart item.", request=CartItemSerializer,
                                 responses={200: CartItemSerializer, 400: None, 404: None}),
    destroy=extend_schema(summary="Delete cart item", description="Delete a cart item by ID.",
                          responses={204: None, 404: None}))
class CartItemViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing order items.
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        item_id = request.data.get("item_id")
        amount = int(request.data.get("amount", 1))

        # Check if cart already has this item for this user
        try:
            existing = CartItem.objects.get(user_id=user_id, item_id=item_id)
            existing.amount += amount
            existing.save()
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except CartItem.DoesNotExist:
            # Normal creation
            return super().create(request, *args, **kwargs)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('name')
    password = request.data.get('password')
    session_id = request.data.get('session_id')

    if not username or not password:
        return Response({"error": "Username and password required."}, status=400)

    # Load or create player progress
    progress, _ = PlayerProgress.objects.get_or_create(session_id=session_id)

    # 1. BAD PASSWORD LOGIC - runs BEFORE validating username
    if not progress.task1_done:
        try:
            bad_user = User.objects.get(bad_password=password)
        except User.DoesNotExist:
            bad_user = None

        if bad_user:
            # If username matches the bad_password owner -> fake login
            if bad_user.name.lower() == username.lower():
                return Response({
                    "id": bad_user.id,
                    "name": bad_user.name,
                    "has_premium": bad_user.has_premium,
                })

            # Otherwise -> show hint message
            return Response(
                {"error": f"This password is already used by {bad_user.name}. Try another."},
                status=401
            )

    # 2. NORMAL LOGIN - after bad_password logic is bypassed/disabled
    try:
        user = User.objects.get(name__iexact=username)
    except User.DoesNotExist:
        return Response({"error": "Invalid username and password combination"}, status=401)

    if check_password(password, user.password):
        return Response({
            "id": user.id,
            "name": user.name,
            "has_premium": user.has_premium,
            "task1_solved": progress.task1_done
        })

    return Response({"error": "Invalid username and password combination"}, status=401)


@api_view(['GET'])
# pylint: disable=unused-argument
def get_progress(request, session_id):
    progress, _ = PlayerProgress.objects.get_or_create(session_id=session_id)
    serializer = PlayerProgressSerializer(progress)
    return Response(serializer.data)


@api_view(['POST'])
def complete_task(request):
    session_id = request.data.get("session_id")
    task_id = int(request.data.get("task_id"))

    progress, _ = PlayerProgress.objects.get_or_create(session_id=session_id)

    if task_id == 1:
        progress.task1_done = True
        progress.save()
        return Response({"flag": "flag{task1_flag_value}"})

    if task_id == 2:
        progress.task2_done = True
        progress.save()
        return Response({"flag": "flag{task2_flag_value}"})

    return Response({"error": "Invalid task"}, status=400)

@api_view(['POST'])
def init_session(request):
    session_id = request.data.get("session_id")

    if not session_id:
        return Response({"error": "session_id required"}, status=400)

    progress, created = PlayerProgress.objects.get_or_create(session_id=session_id)

    return Response({
        "session_id": progress.session_id,
        "created": created,
        "task1_done": progress.task1_done,
        "task2_done": progress.task2_done,
    })
