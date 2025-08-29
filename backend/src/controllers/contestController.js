const Contest = require('../models/Contest');
const User = require('../models/User');

// Create new contest
exports.createContest = async (req, res) => {
  try {
    // Get user details from database
    const organizer = await User.findById(req.user.id);
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    if (organizer.role !== 'organizer') {
      return res.status(403).json({ 
        message: 'Access denied. Only organizers can create contests.' 
      });
    }

    const contestData = {
      ...req.body,
      organizer: organizer._id
    };

    const contest = new Contest(contestData);
    await contest.save();

    res.status(201).json({
      message: 'Contest created successfully',
      contest: contest.toPublicJSON(true)
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to create contest', 
      error: error.message 
    });
  }
};

// Get all public contests (for discovery)
exports.getAllContests = async (req, res) => {
  try {
    const { status, difficulty, category, page = 1, limit = 10 } = req.query;
    
    const query = { 
      visibility: 'public',
      isActive: true 
    };

    if (status) query.status = status;
    
    const contests = await Contest.find(query)
      .populate('organizer', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contest.countDocuments(query);

    res.json({
      contests: contests.map(c => c.toPublicJSON(false)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch contests', 
      error: error.message 
    });
  }
};

// Get organizer's contests
exports.getMyContests = async (req, res) => {
  try {
    const contests = await Contest.findByOrganizer(req.user.id);
    res.json({
      contests: contests.map(c => c.toPublicJSON(true))
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch your contests', 
      error: error.message 
    });
  }
};

// Get single contest
exports.getContest = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findById(id).populate('organizer', 'fullName email');
    
    if (!contest || !contest.isActive) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const isOrganizer = req.user && contest.canUserModify(req.user.id);
    res.json(contest.toPublicJSON(isOrganizer));
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch contest', 
      error: error.message 
    });
  }
};

// Update contest
exports.updateContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contest = await Contest.canModify(id, req.user.id);
    if (!contest) {
      return res.status(404).json({ 
        message: 'Contest not found or you do not have permission to modify it' 
      });
    }

    // Validate modification is allowed
    contest.validateModification(req.user.id);

    // Update contest
    Object.assign(contest, req.body);
    await contest.save();

    res.json({
      message: 'Contest updated successfully',
      contest: contest.toPublicJSON(true)
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to update contest', 
      error: error.message 
    });
  }
};

// Delete contest (soft delete)
exports.deleteContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contest = await Contest.canModify(id, req.user.id);
    if (!contest) {
      return res.status(404).json({ 
        message: 'Contest not found or you do not have permission to delete it' 
      });
    }

    // Check if contest can be deleted
    if (contest.status === 'ongoing') {
      return res.status(400).json({ 
        message: 'Cannot delete an ongoing contest' 
      });
    }

    // Soft delete
    contest.isActive = false;
    await contest.save();

    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete contest', 
      error: error.message 
    });
  }
};

// Join contest (for participants)
exports.joinContest = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const contest = await Contest.findById(id);
    if (!contest || !contest.isActive) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if contest is private and password is correct
    if (contest.visibility === 'private') {
      if (!password || password !== contest.password) {
        return res.status(403).json({ message: 'Invalid password for private contest' });
      }
    }

    // Check registration requirements
    if (!contest.canRegister()) {
      return res.status(400).json({ message: 'Registration period has ended' });
    }

    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add participant
    await contest.addParticipant({
      userId: user._id,
      userName: user.fullName,
      userEmail: user.email
    });

    res.json({ 
      message: 'Successfully joined contest',
      contest: contest.toPublicJSON(false)
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to join contest', 
      error: error.message 
    });
  }
};

// Leave contest
exports.leaveContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contest = await Contest.findById(id);
    if (!contest || !contest.isActive) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if contest has started
    if (contest.status === 'ongoing' || contest.status === 'completed') {
      return res.status(400).json({ 
        message: 'Cannot leave contest that has started or completed' 
      });
    }

    await contest.removeParticipant(req.user.id);

    res.json({ message: 'Successfully left contest' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to leave contest', 
      error: error.message 
    });
  }
};

// Get contest participants (organizer only)
exports.getContestParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contest = await Contest.findById(id);
    if (!contest || !contest.isActive) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if user is organizer
    if (!contest.canUserModify(req.user.id)) {
      return res.status(403).json({ 
        message: 'Access denied. Only organizers can view participants.' 
      });
    }

    res.json({
      participants: contest.participants,
      totalCount: contest.participants.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch participants', 
      error: error.message 
    });
  }
};
