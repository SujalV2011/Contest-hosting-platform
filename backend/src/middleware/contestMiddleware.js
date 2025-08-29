const Contest = require('../models/Contest');
const User = require('../models/User');

// Middleware to check if user is an organizer
const requireOrganizer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'organizer') {
      return res.status(403).json({ 
        message: 'Access denied. Only organizers can perform this action.' 
      });
    }

    req.organizer = user;
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error verifying organizer status', 
      error: error.message 
    });
  }
};

// Middleware to check contest ownership
const requireContestOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const contest = await Contest.findById(id);
    if (!contest || !contest.isActive) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    if (!contest.canUserModify(req.user.id)) {
      return res.status(403).json({ 
        message: 'Access denied. You can only modify contests you created.' 
      });
    }

    req.contest = contest;
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error verifying contest ownership', 
      error: error.message 
    });
  }
};

// Middleware to check if contest can be modified
const requireModifiable = (req, res, next) => {
  try {
    const contest = req.contest;
    
    // Validate modification is allowed
    contest.validateModification(req.user.id);
    next();
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
};

// Middleware to validate contest data
const validateContestData = (req, res, next) => {
  const { name, description, startDate, endDate, visibility, password, questions } = req.body;
  const errors = [];

  // Basic validation
  if (!name || name.trim().length === 0) {
    errors.push('Contest name is required');
  }
  if (!description || description.trim().length === 0) {
    errors.push('Contest description is required');
  }
  if (!startDate) {
    errors.push('Start date is required');
  }
  if (!endDate) {
    errors.push('End date is required');
  }

  // Date validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start <= now) {
      errors.push('Contest start date must be in the future');
    }
    if (end <= start) {
      errors.push('Contest end date must be after start date');
    }
  }

  // Private contest validation
  if (visibility === 'private') {
    if (!password || password.length < 6) {
      errors.push('Private contests must have a password of at least 6 characters');
    }
  }

  // Questions validation (for creation and updates)
  if (questions !== undefined) {
    if (!Array.isArray(questions) || questions.length === 0) {
      errors.push('At least one problem is required');
    } else {
      questions.forEach((q, idx) => {
        if (!q.title || q.title.trim().length === 0) {
          errors.push(`Problem ${idx + 1}: Title is required`);
        }
        if (!q.description || q.description.trim().length < 50) {
          errors.push(`Problem ${idx + 1}: Description must be at least 50 characters`);
        }
        if (!q.sampleTestCases || q.sampleTestCases.length === 0) {
          errors.push(`Problem ${idx + 1}: At least one sample test case is required`);
        }
        if (!q.hiddenTestCases || q.hiddenTestCases.length === 0) {
          errors.push(`Problem ${idx + 1}: At least one hidden test case is required`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

// Middleware to check contest access for participants
const checkContestAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const contest = await Contest.findById(id);
    if (!contest || !contest.isActive) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if contest is private and password is provided
    if (contest.visibility === 'private') {
      if (!password) {
        return res.status(403).json({ 
          message: 'Password required for private contest',
          requiresPassword: true 
        });
      }
      if (password !== contest.password) {
        return res.status(403).json({ message: 'Invalid password' });
      }
    }

    req.contest = contest;
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking contest access', 
      error: error.message 
    });
  }
};

// Middleware to rate limit contest creation
const rateLimitContestCreation = async (req, res, next) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentContests = await Contest.countDocuments({
      organizer: req.user.id,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentContests >= 5) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded. You can create maximum 5 contests per hour.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking rate limits', 
      error: error.message 
    });
  }
};

// Middleware to log contest activities
const logContestActivity = (action) => {
  return (req, res, next) => {
    req.contestActivity = {
      action,
      userId: req.user?.id,
      contestId: req.params?.id,
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress
    };
    
    console.log(`Contest Activity: ${action}`, req.contestActivity);
    next();
  };
};

module.exports = {
  requireOrganizer,
  requireContestOwnership,
  requireModifiable,
  validateContestData,
  checkContestAccess,
  rateLimitContestCreation,
  logContestActivity
};
