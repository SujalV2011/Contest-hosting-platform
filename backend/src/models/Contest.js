const mongoose = require('mongoose');

// Test Case Schema for reusability
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    trim: true
  },
  output: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

// Problem Schema
const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 50,
    maxlength: 5000
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    default: 'medium'
  },
  category: {
    type: String,
    enum: [
      'algorithms', 'data-structures', 'math', 'string', 'graph',
      'dynamic-programming', 'greedy', 'backtracking', 'simulation',
      'implementation', 'sorting', 'searching', 'geometry', 'number-theory'
    ],
    required: true,
    default: 'algorithms'
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
    default: 100
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 100,
    max: 10000,
    default: 1000
  },
  memoryLimit: {
    type: Number,
    required: true,
    min: 16,
    max: 1024,
    default: 256
  },
  constraints: {
    type: String,
    trim: true,
    default: ''
  },
  followUp: {
    type: String,
    trim: true,
    default: ''
  },
  sampleTestCases: {
    type: [testCaseSchema],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one sample test case is required'
    }
  },
  hiddenTestCases: {
    type: [testCaseSchema],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one hidden test case is required'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  hints: [{
    type: String,
    trim: true
  }],
  editorial: {
    type: String,
    trim: true,
    default: ''
  },
  solutions: {
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
    java: { type: String, default: '' },
    cpp: { type: String, default: '' },
    c: { type: String, default: '' },
    go: { type: String, default: '' },
    rust: { type: String, default: '' },
    kotlin: { type: String, default: '' }
  },
  authorNotes: {
    type: String,
    trim: true,
    default: ''
  }
}, { 
  _id: false,
  timestamps: false 
});

// Main Contest Schema
const contestSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // Organizer Information (Critical for access control)
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
    immutable: true // Prevents changing organizer after creation
  },
  
  // Contest Settings
  visibility: {
    type: String,
    enum: ['public', 'private'],
    required: true,
    default: 'public'
  },
  password: {
    type: String,
    trim: true,
    required: function() {
      return this.visibility === 'private';
    },
    validate: {
      validator: function(v) {
        if (this.visibility === 'private') {
          return v && v.length >= 6;
        }
        return true;
      },
      message: 'Password must be at least 6 characters for private contests'
    }
  },
  
  // Schedule
  startDate: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Contest start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function(v) {
        return this.startDate && v > this.startDate;
      },
      message: 'Contest end date must be after start date'
    }
  },
  
  // Registration Settings
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date,
    validate: {
      validator: function(v) {
        if (this.registrationRequired && v) {
          return v <= this.startDate;
        }
        return true;
      },
      message: 'Registration deadline must be before contest start'
    }
  },
  
  // Technical Settings
  allowedLanguages: [{
    type: String,
    enum: ['python', 'javascript', 'java', 'cpp', 'c', 'go', 'rust', 'kotlin'],
    required: true
  }],
  maxSubmissions: {
    type: Number,
    required: true,
    min: 1,
    max: 200,
    default: 50
  },
  penalty: {
    type: Number,
    required: true,
    min: 0,
    max: 60,
    default: 20
  },
  showLeaderboard: {
    type: Boolean,
    default: true
  },
  
  // Contest Content
  questions: {
    type: [problemSchema],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one problem is required'
    }
  },
  
  // Additional Information
  prize: {
    type: String,
    trim: true,
    default: ''
  },
  rules: {
    type: String,
    trim: true,
    maxlength: 3000,
    default: ''
  },
  
  // Contest Status
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft',
    index: true
  },
  
  // Participation Tracking
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    participationStatus: {
      type: String,
      enum: ['registered', 'active', 'completed', 'disqualified'],
      default: 'registered'
    }
  }],
  
  // Statistics (computed fields)
  stats: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    totalSubmissions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual Fields
contestSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.round((this.endDate - this.startDate) / (1000 * 60 * 60)); // Duration in hours
  }
  return 0;
});

contestSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((sum, question) => sum + question.points, 0);
});

contestSchema.virtual('difficultyBreakdown').get(function() {
  const breakdown = { easy: 0, medium: 0, hard: 0 };
  this.questions.forEach(q => {
    breakdown[q.difficulty] = (breakdown[q.difficulty] || 0) + 1;
  });
  return breakdown;
});

contestSchema.virtual('contestState').get(function() {
  const now = new Date();
  if (this.status === 'draft') return 'draft';
  if (this.status === 'cancelled') return 'cancelled';
  if (now < this.startDate) return 'upcoming';
  if (now >= this.startDate && now <= this.endDate) return 'ongoing';
  if (now > this.endDate) return 'completed';
  return 'unknown';
});

// Indexes for Performance
contestSchema.index({ organizer: 1, createdAt: -1 });
contestSchema.index({ status: 1, startDate: 1 });
contestSchema.index({ visibility: 1, startDate: -1 });
contestSchema.index({ 'participants.userId': 1 });
contestSchema.index({ organizerEmail: 1 });

// Pre-save Middleware
contestSchema.pre('save', function(next) {
  // Update lastModified
  this.lastModified = new Date();
  
  // Update participant count
  this.stats.totalParticipants = this.participants.length;
  
  // Validate allowed languages
  if (this.allowedLanguages.length === 0) {
    return next(new Error('At least one programming language must be allowed'));
  }
  
  // Auto-update status based on dates
  const now = new Date();
  if (this.status === 'published') {
    if (now >= this.startDate && now <= this.endDate) {
      this.status = 'ongoing';
    } else if (now > this.endDate) {
      this.status = 'completed';
    }
  }
  
  next();
});

// Static Methods for Access Control
contestSchema.statics.findByOrganizer = function(organizerId, options = {}) {
  return this.find({ 
    organizer: organizerId, 
    isActive: true,
    ...options 
  }).sort({ createdAt: -1 });
};

contestSchema.statics.canModify = function(contestId, organizerId) {
  return this.findOne({ 
    _id: contestId, 
    organizer: organizerId,
    isActive: true 
  });
};

// Instance Methods
contestSchema.methods.canUserModify = function(userId) {
  return this.organizer.toString() === userId.toString();
};

contestSchema.methods.addParticipant = function(userInfo) {
  const existing = this.participants.find(p => 
    p.userId.toString() === userInfo.userId.toString()
  );
  
  if (!existing) {
    this.participants.push({
      userId: userInfo.userId,
      userName: userInfo.userName,
      userEmail: userInfo.userEmail,
      registeredAt: new Date(),
      participationStatus: 'registered'
    });
    this.stats.totalParticipants = this.participants.length;
  }
  
  return this.save();
};

contestSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(p => 
    p.userId.toString() !== userId.toString()
  );
  this.stats.totalParticipants = this.participants.length;
  return this.save();
};

contestSchema.methods.isPublic = function() {
  return this.visibility === 'public';
};

contestSchema.methods.checkIsActive  = function() {
  const now = new Date();
  return this.status === 'ongoing' || 
         (this.status === 'published' && now >= this.startDate && now <= this.endDate);
};

contestSchema.methods.canRegister = function() {
  const now = new Date();
  if (this.registrationRequired && this.registrationDeadline) {
    return now <= this.registrationDeadline;
  }
  return now < this.startDate;
};

contestSchema.methods.updateStats = function(submissionData) {
  if (submissionData) {
    this.stats.totalSubmissions = (this.stats.totalSubmissions || 0) + 1;
    // Add more stat calculations as needed
  }
  return this.save();
};

// Query Middleware for Security
contestSchema.pre(/^find/, function() {
  // Exclude deleted contests by default
  if (!this.getQuery().isActive) {
    this.where({ isActive: { $ne: false } });
  }
});

// Transform JSON output to hide sensitive data for non-organizers
contestSchema.methods.toPublicJSON = function(isOrganizer = false) {
  const obj = this.toObject();
  
  if (!isOrganizer) {
    // Hide sensitive information from non-organizers
    delete obj.password;
    delete obj.organizerEmail;
    
    // Hide hidden test cases and solutions
    if (obj.questions) {
      obj.questions = obj.questions.map(q => ({
        ...q,
        hiddenTestCases: [], // Hide hidden test cases
        solutions: {}, // Hide reference solutions
        authorNotes: '', // Hide internal notes
        editorial: q.editorial || '' // Keep editorial if available
      }));
    }
  }
  
  return obj;
};

// Validation for contest modification
contestSchema.methods.validateModification = function(userId) {
  // Check if user is the organizer
  if (!this.canUserModify(userId)) {
    throw new Error('Access denied: You can only modify contests you created');
  }
  
  // Check if contest can be modified based on status
  const now = new Date();
  if (this.status === 'ongoing' || this.status === 'completed') {
    throw new Error('Cannot modify contest that is ongoing or completed');
  }
  
  // Allow modifications only before contest starts or if it's still in draft
  if (this.status === 'published' && now >= this.startDate) {
    throw new Error('Cannot modify contest after it has started');
  }
  
  return true;
};

// Create compound indexes for efficient queries
contestSchema.index({ organizer: 1, status: 1, startDate: -1 });
contestSchema.index({ visibility: 1, status: 1, startDate: -1 });
contestSchema.index({ status: 1, startDate: 1, endDate: 1 });

// Text search index for contest discovery
contestSchema.index({ 
  name: 'text', 
  description: 'text',
  'questions.title': 'text',
  'questions.tags': 'text'
});

module.exports = mongoose.model('Contest', contestSchema);
