import { useEffect, useState } from "react";
import api from "../services/api";
import type { Fund } from "../types/Fund";
import { FiDollarSign, FiPlus, FiTrendingUp, FiPieChart, FiSave, FiTrash2, FiLock } from "react-icons/fi";
import Toast from "../components/Toast"; 

export default function Funds() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [total, setTotal] = useState(0);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canEdit = user.role === "Admin" || user.role === "Owner"; 

  const loadFunds = () => {
    api.get("/funds").then((res) => {
      setFunds(res.data.funds);
      setTotal(res.data.total);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadFunds();
  }, []);

  const addFund = async () => {
    if (!newCategory) return;
    
    try {
      await api.post("/funds", {
        category: newCategory,
        amount: newAmount,
      });
      
      setNewCategory("");
      setNewAmount(0);
      loadFunds();
      
      setToastMessage("Category has been added");
      setToastType("success");
      setShowToast(true);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error while adding category!!";
      setToastMessage(errorMsg);
      setToastType("danger");
      setShowToast(true);
      console.error("Error adding fund:", error);
    }
  };

  const deleteFund = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this fund source?")) return;
    
    try {
      await api.delete(`/funds/${id}`);
      loadFunds();
      setToastMessage("Deleted successfully");
      setToastType("success");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage("Failed to delete");
      setToastType("danger");
      setShowToast(true);
    }
  };

  const updateAmount = async (id?: string, amount?: number) => {
    if (!id) return;
    try {
        await api.put(`/funds/${id}`, { amount });
        loadFunds();
    } catch (error) {
        console.error("Update failed", error);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <Toast 
            message={toastMessage} 
            type={toastType} 
            onClose={() => setShowToast(false)} 
          />
        </div>
      )}

      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
            <FiPieChart size={24} />
        </div>
        <div>
            <h3 className="fw-bold mb-0">Funds Collection</h3>
            <p className="text-muted small mb-0">Track donations and budget sources</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 text-white overflow-hidden h-100" 
                 style={{background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)'}}>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                        <p className="mb-1 opacity-75 fw-medium">Total Collected</p>
                        <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            EGP {loading ? "..." : total.toLocaleString()}
                        </h2>
                    </div>
                    <div className="mt-4 pt-3 border-top border-white border-opacity-25 d-flex align-items-center gap-2 small">
                        <FiTrendingUp /> <span>Updates automatically</span>
                    </div>
                </div>
            </div>
        </div>

        {canEdit && (
            <div className="col-md-7 col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                        <h6 className="fw-bold mb-0">Add New Source</h6>
                    </div>
                    <div className="card-body p-4 d-flex flex-column justify-content-center">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small text-muted">Category Name</label>
                                <input
                                    className="form-control bg-light border-0 py-2"
                                    placeholder="e.g. Batch 27 Donations"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Amount (EGP)</label>
                                <input
                                    type="number"
                                    className="form-control bg-light border-0 py-2"
                                    placeholder="0.00"
                                    value={newAmount || ''}
                                    onChange={(e) => setNewAmount(Number(e.target.value))}
                                />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" onClick={addFund}>
                                    <FiPlus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">All Funds</h6>
            {!canEdit && <span className="badge bg-secondary bg-opacity-10 text-secondary"><FiLock className="me-1"/> Read Only View</span>}
        </div>
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                    <tr>
                    <th className="ps-4 py-3 text-muted small fw-bold text-uppercase">Source Category</th>
                    <th className="py-3 text-muted small fw-bold text-uppercase">Amount Collected</th>
                    <th className="py-3 text-end pe-4 text-muted small fw-bold text-uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {funds.map((f) => (
                    <tr key={f._id}>
                        <td className="ps-4 fw-medium text-dark">{f.category}</td>
                        <td style={{width: '300px'}}>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white border-end-0 text-muted"><FiDollarSign/></span>
                                <input
                                    type="number"
                                    disabled={!canEdit} 
                                    className={`form-control border-start-0 ps-0 fw-bold text-dark ${!canEdit ? 'bg-white' : ''}`}
                                    value={f.amount}
                                    onChange={(e) => updateAmount(f._id, Number(e.target.value))}
                                    style={{maxWidth: '150px'}}
                                />
                                {canEdit && (
                                    <button className="btn btn-light border text-muted" title="Auto-saved">
                                        <FiSave size={14}/>
                                    </button>
                                )}
                            </div>
                        </td>
                        <td className="text-end pe-4">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Active</span>
                                {canEdit && (
                                    <button 
                                        className="btn btn-light text-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center hover-shadow"
                                        onClick={() => deleteFund(f._id)}
                                        style={{width: 32, height: 32}}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))}
                    {!funds.length && (
                         <tr><td colSpan={3} className="text-center py-5 text-muted">No funds added yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
}