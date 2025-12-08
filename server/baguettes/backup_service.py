from baguettes.models import BackupSnapshot, User, MenuItem, Order, OrderItem, CartItem
from django.forms.models import model_to_dict

def create_snapshot():
    snapshot = {
        "users": [model_to_dict(u) for u in User.objects.all()],
        "menu_items": [model_to_dict(m) for m in MenuItem.objects.all()],
        "orders": [model_to_dict(o) for o in Order.objects.all()],
        "order_items": [model_to_dict(i) for i in OrderItem.objects.all()],
        "cart_items": [model_to_dict(c) for c in CartItem.objects.all()],
    }
    return snapshot

def save_snapshot():
    data = create_snapshot()
    BackupSnapshot.objects.create(data=data)

def restore_latest_snapshot():
    snapshot = BackupSnapshot.objects.latest("created_at").data

    # Wipe tables in correct dependency order
    CartItem.objects.all().delete()
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    MenuItem.objects.all().delete()
    User.objects.all().delete()

    # Restore Users
    user_map = {}
    for u in snapshot["users"]:
        old_id = u.pop("id")
        user = User.objects.create(**u)
        user_map[old_id] = user

    menu_item_map = {}
    for m in snapshot["menu_items"]:
        old_id = m.pop("id")
        menu_item = MenuItem.objects.create(**m)
        menu_item_map[old_id] = menu_item

    # Restore Orders
    order_map = {}
    for o in snapshot["orders"]:
        old_id = o.pop("id")
        user_id = o.pop("user", None) or o.pop("user_id")

        order = Order.objects.create(
            user=user_map[user_id],
            **o
        )
        order_map[old_id] = order

    # Restore OrderItems
    for i in snapshot["order_items"]:
        order_id = i.pop("order", None) or i.pop("order_id")
        item_id = i.pop("item", None) or i.pop("item_id")

        OrderItem.objects.create(
            order=order_map[order_id],
            item=menu_item_map[item_id],
            **i
        )

    # Restore CartItems
    for c in snapshot["cart_items"]:
        user_id = c.pop("user", None) or c.pop("user_id")
        item_id = c.pop("item", None) or c.pop("item_id")

        CartItem.objects.create(
            user=user_map[user_id],
            item=menu_item_map[item_id],
            **c
        )
