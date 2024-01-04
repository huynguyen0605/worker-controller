const interactions = (app, db) => {
  const checkInteractionsExistence = (name) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM interactions WHERE name = ?`, [name], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };
  // Get paginated list of steps
  app.get('/api/interactions', (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    db.all(`SELECT * FROM interactions LIMIT ${pageSize} OFFSET ${offset}`, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // Get a single step by ID
  app.get('/api/interactions/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM interactions WHERE id = ?`, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });

  // Create a new step
  app.post('/api/interactions', async (req, res) => {
    const { name, content, params } = req.body;

    const existingClient = await checkInteractionsExistence(name);

    if (existingClient) {
      res.status(400).json({ error: 'Client with the same name already exists.' });
      return;
    }

    db.run(
      `INSERT INTO interactions (name, content, params) VALUES (?, ?, ?)`,
      [name, content, params],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      },
    );
  });

  // Update a step by ID
  app.put('/api/interactions/:id', (req, res) => {
    const { id } = req.params;
    const { name, content, params } = req.body;

    db.run(
      `UPDATE interactions SET name = ?, content = ?, params = ? WHERE id = ?`,
      [name, content, params, id],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ changes: this.changes });
      },
    );
  });

  // Delete a step by ID
  app.delete('/api/interactions/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM interactions WHERE id = ?`, [id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    });
  });
};

module.exports = interactions;
