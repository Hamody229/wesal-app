import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types/Product";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";
import { exportProductsToExcel } from "../utils/exportExcel"; 
import { exportProductsToPDF } from "../utils/exportPDF";     
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiShoppingBag, FiFilter, FiDownload, FiFileText } from "react-icons/fi";

export default function Products() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "danger" | "warning">("success");

  const [searchTerm, setSearchTerm] = useState("");

  const canEdit = user.role === "Admin" || user.role === "Owner";

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const saveProduct = async (product: Product) => {
    try {
      if (editProduct?._id) {
        const res = await api.put<Product>(`/products/${editProduct._id}`, product);
        setProducts(products.map((p) => (p._id === res.data._id ? res.data : p)));
        setToastMessage("Product updated successfully");
      } else {
        const res = await api.post<Product>("/products", product);
        setProducts([...products, res.data]);
        setToastMessage("Product created successfully");
      }
      setToastType("success");
      setShowToast(true);
      setShowModal(false);
      setEditProduct(undefined);
    } catch (error) {
      setToastMessage("Failed to save product");
      setToastType("danger");
      setShowToast(true);
    }
  };

  const deleteProduct = async (id?: string) => {
    if (!id) return;
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setToastMessage("Product deleted successfully");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Failed to delete product");
      setToastType("danger");
      setShowToast(true);
    }
  };

  const addToBag = (product: Product) => {
    const bag = JSON.parse(localStorage.getItem("bag") || "[]");
    const exists = bag.find((item: any) => item.productId === product._id);

    if (exists) {
      exists.quantityInBag += 1;
      setToastMessage("Quantity updated in bag");
      setToastType("warning");
    } else {
      bag.push({
        productId: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantityInBag: 1,
      });
      setToastMessage("Added to bag successfully");
      setToastType("success");
    }

    localStorage.setItem("bag", JSON.stringify(bag));
    localStorage.setItem("bagSeen", "false");
    window.dispatchEvent(new Event("bag-updated"));
    setShowToast(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center mb-4 gap-3">
        <div>
           <h3 className="fw-bold mb-1">Products Inventory</h3>
           <p className="text-muted small mb-0">Manage your products and stock levels</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
            <div className="input-group shadow-sm" style={{maxWidth: '250px'}}>
                <span className="input-group-text bg-white border-0 ps-3"><FiSearch className="text-muted"/></span>
                <input 
                  type="text" 
                  className="form-control border-0 py-2" 
                  placeholder="Search products..." 
                  style={{fontSize: '0.9rem'}}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {products.length > 0 && (
                <>
                    <button 
                        className="btn btn-white bg-white border shadow-sm d-flex align-items-center justify-content-center px-3"
                        onClick={() => exportProductsToExcel(filteredProducts)}
                        title="Export to Excel"
                    >
                        <FiFileText className="text-success" size={18} />
                    </button>
                    <button 
                        className="btn btn-white bg-white border shadow-sm d-flex align-items-center justify-content-center px-3"
                        onClick={() => exportProductsToPDF(filteredProducts)}
                        title="Export to PDF"
                    >
                        <FiDownload className="text-danger" size={18} />
                    </button>
                </>
            )}

            {canEdit && (
            <button
                className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-3 shadow-sm"
                onClick={() => setShowModal(true)}
            >
                <FiPlus size={18} />
                <span className="d-none d-sm-inline">Add Product</span>
            </button>
            )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border text-primary mb-2" />
            <div>Loading products...</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                <tr>
                    <th className="ps-4 py-3 text-muted text-uppercase small fw-bold">Product Name</th>
                    <th className="py-3 text-muted text-uppercase small fw-bold">Category</th>
                    <th className="py-3 text-muted text-uppercase small fw-bold">Price Details</th>
                    <th className="py-3 text-muted text-uppercase small fw-bold">Stock</th>
                    <th className="py-3 text-muted text-uppercase small fw-bold">Merchant</th>
                    <th className="py-3 text-end pe-4 text-muted text-uppercase small fw-bold">Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredProducts.map((p) => (
                    <tr key={p._id}>
                    <td className="ps-4 fw-medium text-dark">{p.name}</td>
                    <td>
                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">
                            {p.category}
                        </span>
                    </td>
                    <td>
                        <div className="d-flex flex-column">
                            <span className="fw-bold text-primary">EGP {p.price.toLocaleString()}</span>
                            <small className="text-muted" style={{fontSize: '0.75rem'}}>
                                {p.quantity > 0 ? (p.price / p.quantity).toFixed(2) : "-"} EGP/Unit
                            </small>
                        </div>
                    </td>
                    <td>
                        <div className="d-flex align-items-center gap-2">
                             <div className="progress flex-grow-1" style={{height: '6px', width: '60px'}}>
                                <div className="progress-bar bg-info" style={{width: '70%'}}></div>
                             </div>
                             <span className="small text-muted">{p.quantity}kg</span>
                        </div>
                    </td>
                    <td className="text-muted small">{p.merchant?.name || "-"}</td>

                    <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-light text-success btn-sm rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                                onClick={() => addToBag(p)}
                                title="Add to Bag"
                                style={{width: 32, height: 32}}
                            >
                                <FiShoppingBag size={14} />
                            </button>

                            {canEdit && (
                                <>
                                <button
                                    className="btn btn-light text-primary btn-sm rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                                    onClick={() => { setEditProduct(p); setShowModal(true); }}
                                    title="Edit"
                                    style={{width: 32, height: 32}}
                                >
                                    <FiEdit2 size={14} />
                                </button>

                                <button
                                    className="btn btn-light text-danger btn-sm rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                                    onClick={() => deleteProduct(p._id)}
                                    title="Delete"
                                    style={{width: 32, height: 32}}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                                </>
                            )}
                        </div>
                    </td>
                    </tr>
                ))}
                {!filteredProducts.length && (
                    <tr>
                    <td colSpan={6} className="text-center py-5">
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FiFilter size={30} className="mb-2 opacity-50"/>
                            <span>No products found matching "{searchTerm}"</span>
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditProduct(undefined);
        }}
        onSave={saveProduct}
        initial={editProduct}
      />
      
      <Toast 
        message={toastMessage} 
        show={showToast} 
        type={toastType} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
}