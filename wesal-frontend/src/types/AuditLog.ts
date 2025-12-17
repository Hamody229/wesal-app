export type AuditLog = {
  _id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN';
  entity: string;
  details: string;
  performedBy: {
    name: string;
    role: string;
  };
  timestamp: string;
};