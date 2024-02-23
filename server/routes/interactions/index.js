const Interaction = require('./model');
const interactions = (app) => {
  const checkInteractionsExistence = async (name) => {
    try {
      const existingInteraction = await Interaction.findOne({ name });
      return existingInteraction;
    } catch (err) {
      throw err;
    }
  };

  // Get paginated list of interactions
  app.get('/api/interactions', async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      const interactions = await Interaction.find()
        .skip(offset)
        .limit(parseInt(pageSize))
        .sort({ sort: 'asc' })
        .sort({ updatedAt: 'desc' });
      res.json(interactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get a single interaction by ID
  app.get('/api/interactions/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const interaction = await Interaction.findById(id);
      res.json(interaction);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create a new interaction
  app.post('/api/interactions', async (req, res) => {
    const { name, content, params } = req.body;

    try {
      const existingInteraction = await checkInteractionsExistence(name);

      if (existingInteraction) {
        res.status(400).json({ error: 'Interaction with the same name already exists.' });
        return;
      }

      const newInteraction = await Interaction.create({ name, content, params });
      res.json({ id: newInteraction._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update an interaction by ID
  app.put('/api/interactions/:id', async (req, res) => {
    const { id } = req.params;
    const interactionData = req.body;

    try {
      const updatedInteraction = await Interaction.findByIdAndUpdate(id, interactionData, {
        new: true,
      });

      res.json({ changes: updatedInteraction });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete an interaction by ID
  app.delete('/api/interactions/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await Interaction.findByIdAndDelete(id);
      res.json({ message: 'Interaction deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

module.exports = interactions;
