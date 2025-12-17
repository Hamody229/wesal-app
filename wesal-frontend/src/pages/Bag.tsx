import { useEffect, useState, useCallback } from "react";
import { exportBagToExcel } from "../utils/exportExcel";
import { exportBagToPDF } from "../utils/exportPDF";
import api from "../services/api";
import { FiTrash2, FiDownload, FiFileText, FiShoppingBag, FiDollarSign, FiPackage, FiMinus, FiPlus, FiRefreshCw } from "react-icons/fi";

type BagItem = {
  productId: string;
  name: string;
  category: string; 
  price: number;
  quantityInBag: number;
};

export default function Bag() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [loadingBudget, setLoadingBudget] = useState(true);

  useEffect(() => {
    api.get("/funds").then((res) => {
      const total = parseFloat(res.data.total);
      setBudget(isNaN(total) ? 0 : total);
      setLoadingBudget(false);
    });
  }, []);

  const loadBag = useCallback(() => {
    const savedString = localStorage.getItem("bag");
    let saved: any[] = [];
    try { saved = JSON.parse(savedString || "[]"); } catch (e) { saved = []; }

    const cleanBag: BagItem[] = saved.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        category: item.category || "General", 
        price: Number(item.price) || 0, 
        quantityInBag: Number(item.quantityInBag) || 1
    }));
    setBag(cleanBag);
  }, []);

  useEffect(() => {
    loadBag();
    const handleStorageChange = () => loadBag();
    window.addEventListener("bag-updated", handleStorageChange);
    localStorage.setItem("bagSeen", "true");
    window.dispatchEvent(new Event("bag-updated"));
    return () => { window.removeEventListener("bag-updated", handleStorageChange); };
  }, [loadBag]);

  const syncBag = (updated: BagItem[]) => {
    setBag(updated);
    localStorage.setItem("bag", JSON.stringify(updated));
    window.dispatchEvent(new Event("bag-updated"));
  };

  const removeItem = (id: string) => {
    if(window.confirm("Remove this item?")) {
        const updated = bag.filter((item) => item.productId !== id);
        syncBag(updated);
    }
  };

  const clearBag = () => {
    if(window.confirm("Are you sure you want to clear the entire bag?")) {
        setBag([]);
        localStorage.removeItem("bag");
        window.dispatchEvent(new Event("bag-updated"));
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = bag.map(item => {
        if (item.productId === id) {
            const currentQty = Number(item.quantityInBag) || 0;
            const newQty = Math.max(1, currentQty + delta);
            return { ...item, quantityInBag: newQty };
        }
        return item;
    });
    syncBag(updated);
  };

  const totalCost = bag.reduce((sum, i) => {
      const price = Number(i.price) || 0;
      const qty = Number(i.quantityInBag) || 0;
      return sum + (price * qty);
  }, 0);
  
  const safeBudget = Number(budget) || 0;
  const bagsCount = safeBudget > 0 && totalCost > 0 ? Math.floor(safeBudget / totalCost) : 0;
  const remaining = safeBudget > 0 ? safeBudget - (bagsCount * totalCost) : 0;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
            <div 
                className="d-flex align-items-center justify-content-center rounded-circle" 
                style={{
                    width: '50px', 
                    height: '50px', 
                    backgroundColor: 'rgba(111, 78, 55, 0.1)', 
                    color: '#6f4e37'
                }}
            >
                <FiShoppingBag size={24} />
            </div>
            <div>
                <h3 className="fw-bold mb-0">Ramadan Bag</h3>
                <p className="text-muted small mb-0">Review items and calculate budget</p>
            </div>
        </div>
        
        {bag.length > 0 && (
            <button onClick={clearBag} className="btn btn-light text-danger btn-sm border shadow-sm px-3 rounded-pill">
                <FiRefreshCw className="me-2"/> Clear Bag
            </button>
        )}
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 px-4">
                <h6 className="fw-bold mb-0">Bag Items ({bag.length})</h6>
            </div>
            
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-muted small fw-bold text-uppercase">Product</th>
                    <th className="py-3 text-muted small fw-bold text-uppercase">Category</th>
                    <th className="py-3 text-muted small fw-bold text-uppercase">Price</th>
                    <th className="py-3 text-muted small fw-bold text-uppercase text-center">Qty</th>
                    <th className="py-3 text-muted small fw-bold text-uppercase">Total</th>
                    <th className="py-3 text-end pe-4 text-muted small fw-bold text-uppercase">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bag.map((item) => (
                    <tr key={item.productId}>
                      <td className="ps-4 fw-medium text-dark">{item.name}</td>
                      
                      <td>
                        <span className="badge bg-light text-dark border fw-normal px-2">
                            {item.category}
                        </span>
                      </td>

                      <td className="text-muted">EGP {Number(item.price).toLocaleString()}</td>
                      
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <button className="btn btn-light btn-sm rounded-circle p-1 border" onClick={() => updateQuantity(item.productId, -1)}>
                                <FiMinus size={12}/>
                            </button>
                            <span className="fw-bold" style={{minWidth: '20px'}}>{item.quantityInBag}</span>
                            <button className="btn btn-light btn-sm rounded-circle p-1 border" onClick={() => updateQuantity(item.productId, 1)}>
                                <FiPlus size={12}/>
                            </button>
                        </div>
                      </td>

                      <td className="fw-bold text-primary">
                        EGP {(Number(item.price) * Number(item.quantityInBag)).toLocaleString()}
                      </td>
                      <td className="text-end pe-4">
                        <button className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2 hover-shadow" onClick={() => removeItem(item.productId)}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!bag.length && (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div className="d-flex flex-column align-items-center text-muted opacity-50">
                            <FiShoppingBag size={40} className="mb-2" />
                            <span>Your bag is empty</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{top: '100px', zIndex: 1}}>
                <h5 className="fw-bold mb-4">Order Summary</h5>
                
                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <span className="text-muted">Cost per Bag</span>
                    <span className="fw-bold fs-5">EGP {totalCost.toLocaleString()}</span>
                </div>

                <div className="mb-3">
                    <label className="text-muted small mb-1">Total Available Budget</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0"><FiDollarSign /></span>
                        <input 
                            className="form-control bg-light border-0 fw-bold text-dark" 
                            value={loadingBudget ? "Loading..." : safeBudget.toLocaleString()} 
                            disabled 
                        />
                    </div>
                </div>

                {bag.length > 0 && (
                    <div className="rounded-4 p-3 mb-4" style={{backgroundColor: '#fff8f3', border: '1px solid #efe5de'}}>
                        
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <div className="bg-white rounded-circle p-2 shadow-sm text-primary d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                                    <FiPackage size={16}/>
                                </div>
                                <span className="text-dark fw-bold">Total Bags</span>
                            </div>
                            <span className="fw-bolder text-primary fs-4">{bagsCount}</span>
                        </div>

                        <hr className="my-2" style={{borderColor: '#e0d4cc'}} />

                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <span className="text-muted small">Unused Balance</span>
                            <span className={`fw-bold small ${remaining > 0 ? 'text-success' : 'text-muted'}`}>
                                EGP {remaining.toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                <div className="d-grid gap-2">
                    <button 
                        className="btn btn-success py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                        disabled={loadingBudget || bag.length === 0}
                        onClick={() => exportBagToExcel(bag, totalCost)}
                    >
                        <FiFileText /> Export to Excel
                    </button>
                    
                    <button 
                        className="btn btn-outline-danger py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                        disabled={loadingBudget || bag.length === 0}
                        onClick={() => exportBagToPDF(bag, totalCost)}
                    >
                        <FiDownload /> Export to PDF
                    </button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}