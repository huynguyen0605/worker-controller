const Processes = require('./model');
const processes = (app) => {
  // Get paginated list of processes
  app.get('/api/processes', async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      const processes = await Processes.find()
        .populate('interactions')
        .skip(offset)
        .limit(parseInt(pageSize));
      res.json(processes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get a single process by ID
  app.get('/api/processes/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const process = await Processes.findById(id).populate('interactions');
      res.json(process);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create a new process
  app.post('/api/processes', async (req, res) => {
    const { name, interactions } = req.body;

    try {
      const existingProcesses = await Processes.findOne({ name });

      if (existingProcesses) {
        res.status(400).json({ error: 'Processes with the same name already exists.' });
        return;
      }

      const newProcesses = await Processes.create({ name, interactions });
      res.json({ id: newProcesses._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a process by ID
  app.put('/api/processes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, interactions } = req.body;

    try {
      const updatedProcesses = await Processes.findByIdAndUpdate(
        id,
        { name, interactions },
        { new: true },
      ).populate('interactions');

      res.json({ changes: updatedProcesses });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a process by ID
  app.delete('/api/processes/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await Processes.findByIdAndDelete(id);
      res.json({ message: 'Processes deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

module.exports = processes;
