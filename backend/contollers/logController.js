const Log = require('../models/Log');

exports.createLog = async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.json({ message: 'Log saved!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving log' });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
};
