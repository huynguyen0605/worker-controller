const Tag = require('./model');

const tags = (app) => {
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await Tag.find();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single tag by ID
  app.get('/api/tags/:id', async (req, res) => {
    try {
      const tag = await Tag.findById(req.params.id);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(tag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new tag
  app.post('/api/tags', async (req, res) => {
    try {
      const newTag = await Tag.create(req.body);
      res.status(201).json(newTag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update an existing tag by ID
  app.put('/api/tags/:id', async (req, res) => {
    try {
      const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedTag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(updatedTag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a tag by ID
  app.delete('/api/tags/:id', async (req, res) => {
    try {
      const deletedTag = await Tag.findByIdAndDelete(req.params.id);
      if (!deletedTag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(deletedTag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = tags;
