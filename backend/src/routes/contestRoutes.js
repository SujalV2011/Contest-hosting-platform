const express = require('express');
const router = express.Router();
const {
  createContest,
  getAllContests,
  getMyContests,
  getContest,
  updateContest,
  deleteContest,
  joinContest,
  leaveContest,
  getContestParticipants
} = require('../controllers/contestController');

const auth = require('../middleware/authMiddleware');
const {
  requireOrganizer,
  requireContestOwnership,
  requireModifiable,
  validateContestData,
  checkContestAccess,
  rateLimitContestCreation,
  logContestActivity
} = require('../middleware/contestMiddleware');

// Public routes (no authentication required)
router.get('/public', getAllContests); // Get all public contests

// Protected routes (authentication required)
router.use(auth); // Apply authentication to all routes below

// Contest CRUD operations for organizers
router.post('/', 
  requireOrganizer,
  validateContestData,
  rateLimitContestCreation,
  logContestActivity('create'),
  createContest
);

router.get('/my-contests', 
  requireOrganizer,
  logContestActivity('view_my_contests'),
  getMyContests
);

router.get('/:id', 
  logContestActivity('view'),
  getContest
);

router.put('/:id',
  requireContestOwnership,
  requireModifiable,
  validateContestData,
  logContestActivity('update'),
  updateContest
);

router.delete('/:id',
  requireContestOwnership,
  logContestActivity('delete'),
  deleteContest
);

// Participant management
router.post('/:id/join',
  checkContestAccess,
  logContestActivity('join'),
  joinContest
);

router.post('/:id/leave',
  logContestActivity('leave'),
  leaveContest
);

// Organizer-only participant management
router.get('/:id/participants',
  requireContestOwnership,
  logContestActivity('view_participants'),
  getContestParticipants
);

module.exports = router;
