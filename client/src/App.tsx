import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from './config';

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

function getOrCreateSessionId(): string {
  let id = localStorage.getItem("ctf_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ctf_session_id", id);
    console.log("Created new CTF session:", id);
  }
  return id;
}

const App: React.FC = () => {
  const location = useLocation();

  // Create session ID once on app startup
  useEffect(() => {
    const id = getOrCreateSessionId();

    axios.post(`${API_BASE}session/init/`, {
      session_id: id
    });    
  }, []);

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