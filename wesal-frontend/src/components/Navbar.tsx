import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBagCount } from "../utils/bag";
import logo from "../assets/wesal-logo.png"; 

import { FiHome, FiBox, FiShoppingBag, FiPieChart, FiUsers, FiDollarSign, FiLogOut, FiUser, FiShield, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [bagCount, setBagCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setBagCount(getBagCount());
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("bag-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("bag-updated", update);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div 
        className={`navbar-backdrop ${isOpen ? 'show' : ''}`} 
        onClick={closeMenu}
      />

      <nav className="navbar navbar-expand-xl fixed-top navbar-floating">
        <div className="container-fluid px-4">
          
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center gap-2 me-5" to="/" onClick={closeMenu}>
            <img src={logo} alt="Wesal" height="35" className="rounded-2" />
          </Link>

          {/* Hamburger Button */}
          <button 
            className="navbar-toggler border-0 shadow-none p-0 text-primary" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>

          {/* Menu Items */}
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarContent">
            
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-1 mt-3 mt-xl-0">
              
              <li className="nav-item w-100 text-center text-xl-start">
                <NavLink className="nav-link px-3 py-2" to="/" onClick={closeMenu}>
                  <FiHome size={18} /> 
                  <span className="ms-2 fw-medium">Dashboard</span> 
                </NavLink>
              </li>

              <li className="nav-item w-100 text-center text-xl-start">
                <NavLink className="nav-link px-3 py-2" to="/products" onClick={closeMenu}>
                  <FiBox size={18} />
                  <span className="ms-2 fw-medium">Products</span>
                </NavLink>
              </li>
              
              <li className="nav-item w-100 text-center text-xl-start">
                <NavLink className="nav-link px-3 py-2 position-relative" to="/bag" onClick={closeMenu}>
                  <div className="d-flex align-items-center justify-content-center justify-content-xl-start gap-2">
                      <FiShoppingBag size={18} />
                      <span className="fw-medium">Bag</span>
                  </div>
                  {bagCount > 0 && (
                    <span className="badge bg-danger rounded-pill position-absolute top-0 start-50 translate-middle-x ms-4 mt-1 mt-xl-0 start-xl-100 translate-middle-xl p-1 border border-light rounded-circle" style={{width: 18, height: 18, fontSize: 10, display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {bagCount}
                    </span>
                  )}
                </NavLink>
              </li>

              <li className="nav-item w-100 text-center text-xl-start">
                <NavLink className="nav-link px-3 py-2" to="/funds" onClick={closeMenu}>
                  <FiDollarSign size={18} />
                  <span className="ms-2 fw-medium">Funds</span>
                </NavLink>
              </li>

              <li className="nav-item w-100 text-center text-xl-start">
                <NavLink className="nav-link px-3 py-2" to="/merchants" onClick={closeMenu}>
                  <FiUsers size={18} />
                  <span className="ms-2 fw-medium">Merchants</span>
                </NavLink>
              </li>

              <li className="nav-item w-100 text-center text-xl-start">
                <NavLink className="nav-link px-3 py-2" to="/analysis" onClick={closeMenu}>
                  <FiPieChart size={18} />
                  <span className="ms-2 fw-medium">Analysis</span>
                </NavLink>
              </li>

              {user.role === "Owner" && (
                <li className="nav-item w-100 text-center text-xl-start">
                  <NavLink className="nav-link px-3 py-2" to="/users" onClick={closeMenu}>
                    <FiShield size={18} />
                    <span className="ms-2 fw-medium">Users</span>
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center justify-content-center justify-content-xl-end gap-3 ms-xl-4 ps-xl-4 border-start-xl mt-3 mt-xl-0 border-top pt-3 pt-xl-0 w-100">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                   <FiUser size={18} color="#6f4e37" />
                </div>
                <div className="d-flex flex-column lh-1 text-center text-xl-start">
                  <span className="fw-bold small text-dark">{user.name?.split(' ')[0] || "Admin"}</span>
                  <span className="text-muted" style={{fontSize: '0.65rem'}}>{user.role || "Manager"}</span>
                </div>
              </div>

              <button onClick={logout} className="btn btn-link text-danger p-0" title="Logout">
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}