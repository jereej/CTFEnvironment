"""
This module contains the views for the REST API.
"""
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from django.contrib.auth.hashers import check_password


from baguettes.models import User, MenuItem, OrderItem, Order, CartItem
from baguettes.serializers import UserSerializer, MenuItemSerializer, OrderItemSerializer, OrderSerializer, CartItemSerializer


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
                         responses={200: OrderSerializer}))
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

    def perform_create(self, serializer):
        serializer.save()


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
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def create(self, request, *args, **kwargs):
        order_id = request.data.get('order')
        item_id = request.data.get('item_id')
        amount = int(request.data.get('amount', 0))
        existing = OrderItem.objects.filter(order_id=order_id, item_id=item_id).first()
        if existing:
            existing.amount += amount
            existing.save()
            serializer = self.get_serializer(existing)
            return Response(serializer.data)
        return super().create(request, *args, **kwargs)


@extend_schema_view(
    list=extend_schema(summary="List cart items", description="Retrieve a list of all cart items.",
                       responses={200: CartItemSerializer}),
    create=extend_schema(summary="Create cart item", description="Create a new cart item with the provided details.",
                         request=CartItemSerializer, responses={201: CartItemSerializer, 400: None}),
    retrieve=extend_schema(summary="Retrieve cart item", description="Get details of a specific cart item by ID.",
                           responses={200: CartItemSerializer, 404: None}),
    update=extend_schema(summary="Update cart item", description="Update all fields of a cart item.",
                         request=CartItemSerializer, responses={200: CartItemSerializer, 400: None, 404: None}),
    partial_update=extend_schema(summary="Partially update cart item",
                                 description="Update one or more fields of a cart item.", request=CartItemSerializer,
                                 responses={200: CartItemSerializer, 400: None, 404: None}),
    destroy=extend_schema(summary="Delete cart item", description="Delete a cart item by ID.",
                          responses={204: None, 404: None}))
class CartItemViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing cart items.
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer


@api_view(['POST'])
def login_view(request):
    username = request.data.get('name')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"error": "Username and password required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Try to find the user by name (case-insensitive)
        user = User.objects.get(name__iexact=username)
    except User.DoesNotExist:
        return Response({"error": "Invalid username and password combination"}, status=status.HTTP_401_UNAUTHORIZED)

    # Check the password using Django's password checker
    if check_password(password, user.password):
        return Response({
            "id": user.id,
            "name": user.name,
            "has_premium": user.has_premium,
        })
    else:
        return Response({"error": "Invalid username and password combination"}, status=status.HTTP_401_UNAUTHORIZED)
