const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง Schema สำหรับ Import History
const importHistorySchema = new Schema({
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  importedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  successCount: {
    type: Number,
    default: 0
  },
  failedCount: {
    type: Number,
    default: 0
  },
  importedBy: {
    type: String,
    default: 'system'
  },
  errors: [{
    row: Number,
    message: String,
    data: Object
  }],
  importedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// สร้าง Schema สำหรับ Import Template
const importTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fields: [{
    sourceField: String,  // ชื่อฟิลด์ในไฟล์ที่นำเข้า
    targetField: String,  // ชื่อฟิลด์ใน Product Schema
    required: Boolean,    // ฟิลด์นี้จำเป็นหรือไม่
    type: {              // ประเภทข้อมูล
      type: String,
      enum: ['string', 'number', 'boolean', 'date', 'array', 'object']
    },
    defaultValue: Schema.Types.Mixed  // ค่าเริ่มต้นถ้าไม่มีข้อมูล
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// สร้าง model จาก Schema
const ImportHistory = mongoose.model('ImportHistory', importHistorySchema);
const ImportTemplate = mongoose.model('ImportTemplate', importTemplateSchema);

module.exports = {
  ImportHistory,
  ImportTemplate
};
