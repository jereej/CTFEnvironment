import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from './config';

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  item_id: number;
  amount: number;
}

interface Order {
  id: number;
  status: string;
  user_id: number;
  order_items: number[];
}

interface User {
  id: number;
  name: string;
}

const AdminOrders: React.FC = () => {
    // Define the state variables for orders, order items, menu items, and users
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem('isAdmin');
    if (!storedUser) {
      setError('This page is for administrative personnel only.');
      return;
    }

    fetchData();
  }, []);


  const fetchData = async () => {
    // Helper to fetch and normalize API responses
    const fetchEndpoint = (endpoint: string) =>
      axios.get(`${API_BASE}${endpoint}/`).then(res => res.data.results ?? res.data);

    try {
      const [fetchedOrders, fetchedOrderItems, fetchedMenuItems, fetchedUsers] = await Promise.all([
        fetchEndpoint("orders"),
        fetchEndpoint("order-items"),
        fetchEndpoint("menu-items"),
        fetchEndpoint("users"),
      ]);

      // Sort orders by descending ID
      fetchedOrders.sort((a: Order, b: Order) => b.id - a.id);

      // Update state
      setOrders(fetchedOrders);
      setOrderItems(fetchedOrderItems);
      setMenuItems(fetchedMenuItems);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const findUserName = (id: number) => users.find(u => u.id === id)?.name || `User #${id}`;
  const findOrderItem = (id: number) => orderItems.find(oi => oi.id === id);
  const findMenuItem = (id: number) => menuItems.find(mi => mi.id === id);

  const getTotal = (order: Order) => {
    // Calculate the total price of the order
    return order.order_items.reduce((total, orderItemId) => {
      const oi = findOrderItem(orderItemId);
      const mi = oi ? findMenuItem(oi.item_id) : null;
      return oi && mi ? total + mi.price * oi.amount : total;
    }, 0).toFixed(2);
  };

  if (error) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-8">Manage Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {orders.map(order => (
        <div key={order.id} className="border rounded-lg p-4 mb-6 bg-gray-50 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-sm text-gray-600">User: {findUserName(order.user_id)}</p>
            </div>
          </div>

          <div className="pl-2 border-l-4 border-blue-400">
            {order.order_items?.map(id => {
              const oi = findOrderItem(id);
              const mi = oi ? findMenuItem(oi.item_id) : null;
              return oi && mi ? (
                <div key={oi.id} className="flex justify-between items-center text-sm mb-1">
                  <span>{mi.name} × {oi.amount}</span>
                  <span>{(oi.amount * mi.price).toFixed(2)} €</span>
                </div>
              ) : null;
            })}
          </div>

          <div className="text-right font-bold mt-2">
            Total: {getTotal(order)} €
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
