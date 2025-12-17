import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types/Product";
import { FiX, FiType, FiTag, FiDollarSign, FiLayers, FiUser } from "react-icons/fi";

type Merchant = {
  _id: string;
  name: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initial?: Product;
};

export default function ProductModal({ show, onClose, onSave, initial }: Props) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [form, setForm] = useState<Product>(
    initial || { name: "", category: "", price: 0, quantity: 1, merchantId: "" }
  );

  useEffect(() => {
    api.get<Merchant[]>("/merchants").then(res => setMerchants(res.data));
  }, []);

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ name: "", category: "", price: 0, quantity: 1, merchantId: "" });
  }, [initial, show]);

  if (!show) return null;

  const update = (key: keyof Product, value: any) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <div>
                <h5 className="modal-title fw-bold">{initial ? "Edit Product" : "Add New Product"}</h5>
                <p className="text-muted small mb-0">Fill in the details below</p>
            </div>
            <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" onClick={onClose} style={{width: 32, height: 32}}>
                <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body pt-4">
            
            {/* Name */}
            <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiType /></span>
                <input
                    className="form-control bg-light border-0 py-2 rounded-end-3"
                    placeholder="Product Name (e.g. Elsa3a)"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                />
            </div>

            {/* Category */}
            <div className="input-group mb-3">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiTag /></span>
                <input
                    className="form-control bg-light border-0 py-2 rounded-end-3"
                    placeholder="Category (e.g. Rice)"
                    value={form.category}
                    onChange={e => update("category", e.target.value)}
                />
            </div>

            <div className="row g-3 mb-3">
                <div className="col-6">
                    {/* Price */}
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiDollarSign /></span>
                        <input
                            type="number"
                            className="form-control bg-light border-0 py-2 rounded-end-3"
                            placeholder="Price"
                            value={form.price}
                            onChange={e => update("price", +e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-6">
                    {/* Quantity */}
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiLayers /></span>
                        <input
                            type="number"
                            className="form-control bg-light border-0 py-2 rounded-end-3"
                            placeholder="Qty (kg)"
                            value={form.quantity}
                            onChange={e => update("quantity", +e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Merchant */}
            <div className="input-group mb-2">
                <span className="input-group-text bg-light border-0 text-muted ps-3 rounded-start-3"><FiUser /></span>
                <select
                    className="form-select bg-light border-0 py-2 rounded-end-3"
                    value={form.merchantId}
                    onChange={e => update("merchantId", e.target.value)}
                    style={{cursor: 'pointer'}}
                >
                    <option value="">Select Merchant...</option>
                    {merchants.map(m => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                </select>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light rounded-3 px-4 fw-medium" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-3 px-4 fw-bold shadow-sm" onClick={() => onSave(form)}>
              {initial ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}