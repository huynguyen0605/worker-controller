const Job = require('./model');
const jobs = (app) => {
  app.get('/api/jobs', async (req, res) => {
    try {
      const { page = 1, pageSize = 10, status, sortBy } = req.query;

      let query = {};
      if (status) {
        query.status = status;
      }

      const jobs = await Job.find(query)
        .sort(sortBy ? { [sortBy]: 1 } : {})
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize))
        .exec();

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Job by ID
  app.get('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const job = await Job.findById(id).exec();
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Job
  app.post('/api/jobs', async (req, res) => {
    const { name, code, status, client_id, client_name } = req.body;

    try {
      const newJob = new Job({ name, code, status, client_id, client_name });
      const savedJob = await newJob.save();
      res.json(savedJob);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update Job by ID
  app.put('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, status, client_id, client_name } = req.body;

    try {
      const updatedJob = await Job.findByIdAndUpdate(
        id,
        { name, code, status, client_id, client_name },
        { new: true },
      );

      if (!updatedJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete Job by ID
  app.delete('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const deletedJob = await Job.findByIdAndDelete(id);
      if (!deletedJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = jobs;
