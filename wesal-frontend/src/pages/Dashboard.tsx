import { useEffect, useState } from "react";
import api from "../services/api";
import { FiBox, FiLayers, FiUsers, FiDollarSign, FiTrendingUp, FiActivity, FiClock } from "react-icons/fi";

type DashboardData = {
  totalProducts: number;
  totalMerchants: number;
  totalCategories: number;
  totalCost: number;
  costPerCategory: Record<string, number>;
};

type Log = {
  _id: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
  performedBy: { name: string };
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await api.get<DashboardData>("/dashboard");
        setData(dashRes.data);

        try {
          const auditRes = await api.get<Log[]>("/audit");
          setLogs(auditRes.data.slice(0, 5));
        } catch (error) {
          console.error("Failed to load audit logs:", error);
        }

      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary mb-3" role="status" />
        <span className="text-muted fw-medium">Loading Overview...</span>
      </div>
    );
  }

  if (!data) return <div className="text-center p-5 text-danger">Failed to load dashboard data.</div>;

  return (
    <>
      <div className="d-flex align-items-end justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard Overview</h3>
          <p className="text-muted mb-0 small">Here is what's happening with your store today.</p>
        </div>
        <button className="btn btn-light bg-white border shadow-sm btn-sm px-3 rounded-pill text-muted">
           Last updated: Just now
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="row g-4 mb-4">
        <StatCard title="Total Products" value={data.totalProducts} icon={<FiBox size={24} />} color="primary" />
        <StatCard title="Categories" value={data.totalCategories} icon={<FiLayers size={24} />} color="info" />
        <StatCard title="Active Merchants" value={data.totalMerchants} icon={<FiUsers size={24} />} color="warning" />
        <StatCard title="Total Cost" value={`EGP ${data.totalCost.toLocaleString()}`} icon={<FiDollarSign size={24} />} color="success" />
      </div>

      <div className="row g-4">
        {/* Cost Table */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FiTrendingUp className="text-primary" /> Cost Distribution
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-muted small">Category</th>
                    <th className="py-3 text-muted small text-end pe-4">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.costPerCategory).map(([cat, cost]) => (
                    <tr key={cat}>
                      <td className="ps-4 fw-medium">{cat}</td>
                      <td className="text-end pe-4 fw-bold">EGP {cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log Section */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FiActivity className="text-warning" /> Recent Activity
              </h5>
              <span className="badge bg-light text-muted border">Last 5 Actions</span>
            </div>
            
            <div className="list-group list-group-flush">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log._id} className="list-group-item border-0 px-4 py-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span 
                        className="badge rounded-pill" 
                        style={{
                            fontSize: '0.7rem',
                            backgroundColor: log.action === 'CREATE' ? 'rgba(25, 135, 84, 0.1)' : 
                                           log.action === 'DELETE' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(13, 202, 240, 0.1)',
                            color: log.action === 'CREATE' ? '#198754' : 
                                   log.action === 'DELETE' ? '#dc3545' : '#0dcaf0'
                        }}
                      >
                        {log.action}
                      </span>
                      <small className="text-muted d-flex align-items-center gap-1" style={{fontSize: '0.7rem'}}>
                        <FiClock size={10} /> 
                        {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </small>
                    </div>
                    <p className="mb-0 small fw-medium text-dark">{log.details}</p>
                    <small className="text-muted" style={{fontSize: '0.75rem'}}>By: {log.performedBy?.name || 'System'}</small>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 text-muted small d-flex flex-column align-items-center opacity-50">
                  <FiActivity size={24} className="mb-2" />
                  No recent activity recorded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, color }: any) {
    const getColorStyle = (c: string) => {
        switch (c) {
            case 'primary': return { bg: 'rgba(111, 78, 55, 0.1)', text: '#6f4e37' }; 
            case 'info': return { bg: 'rgba(13, 202, 240, 0.1)', text: '#0dcaf0' };
            case 'warning': return { bg: 'rgba(255, 193, 7, 0.1)', text: '#ffc107' }; 
            case 'success': return { bg: 'rgba(25, 135, 84, 0.1)', text: '#198754' }; 
            default: return { bg: '#f8f9fa', text: '#212529' };
        }
    };

    const style = getColorStyle(color);
  
    return (
    <div className="col-12 col-md-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100 p-3 rounded-4 position-relative overflow-hidden">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-3 p-3 d-flex align-items-center justify-content-center" 
            style={{ backgroundColor: style.bg, color: style.text, minWidth: '60px', height: '60px' }}
          >
            {icon}
          </div>
          <div>
            <div className="text-muted small fw-medium mb-1">{title}</div>
            <h4 className="fw-bold mb-0 text-dark">{value}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}