const clients = (app, db) => {
  // Get paginated list of clients
  app.get('/api/clients', (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    db.all(`SELECT * FROM clients LIMIT ${pageSize} OFFSET ${offset}`, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // Get paginated list of clients
  app.delete('/api/clients/:id', (req, res) => {
    const { id } = req.params;

    db.all(`DELETE FROM clients WHERE id=${id}`, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // Create a new clients
  app.post('/api/clients', async (req, res) => {
    const { name } = req.body;

    // Check if the client with the same name already exists
    const existingClient = await checkClientExistence(name);

    if (existingClient) {
      res.status(400).json({ error: 'Client with the same name already exists.' });
      return;
    }

    db.run(`INSERT INTO clients (name) VALUES (?)`, [name], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  });

  // Function to check if a client with the given name exists
  const checkClientExistence = (name) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM clients WHERE name = ?`, [name], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };
};

module.exports = clients;
