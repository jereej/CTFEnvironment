import { Routes, Route, useLocation } from 'react-router-dom';
// Importing page components
import Home from "./Home";
import Menu from './Menu';
import Login from './Login';
import Orders from './Orders';
import NavBar from './NavBar';
import BackRooms from './BackRooms';
import Mail from './Mail';
import OMS from './OMS';
// Admin components
import AdminLogin from './AdminLogin';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
// Other components
import NotFound from './NotFound';

const App: React.FC = () => {
  const location = useLocation();

  // Hide navbar only on /backrooms
  const hideNav = location.pathname.startsWith("/backrooms");

  return (
    <>
      {!hideNav && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/backrooms" element={<BackRooms />} />
        <Route path="/backrooms/mail" element={<Mail />} />
        <Route path="/backrooms/oms" element={<OMS />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/orders" element={<AdminOrders />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;