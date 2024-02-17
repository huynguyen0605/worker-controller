const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const mongoose = require('mongoose');
(async () => {
  console.log('huynvq::===========>connect mongo');
  await mongoose.connect('mongodb://127.0.0.1:27017/worker-management');
})();
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing) - Adjust as needed for your environment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

require('./routes/clients')(app);
require('./routes/interactions')(app);
require('./routes/processes')(app);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
