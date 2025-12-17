import { useEffect, useState } from "react";
import api from "../services/api";
import type { User } from "../types/User";
import { FiUserPlus, FiTrash2, FiShield, FiUsers } from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "Viewer" | "Owner">("Viewer");

  // Load Users
  const loadUsers = () => {
    api.get<User[]>("/auth/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Please fill all fields");

    try {
      await api.post("/auth/create-user", { name, email, password, role });
      alert("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("Viewer");
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
        case 'Owner':
            return { backgroundColor: '#212529', color: '#fff' }; 
        case 'Admin':
            return { backgroundColor: '#e0f2fe', color: '#0369a1' }; 
        default:
            return { backgroundColor: '#f3f4f6', color: '#4b5563' }; 
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-dark bg-opacity-10 p-2 rounded-circle text-dark">
            <FiShield size={24} />
        </div>
        <div>
            <h3 className="fw-bold mb-0">User Management</h3>
            <p className="text-muted small mb-0">Add admins, owners, and viewers</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: Add User Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FiUserPlus className="text-primary"/> Add New User
                </h6>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handleCreate}>
                    <div className="mb-3">
                        <label className="form-label small text-muted">Full Name</label>
                        <input className="form-control bg-light border-0" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ahmed Ali" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small text-muted">Email Address</label>
                        <input type="email" className="form-control bg-light border-0" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@wesal.com" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small text-muted">Password</label>
                        <input type="password" className="form-control bg-light border-0" value={password} onChange={e => setPassword(e.target.value)} placeholder="******" />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small text-muted">Role</label>
                        <select className="form-select bg-light border-0" value={role} onChange={(e: any) => setRole(e.target.value)}>
                            <option value="Viewer">Viewer (Read Only)</option>
                            <option value="Admin">Admin (Full Control)</option>
                            <option value="Owner">Owner (Can manage users)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-dark w-100 py-2 rounded-3 fw-bold">
                        Create Account
                    </button>
                </form>
            </div>
          </div>
        </div>

        {/* Right: Users List */}
        <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                        <FiUsers className="text-info"/> Existing Users
                    </h6>
                    <span className="badge bg-light text-muted border">{users.length} Users</span>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 text-muted small">Name</th>
                                <th className="py-3 text-muted small">Role</th>
                                <th className="py-3 text-end pe-4 text-muted small">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="ps-4">
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold text-dark">{user.name}</span>
                                            <span className="text-muted small">{user.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span 
                                            className="badge rounded-pill px-3 py-2 fw-bold"
                                            style={getRoleBadgeStyle(user.role)}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <button 
                                            className="btn btn-light text-danger btn-sm rounded-circle p-2"
                                            onClick={() => handleDelete(user._id)}
                                            title="Delete User"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}