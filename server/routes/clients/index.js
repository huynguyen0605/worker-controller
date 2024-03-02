const Interaction = require('../interactions/model');
const Client = require('./model');
const cron = require('node-cron');

/**update to true if client idle for 20 minutes */
async function updateClients() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    console.log('tenMinutesAgo', tenMinutesAgo);

    // Update clients where available is false and updatedAt is more than 10 minutes old
    const result = await Client.updateMany(
      { available: false, updatedAt: { $lt: tenMinutesAgo } },
      { $set: { available: true } },
    );

    console.log(`${result.modifiedCount} clients updated to available=true.`);
  } catch (error) {
    console.error('Error updating clients:', error);
  }
}

// Schedule the update to run every 10 minutes
cron.schedule('*/2 * * * *', () => {
  console.log('Running client update job...');
  updateClients();
});

const clients = (app) => {
  app.get('/api/available-client', async (req, res) => {
    try {
      const { name: queryName } = req.query;
      let name = 'default';
      if (queryName) name = queryName;
      const cleanedName = name.replace(/\d+$/, '');

      const client = await Client.findOne({
        name: { $regex: `^${cleanedName}\\d*$` },
        available: true,
      });
      if (!client) {
        //find lastest name client exists

        console.log('cleanedName', cleanedName);

        const largestClient = await Client.findOne(
          { name: { $regex: `^${cleanedName}\\d*$` } },
          {},
          { sort: { name: -1 } },
        );
        let newClientName = `${cleanedName}`;
        if (largestClient) {
          // If there are existing clients with the same prefix, extract the number and increment it
          const existingNumber = parseInt(largestClient.name.replace(cleanedName, ''), 10) || 0;
          newClientName = `${cleanedName}${existingNumber + 1}`;
        }
        const newClient = await Client.create({ name: newClientName, available: false });
        res.json(newClient);
      } else {
        await client.updateOne({ available: false });
        res.json(client);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/ping-client', async (req, res) => {
    try {
      const { name } = req.query;
      console.log('huynvq::====>ping client', name);
      const client = await Client.findOne({ name });
      if (client) {
        console.log(`============>/api/ping-client client found ${name}`);
        await Client.updateOne({ name }, { $set: { available: false, updatedAt: new Date() } });
      } else {
        console.log(`============>/api/ping-client client not found ${name}`);
        res.status(500).json({ error: `Không tìm thấy client ${name}` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/client-by-name', async (req, res) => {
    try {
      const { clientName } = req.query;
      const client = await Client.findOne({ name: clientName }).populate('process');

      if (client) {
        if (client.process) {
          const interactionIds = client.process.interactions;

          // Use interactionIds to find interactions in the specified order
          const interactionsMap = {}; // Map to store interactions based on their ID
          const interactions = await Interaction.find({ _id: { $in: interactionIds } });

          // Populate the interactionsMap with interactions
          interactions.forEach((interaction) => {
            interactionsMap[interaction._id.toString()] = interaction;
          });

          // Reorder interactions based on the original order of interactionIds
          const orderedInteractions = interactionIds.map((id) => interactionsMap[id]);

          // Now 'orderedInteractions' contains the populated data for the interactions in the correct order
          client.process.interactions = orderedInteractions;
        }
        res.json(client);
      } else {
        console.log(`============>/api/client-by-name client not found ${name}`);
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
      const clients = await Client.find()
        .populate('process')
        .skip(offset)
        .limit(parseInt(pageSize))
        .sort({ sort: 'asc' });
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

  app.put('/api/clients/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const updated = await Client.findByIdAndUpdate(id, data, { new: true });
      if (!updated) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = clients;
