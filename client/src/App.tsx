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
import Shop from './Shop';
import BackRooms from './BackRooms';
import Mail from './Mail';
import Terminal from './Terminal';
import SubmitFlags from './SubmitFlags';
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

  // Hide navbar on /backrooms and /submit-flags routes
  const hiddenNavPaths = ["/backrooms", "/submit-flags", "/shop"];

  const hideNav = hiddenNavPaths.some(path =>
  location.pathname.startsWith(path)
);

  return (
    <>
      {!hideNav && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/backrooms" element={<BackRooms />} />
        <Route path="/backrooms/mail" element={<Mail />} />
        <Route path="/backrooms/terminal" element={<Terminal />} />
        <Route path="/submit-flags" element={<SubmitFlags />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/orders" element={<AdminOrders />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;