import { useEffect, useState } from "react";
import api from "../services/api";
import type { AuditLog } from "../types/AuditLog";
import { FiActivity, FiClock, FiUser, FiCheckCircle, FiTrash2, FiEdit, FiPlusCircle } from "react-icons/fi";

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AuditLog[]>("/audit")
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <FiPlusCircle className="text-success" />;
      case 'DELETE': return <FiTrash2 className="text-danger" />;
      case 'UPDATE': return <FiEdit className="text-warning" />;
      default: return <FiCheckCircle className="text-primary" />;
    }
  };

  const getBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-success text-success';
      case 'DELETE': return 'bg-danger text-danger';
      case 'UPDATE': return 'bg-warning text-warning';
      default: return 'bg-primary text-primary';
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-secondary bg-opacity-10 p-2 rounded-circle text-secondary">
            <FiActivity size={24} />
        </div>
        <div>
            <h3 className="fw-bold mb-0">System Audit Logs</h3>
            <p className="text-muted small mb-0">Track all admin actions and changes</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border text-primary mb-2" />
            <div>Loading activity...</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted small fw-bold">Admin</th>
                  <th className="py-3 text-muted small fw-bold">Action</th>
                  <th className="py-3 text-muted small fw-bold">Details</th>
                  <th className="py-3 text-end pe-4 text-muted small fw-bold">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle p-2 d-flex justify-content-center align-items-center" style={{width: 35, height: 35}}>
                           <FiUser size={16} className="text-dark" />
                        </div>
                        <div className="d-flex flex-column lh-1">
                            <span className="fw-bold text-dark small">{log.performedBy?.name || "Unknown"}</span>
                            <span className="text-muted" style={{fontSize: '0.7rem'}}>{log.performedBy?.role || "Admin"}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <span className={`badge bg-opacity-10 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 ${getBadgeColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>

                    <td>
                        <div className="d-flex flex-column">
                            <span className="fw-bold text-dark small">{log.entity}</span>
                            <span className="text-muted small text-truncate" style={{maxWidth: '300px'}}>{log.details}</span>
                        </div>
                    </td>

                    <td className="text-end pe-4">
                        <div className="d-flex align-items-center justify-content-end gap-2 text-muted small">
                            <FiClock />
                            {new Date(log.timestamp).toLocaleString('en-EG', { 
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                        </div>
                    </td>
                  </tr>
                ))}
                
                {!logs.length && (
                    <tr><td colSpan={4} className="text-center py-5 text-muted">No activity recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}