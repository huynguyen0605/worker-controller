const Client = require('../../routes/clients/model');
const Account = require('./model');
const accounts = (app) => {
  // Get all accounts
  app.get('/api/accounts', async (req, res) => {
    try {
      const accounts = await Account.find();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/account-by-client', async (req, res) => {
    try {
      const { clientName } = req.query;
      const client = await Client.findOne({ name: clientName });
      const accounts = await Account.find({
        client_assigned_to: client._id,
      });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single account by ID
  app.get('/api/accounts/:id', async (req, res) => {
    try {
      const account = await Account.findById(req.params.id);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new account
  app.post('/api/accounts', async (req, res) => {
    try {
      const newAccount = await Account.create(req.body);
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update an existing account by ID
  app.put('/api/accounts/:id', async (req, res) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedAccount) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json(updatedAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete an account by ID
  app.delete('/api/accounts/:id', async (req, res) => {
    try {
      const deletedAccount = await Account.findByIdAndDelete(req.params.id);
      if (!deletedAccount) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json(deletedAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = accounts;
