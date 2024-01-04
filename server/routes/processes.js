const processes = (app, db) => {
  // Get paginated list of steps
  app.get('/api/processes', (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    db.all(`SELECT * FROM processes LIMIT ${pageSize} OFFSET ${offset}`, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // Get a single step by ID
  app.get('/api/processes/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM processes WHERE id = ?`, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });

  // Create a new step
  app.post('/api/processes', async (req, res) => {
    const { name, interactions } = req.body;

    const existingProcess = await checkProcessesExistence(name);

    if (existingProcess) {
      res.status(400).json({ error: 'Client with the same name already exists.' });
      return;
    }

    db.run(
      `INSERT INTO processes (name, interactions) VALUES (?, ?)`,
      [name, interactions],
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
  app.put('/api/processes/:id', (req, res) => {
    const { id } = req.params;
    const { name, interactions } = req.body;

    db.run(
      `UPDATE processes SET name = ?, interactions = ? WHERE id = ?`,
      [name, interactions, id],
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
  app.delete('/api/processes/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM processes WHERE id = ?`, [id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    });
  });

  const checkProcessesExistence = (name) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM processes WHERE name = ?`, [name], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  };
};

module.exports = processes;
