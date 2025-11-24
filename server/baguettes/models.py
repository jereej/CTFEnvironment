"""Models for the application."""
from django.db import models

class User(models.Model):
    """Represents a user/client that can make orders."""
    name = models.CharField(max_length=64, unique=True)
    password = models.CharField(max_length=128)
    has_premium = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
    
    
class MenuItem(models.Model):
    """Represents a menu item that can be ordered."""
    name = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=255)
    type = models.CharField(max_length=20, default="main course")
    price = models.FloatField()
    is_premium = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} (${self.price})"


class Order(models.Model):
    """Represents an order made by a user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"Order {self.id} by {self.user.name}"


class OrderItem(models.Model):
    """Represents an item in an order."""
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    amount = models.IntegerField()
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.amount}x {self.item.name}"
    

class CartItem(models.Model):
    """Represents an item and its amount and in a cart, and the user who has the item in their cart."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    amount = models.IntegerField()

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.amount}x {self.item.name} in cart"