import { Routes, Route } from 'react-router-dom';
// Importing page components
import Home from "./Home";
import Menu from './Menu';
import Login from './Login';
import Orders from './Orders';
import NavBar from './NavBar';
// Admin components
import AdminLogin from './AdminLogin';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
// Other components
import NotFound from './NotFound';

const App: React.FC = () => {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/menu" element={<AdminMenu />} />
      <Route path="/admin/orders" element={<AdminOrders />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
};
export default App;