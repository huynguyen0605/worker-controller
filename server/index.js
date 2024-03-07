const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const mongoose = require('mongoose');
(async () => {
  console.log('huynvq::===========>connect mongo');
  await mongoose.connect('mongodb://127.0.0.1:27017/worker-management');
})();
// Middleware to parse JSON requests
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));

// Middleware to handle CORS (Cross-Origin Resource Sharing) - Adjust as needed for your environment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

require('./routes/clients')(app);
require('./routes/interactions')(app);
require('./routes/processes')(app);
require('./business/jobs')(app);
require('./business/quora')(app);
require('./business/account')(app);
require('./business/tag')(app);
require('./business/links')(app);
require('./business/facebook')(app);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const Job = require('./business/jobs/model');
const Account = require('./business/account/model');
const Client = require('./routes/clients/model');
async function assignClientsToJobs() {
  try {
    //find active client with same tag with job
    const jobs = await Job.find({ status: 'iddle' });
    let tagIds = [];
    jobs.forEach((job) => {
      tagIds = [...tagIds, ...job.tags];
    });

    const accounts = await Account.find({
      tags: {
        $in: tagIds,
      },
    });
    let clientIds = [];
    accounts.forEach((account) => {
      clientIds = [...clientIds, account.client_assigned_to];
    });

    const clients = await Client.find({
      _id: { $in: clientIds },
      available: false,
    });

    console.log('assign job to client', clients, jobs);

    const bulkWriteOperations = jobs.map((job, index) => {
      const assignedClient = clients[index % clients.length];
      console.log('assignedClient', assignedClient, index, clients);
      return {
        updateOne: {
          filter: { _id: job._id },
          update: {
            $set: {
              client_id: assignedClient._id,
              client_name: assignedClient.name,
            },
          },
        },
      };
    });

    await Job.bulkWrite(bulkWriteOperations);
  } catch (error) {
    console.log('no jobs to assign', error.message);
  }
}

setInterval(async () => {
  assignClientsToJobs();
}, 60000);
