const Client = require('./model');
const cron = require('node-cron');

/**update to true if client idle for 20 minutes */
async function updateClients() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    // Update clients where available is false and updatedAt is more than 10 minutes old
    const result = await Client.updateMany(
      { available: false, updatedAt: { $lt: tenMinutesAgo } },
      { $set: { available: true } },
    );

    console.log(`${result} clients updated to available=true.`);
  } catch (error) {
    console.error('Error updating clients:', error);
  }
}

// Schedule the update to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Running client update job...');
  updateClients();
});

const clients = (app) => {
  app.get('/api/available-client', async (req, res) => {
    try {
      const { name: queryName } = req.query;
      let name = 'default';
      if (queryName) name = queryName;

      const client = await Client.findOne({
        name: { $regex: `^${name}\\d*$` },
        available: true,
      });
      if (!client) {
        //find lastest name client exists
        const largestClient = await Client.findOne(
          { name: { $regex: `^${name}\\d*$` } },
          {},
          { sort: { name: -1 } },
        );
        let newClientName = `${name}`;
        if (largestClient) {
          // If there are existing clients with the same prefix, extract the number and increment it
          const existingNumber = parseInt(largestClient.name.replace(name, ''), 10) || 0;
          newClientName = `${name}${existingNumber + 1}`;
        }
        const newClient = await Client.create({ name: newClientName });
        res.json(newClient);
      } else {
        res.json(client);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/ping-client', async (req, res) => {
    try {
      const { name } = req.query;
      const client = await Client.findOne({ name });
      if (client) {
        await Client.updateOne({ name }, { $set: { updatedAt: new Date() } });
      } else {
        console.log(`============>/api/ping-client client not found ${name}`);
        res.status(500).json({ error: `Không tìm thấy client ${name}` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get paginated list of clients
  app.get('/api/clients', async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      const clients = await Client.find().skip(offset).limit(parseInt(pageSize));
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a client
  app.delete('/api/clients/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await Client.findByIdAndDelete(id);
      res.json({ message: 'Client deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create a new client
  app.post('/api/clients', async (req, res) => {
    const { name } = req.body;

    // Check if the client with the same name already exists
    const existingClient = await Client.findOne({ name });

    if (existingClient) {
      res.status(400).json({ error: 'Client with the same name already exists.' });
      return;
    }

    try {
      const newClient = await Client.create({ name });
      res.json({ id: newClient._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

module.exports = clients;
