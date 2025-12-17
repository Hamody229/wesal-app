const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true, 
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN'] 
  },
  entity: { type: String, required: true },
  entityId: { type: String },
  details: { type: String },
  performedBy: { 
    name: String,
    role: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);