import os
import django
import random
from django.contrib.auth.hashers import make_password


# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from baguettes.models import User, MenuItem, Order, OrderItem

lowercase = "abcdefghijklmnopqrstuvwxyz"
uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
numbers = "0123456789"
special = "!@#$%^&*()"
all_characters = lowercase + uppercase + numbers + special

# Support functions:

def generate_raw_password(length):
    """
    Generates a random password of specified length that meets complexity requirements.
    """
    password = [
        random.choice(lowercase),
        random.choice(uppercase),
        random.choice(numbers),
        random.choice(special),
    ]

    password += [random.choice(all_characters) for _ in range(length - 4)]
    random.shuffle(password)

    plaintext = ''.join(password)
    return plaintext

def get_next_available_user_number():
    """
    Finds the next available number for a username in the format 'UserX'.
    """
    existing_users = User.objects.filter(name__startswith="User").values_list("name", flat=True)
    
    used_numbers = set()
    for name in existing_users:
        if name.startswith("User") and name[4:].isdigit():
            used_numbers.add(int(name[4:]))
    
    new_number = 0
    while new_number in used_numbers:
        new_number += 1

    return new_number

def get_next_available_item_number(item_type):
    """
    Finds the next available number for a menu item with the given type.
    
    Args:
        item_type (str): The type of the menu item (e.g., "sandwich", "drink").
    
    Returns:
        int: The next available number for that item type.
    """
    existing_items = MenuItem.objects.filter(name__startswith=item_type).values_list("name", flat=True)
    
    used_numbers = set()
    for name in existing_items:
        parts = name.split()
        if len(parts) > 1 and parts[-1].isdigit():
            used_numbers.add(int(parts[-1]))

    new_number = 1
    while new_number in used_numbers:
        new_number += 1

    return new_number

# Population functions:

def populate_users(n=10):
    """
    Populates the User model with random user data.

    Args:
        n (int): Number of users to create.
    """
    users_created = 0
    for _ in range(n):
        new_number = get_next_available_user_number()
        name = f"User{new_number}"

        raw_password = generate_raw_password(random.randint(8, 15)) 
        encoded_password = make_password(raw_password)
        has_premium = random.choice([True, False])
        bad_password = ''.join(random.choices(all_characters, k=10))

        user = User.objects.create(
            name=name,
            password=encoded_password,
            has_premium=has_premium,
            bad_password=bad_password
        )
        users_created += 1
        print(f"Created User {user.id}: {name}")

    print(f"\nSuccessfully created {users_created} users.\n")

    #create Britney's account
    User.objects.create(
        name="brittnney13",
        password="Abcd1234!",
        has_premium=True,
        bad_password="abcd1234"
    )

def populate_menuitem(n=10):
    """
    Populates the MenuItem model with random data.

    Args:
        n (int): Number of menu items to create.
    """
    item_types = ["sandwich", "drink", "side dish", "dessert"]
    menuitems_created = 0

    for _ in range(n):
        item_type = random.choice(item_types)
        new_number = get_next_available_item_number(item_type)
        name = f"{item_type} {new_number}"
        description = f"Description for {item_type} {new_number}"
        price = round(random.uniform(5.0, 35.0), 2)
        is_premium = random.choice([True, False])
        
        menu_item = MenuItem.objects.create(name=name, description=description, type=item_type, price=price, is_premium=is_premium)
        menuitems_created += 1
        print(f"Created MenuItem {menu_item.id}: {name}")

    print(f"\nSuccessfully created {menuitems_created} menu items.\n")

def populate_orders_and_orderitems(n=10):
    """
    Populates the Order model with random data.

    Args:
        n (int): Number of orders to create.
    """
    new_orders_list = []

    users = list(User.objects.all())  # Fetch all users once
    menu_items = list(MenuItem.objects.all())  # Fetch all menuitems once

    if not users:
        print("No users found. Please populate the User model first.")
        return
    
    if not menu_items:
        print("No menuitems found. Please populate the MenuItems model first.")
        return

    orders_created = 0
    order_items_created = 0

    for _ in range(n):

        user = random.choice(users)
        
        new_order = Order.objects.create(user=user)
        orders_created += 1
        print(f"Created Order {new_order.id} for {user.name}")
        new_orders_list.append(new_order)

    print(f"\nSuccessfully created {orders_created} orders.\n")
    
    for _ in range(n):

        menuitem_type = random.choice(menu_items)
        quantity = random.randint(1,4)
        order = random.choice(new_orders_list)
        
        order_item = OrderItem.objects.create(item=menuitem_type, amount=quantity, order=order)
        order_items_created += 1
        print(f"Created Order Item {order_item.id} with {quantity} x {menuitem_type.name} for Order {order.id}")

    print(f"\nSuccessfully created {order_items_created} order items.\n")

# Run the script
if __name__ == "__main__":
    # Adjust the number as needed
    n = 20
    populate_users(n)
    populate_menuitem(n)
    populate_orders_and_orderitems(n)
