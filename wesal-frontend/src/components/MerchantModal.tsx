import { useState, useEffect } from "react";
import type { Merchant } from "../types/Merchant";
import { FiX, FiUser, FiMapPin, FiMap, FiPhone } from "react-icons/fi";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (merchant: Merchant) => void;
  initial?: Merchant;
};

export default function MerchantModal({ show, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Merchant>(
    initial || { name: "", address: "", googleMapsLink: "", phone: "" }
  );

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ name: "", address: "", googleMapsLink: "", phone: "" });
  }, [initial, show]);

  if (!show) return null;

  const update = (key: keyof Merchant, value: any) =>
    setForm({ ...form, [key]: value });

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
            <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiUser /></span>
                <input
                    className="form-control bg-light border-0 py-2 rounded-end-3"
                    placeholder="Merchant Name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                />
            </div>

            {/* Address */}
            <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiMapPin /></span>
                <input
                    className="form-control bg-light border-0 py-2 rounded-end-3"
                    placeholder="Address (City, Street...)"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                />
            </div>

            {/* Map Link */}
            <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiMap /></span>
                <input
                    className="form-control bg-light border-0 py-2 rounded-end-3"
                    placeholder="Google Maps Link URL"
                    value={form.googleMapsLink}
                    onChange={(e) => update("googleMapsLink", e.target.value)}
                />
            </div>

            {/* Phone */}
            <div className="input-group mb-2">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiPhone /></span>
                <input
                    className="form-control bg-light border-0 py-2 rounded-end-3"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                />
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