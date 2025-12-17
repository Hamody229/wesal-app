import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types/Product";
import { FiSearch, FiTrendingDown, FiTrendingUp, FiAward, FiBarChart2} from "react-icons/fi";

type AnalysisResult = {
  category: string;
  min: Product | null;
  max: Product | null;
  bestValue: Product | null;
};

export default function Analysis() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    api.get<Product[]>("/products").then((res) => {
      const unique = Array.from(new Set(res.data.map((p) => p.category)));
      setCategories(unique);
      setInitialLoading(false);
    });
  }, []);

  const analyze = async () => {
    if (!selected) return;
    setLoading(true);
    try {
        const res = await api.get<AnalysisResult>(`/analysis/category/${selected}`);
        setResult(res.data);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-5">
        <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info">
            <FiBarChart2 size={24} />
        </div>
        <div>
            <h3 className="fw-bold mb-0">Price Analysis</h3>
            <p className="text-muted small mb-0">Compare prices and find the best value deals</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{maxWidth: '800px'}}>
        <div className="d-flex flex-column flex-md-row gap-3 align-items-end">
            <div className="flex-grow-1 w-100">
                <label className="form-label fw-bold text-dark small text-uppercase">Select Category</label>
                <select
                    className="form-select form-select-lg bg-light border-0 rounded-3"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    disabled={initialLoading}
                >
                    <option value="">Choose a product category...</option>
                    {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            
            <button
                className="btn btn-primary btn-lg rounded-3 px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                onClick={analyze}
                disabled={!selected || loading}
                style={{minWidth: '160px'}}
            >
                {loading ? <span className="spinner-border spinner-border-sm"/> : <><FiSearch /> Analyze</>}
            </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="row g-4 justify-content-center">
          <AnalysisCard
            title="Cheapest Option"
            product={result.min}
            type="min"
          />

          <AnalysisCard
            title="Most Expensive"
            product={result.max}
            type="max"
          />

          <AnalysisCard
            title="Best Value (Price/Kg)"
            product={result.bestValue}
            type="best"
            highlight
          />
        </div>
      )}
      
      {!result && !loading && (
          <div className="text-center text-muted opacity-50 py-5">
              <FiBarChart2 size={48} className="mb-3"/>
              <p>Select a category above to see the comparison</p>
          </div>
      )}
    </>
  );
}

// Card Component
function AnalysisCard({ title, product, type, highlight }: { title: string; product: Product | null; type: 'min' | 'max' | 'best'; highlight?: boolean }) {
  const config = {
    min: { color: 'success', icon: <FiTrendingDown size={20}/>, bg: '#d1e7dd' },
    max: { color: 'danger', icon: <FiTrendingUp size={20}/>, bg: '#f8d7da' },
    best: { color: 'primary', icon: <FiAward size={20}/>, bg: '#cfe2ff' }
  };

  const theme = config[type];
  const borderClass = highlight ? `border-${theme.color} border-2` : 'border-0';
  const shadowClass = highlight ? 'shadow-lg' : 'shadow-sm';

  if (!product) {
    return (
      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm rounded-4 bg-light text-center py-5">
           <span className="text-muted small">No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-4">
      <div className={`card h-100 ${borderClass} ${shadowClass} rounded-4 overflow-hidden transition-all hover-lift`}>
        <div className={`card-header bg-white border-0 pt-4 px-4 d-flex align-items-center justify-content-between`}>
           <span className={`badge bg-${theme.color} bg-opacity-10 text-${theme.color} px-3 py-2 rounded-pill d-flex align-items-center gap-2`}>
              {theme.icon} {title}
           </span>
        </div>

        <div className="card-body px-4 pb-4 pt-2">
          <h4 className="fw-bold mb-1 text-dark">{product.name}</h4>
          <p className="text-muted small mb-3">Merchant: {product.merchant?.name || "Unknown"}</p>
          
          <div className="bg-light rounded-3 p-3">
             <div className="d-flex justify-content-between mb-2">
                 <span className="text-muted small">Total Price</span>
                 <span className="fw-bold text-dark">EGP {product.price}</span>
             </div>
             <div className="d-flex justify-content-between mb-2">
                 <span className="text-muted small">Quantity</span>
                 <span>{product.quantity} kg</span>
             </div>
             
             <div className={`border-top mt-2 pt-2 d-flex justify-content-between align-items-center text-${theme.color}`}>
                 <span className="small fw-bold">Unit Price</span>
                 <span className="fw-bold fs-5">
                    {(product.price / product.quantity).toFixed(2)} <span style={{fontSize: '0.7rem'}}>EGP/kg</span>
                 </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}