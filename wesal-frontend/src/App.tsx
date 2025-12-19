import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Merchants from "./pages/Merchants";
import Analysis from "./pages/Analysis";
import Bag from "./pages/Bag";
import Funds from "./pages/Funds";
import Users from "./pages/Users"; 
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./services/api";
import { useEffect } from "react";

// Layout Wrapper
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '150px', paddingBottom: '50px' }}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  useEffect(() => {
    const validateSession = async () => {
      if (localStorage.getItem("token")) {
        try {
          await api.get("/auth/me"); 
        } catch (err) {
          console.error("Session invalid or user deleted");
        }
      }
    };
    validateSession();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/funds"
          element={
            <ProtectedRoute>
              <Layout>
                <Funds />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/merchants"
          element={
            <ProtectedRoute>
              <Layout>
                <Merchants />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <Analysis />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bag"
          element={
            <ProtectedRoute>
              <Layout>
                <Bag />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}