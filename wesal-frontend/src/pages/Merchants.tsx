import { useEffect, useState } from "react";
import api from "../services/api";
import type { Merchant } from "../types/Merchant";
import MerchantModal from "../components/MerchantModal";
import { FiPlus, FiMapPin, FiPhone, FiExternalLink, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";

export default function Merchants() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMerchant, setEditMerchant] = useState<Merchant | undefined>();

  const canEdit = user.role === "Admin" || user.role === "Owner";

  useEffect(() => {
    api
      .get<Merchant[]>("/merchants")
      .then((res) => setMerchants(res.data))
      .finally(() => setLoading(false));
  }, []);

  const saveMerchant = async (merchant: Merchant) => {
    if (editMerchant?._id) {
      const res = await api.put<Merchant>(`/merchants/${editMerchant._id}`, merchant);
      setMerchants(merchants.map((m) => (m._id === res.data._id ? res.data : m)));
    } else {
      const res = await api.post<Merchant>("/merchants", merchant);
      setMerchants([...merchants, res.data]);
    }
    setShowModal(false);
    setEditMerchant(undefined);
  };

  const deleteMerchant = async (id?: string) => {
    if (!id) return;
    if(!window.confirm("Are you sure?")) return;
    await api.delete(`/merchants/${id}`);
    setMerchants(merchants.filter((m) => m._id !== id));
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
             <div className="bg-warning bg-opacity-10 p-2 rounded-circle text-warning">
                 <FiUsers size={24} />
             </div>
             <div>
                <h3 className="fw-bold mb-1">Merchants</h3>
                <p className="text-muted small mb-0">Manage your suppliers and contacts</p>
             </div>
        </div>

        {canEdit && (
          <button
            className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-3 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={18} />
            <span>Add Merchant</span>
          </button>
        )}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="p-5 text-center text-muted">
          <div className="spinner-border text-primary mb-2" />
          <div>Loading merchants...</div>
        </div>
      ) : (
        <div className="row g-4">
            {merchants.map((m) => (
                <div key={m._id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift transition-all">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center justify-content-center bg-light rounded-circle" style={{width: 50, height: 50}}>
                                <span className="fw-bold fs-4 text-primary">{m.name.charAt(0).toUpperCase()}</span>
                            </div>
                            
                            {canEdit && (
                                <div className="dropdown">
                                    <div className="d-flex gap-1">
                                        <button className="btn btn-light btn-sm rounded-circle text-primary" onClick={() => {setEditMerchant(m); setShowModal(true);}}>
                                            <FiEdit2 />
                                        </button>
                                        <button className="btn btn-light btn-sm rounded-circle text-danger" onClick={() => deleteMerchant(m._id)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <h5 className="fw-bold text-dark mb-1">{m.name}</h5>
                            <p className="text-muted small mb-3">Supplier ID: #{m._id?.slice(-6).toUpperCase() || "---"}</p>
                        <div className="d-flex flex-column gap-2 mt-auto">
                            <div className="d-flex align-items-center gap-2 text-muted small">
                                <FiMapPin className="text-primary"/>
                                <span className="text-truncate">{m.address || "No address provided"}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-muted small">
                                <FiPhone className="text-primary"/>
                                <span>{m.phone || "No phone number"}</span>
                            </div>
                        </div>

                        {m.googleMapsLink && (
                            <a href={m.googleMapsLink} target="_blank" rel="noreferrer" className="btn btn-light btn-sm w-100 mt-3 d-flex align-items-center justify-content-center gap-2 rounded-3 text-dark fw-medium">
                                <FiExternalLink size={14} /> Open Location
                            </a>
                        )}
                    </div>
                </div>
            ))}

            {!merchants.length && (
                 <div className="col-12 text-center py-5 text-muted">
                    No merchants found. Add one to get started.
                 </div>
            )}
        </div>
      )}

      <MerchantModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditMerchant(undefined);
        }}
        onSave={saveMerchant}
        initial={editMerchant}
      />
    </>
  );
}