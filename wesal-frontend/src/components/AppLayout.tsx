import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <div className="container mt-5 flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}