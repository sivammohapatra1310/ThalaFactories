const mongoose = require('mongoose');

const adjusterSchema = new mongoose.Schema({
  adjusterId: {
    type: String,
    required: true,
    unique: true
  },
  expertise: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Adjuster must have at least one expertise'
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'busy'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Adjuster = mongoose.model('Adjuster', adjusterSchema);
module.exports = Adjuster;