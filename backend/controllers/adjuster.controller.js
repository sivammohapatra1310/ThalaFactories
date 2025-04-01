const Adjuster = require('../models/Adjuster');

exports.createAdjuster = async (req, res) => {
  try {
    const { expertise } = req.body;
    
    // Generate a unique ID for the adjuster
    const count = await Adjuster.countDocuments();
    const adjusterId = `A-${String(count + 1).padStart(3, '0')}`;
    
    const newAdjuster = new Adjuster({
      adjusterId,
      expertise,
      status: 'available', // Initial status
      createdAt: new Date()
    });
    
    await newAdjuster.save();
    
    return res.status(201).json({
      success: true,
      adjuster: newAdjuster
    });
  } catch (error) {
    console.error('Error creating adjuster:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create adjuster',
      error: error.message
    });
  }
};

exports.getAdjusters = async (req, res) => {
  try {
    const adjusters = await Adjuster.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      adjusters
    });
  } catch (error) {
    console.error('Error fetching adjusters:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch adjusters',
      error: error.message
    });
  }
};