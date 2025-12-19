import { useState, useEffect } from "react";
import type { Merchant } from "../types/Merchant";
import { FiX, FiUser, FiMapPin, FiMap, FiPhone, FiPlus, FiTrash2 } from "react-icons/fi";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (merchant: Merchant) => void;
  initial?: Merchant;
};

export default function MerchantModal({ show, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Merchant>(
    initial || { name: "", address: "", googleMapsLink: "", phone: [""] }
  );

  useEffect(() => {
    if (initial) {
      setForm({ ...initial, phone: initial.phone && initial.phone.length > 0 ? initial.phone : [""] });
    } else {
      setForm({ name: "", address: "", googleMapsLink: "", phone: [""] });
    }
  }, [initial, show]);

  if (!show) return null;

  const update = (key: keyof Merchant, value: any) =>
    setForm({ ...form, [key]: value });

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...form.phone];
    newPhones[index] = value;
    setForm({ ...form, phone: newPhones });
  };

  const addPhoneField = () => {
    setForm({ ...form, phone: [...form.phone, ""] });
  };

  const removePhoneField = (index: number) => {
    const newPhones = form.phone.filter((_, i) => i !== index);
    setForm({ ...form, phone: newPhones.length ? newPhones : [""] });
  };

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          
          <div className="modal-header border-0 pb-0">
             <div>
                <h5 className="modal-title fw-bold">{initial ? "Edit Merchant" : "Add Merchant"}</h5>
                <p className="text-muted small mb-0">Contact details and location</p>
            </div>
            <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" onClick={onClose} style={{width: 32, height: 32}}>
                <FiX />
            </button>
          </div>

          <div className="modal-body pt-4">
            
            {/* Name */}
            <div className="mb-3">
                <label className="form-label small text-muted">Merchant Name</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiUser /></span>
                    <input
                        className="form-control bg-light border-0 py-2 rounded-end-3"
                        placeholder="Merchant Name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                    />
                </div>
            </div>

            {/* Address */}
            <div className="mb-3">
                <label className="form-label small text-muted">Address</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiMapPin /></span>
                    <input
                        className="form-control bg-light border-0 py-2 rounded-end-3"
                        placeholder="Address (City, Street...)"
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                    />
                </div>
            </div>

            {/* Map Link */}
            <div className="mb-3">
                <label className="form-label small text-muted">Google Maps Link</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiMap /></span>
                    <input
                        className="form-control bg-light border-0 py-2 rounded-end-3"
                        placeholder="URL Link"
                        value={form.googleMapsLink}
                        onChange={(e) => update("googleMapsLink", e.target.value)}
                    />
                </div>
            </div>

            {/* Dynamic Phone Numbers */}
            <div className="mb-2">
                <label className="form-label small text-muted d-flex justify-content-between align-items-center">
                    Phone Numbers
                    <button type="button" className="btn btn-sm btn-link text-primary p-0 text-decoration-none" onClick={addPhoneField}>
                        <FiPlus className="me-1"/> Add Phone
                    </button>
                </label>
                
                {form.phone.map((p, index) => (
                    <div key={index} className="input-group mb-2 shadow-sm rounded-3 overflow-hidden">
                        <span className="input-group-text bg-light border-0 text-muted ps-3"><FiPhone /></span>
                        <input
                            className="form-control bg-light border-0 py-2"
                            placeholder={`Phone #${index + 1}`}
                            value={p}
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                        />
                        {form.phone.length > 1 && (
                            <button 
                                className="btn btn-light border-0 text-danger px-3" 
                                type="button" 
                                onClick={() => removePhoneField(index)}
                            >
                                <FiTrash2 />
                            </button>
                        )}
                    </div>
                ))}
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light rounded-3 px-4 fw-medium" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-3 px-4 fw-bold shadow-sm" onClick={() => onSave(form)}>
              Save Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}