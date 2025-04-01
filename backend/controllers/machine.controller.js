// backend/controllers/machine.controller.js
const Machine = require('../models/Machine');

exports.createMachine = async (req, res) => {
  try {
    const { type, mttf } = req.body;
    
    // Generate a unique ID for the machine
    const count = await Machine.countDocuments();
    const machineId = `M-${String(count + 1).padStart(3, '0')}`;
    
    const newMachine = new Machine({
      machineId,
      type,
      mttf,
      status: 'pending', // Initial status
      createdAt: new Date()
    });
    
    await newMachine.save();
    
    return res.status(201).json({
      success: true,
      machine: newMachine
    });
  } catch (error) {
    console.error('Error creating machine:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create machine',
      error: error.message
    });
  }
};

exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      machines
    });
  } catch (error) {
    console.error('Error fetching machines:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch machines',
      error: error.message
    });
  }
};

// backend/controllers/adjuster.controller.js
