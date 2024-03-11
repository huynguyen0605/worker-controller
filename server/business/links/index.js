const Link = require('./model');

const links = (app) => {
  app.get('/api/links', async (req, res) => {
    try {
      const links = await Link.find();
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single link by ID
  app.get('/api/links/:id', async (req, res) => {
    try {
      const link = await Link.findById(req.params.id);
      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }
      res.json(link);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new link
  app.post('/api/links', async (req, res) => {
    try {
      console.log('req.body', req.body);
      const newLink = await Link.create(req.body);
      res.status(201).json(newLink);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update an existing link by ID
  app.put('/api/links/:id', async (req, res) => {
    try {
      const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedLink) {
        return res.status(404).json({ error: 'Link not found' });
      }
      res.json(updatedLink);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a link by ID
  app.delete('/api/links/:id', async (req, res) => {
    try {
      const deletedLink = await Link.findByIdAndDelete(req.params.id);
      if (!deletedLink) {
        return res.status(404).json({ error: 'Link not found' });
      }
      res.json(deletedLink);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = links;
