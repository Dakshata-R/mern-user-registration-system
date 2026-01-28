const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT']
  },
  regNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value < new Date(); // Date must be in the past
      },
      message: 'Date of birth must be in the past'
    }
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  skills: {
    type: [String],
    required: true
  },
  institute: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Convert comma-separated skills string to array before saving
RegistrationSchema.pre('save', function(next) {
  if (this.skills && typeof this.skills === 'string') {
    this.skills = this.skills.split(',').map(skill => skill.trim());
  }
  
  // Convert string date to Date object if needed
  if (typeof this.dob === 'string') {
    this.dob = new Date(this.dob);
  }
  
  // Set updatedAt on save
  this.updatedAt = Date.now();
  
  next();
});

module.exports = mongoose.model('Registration', RegistrationSchema);