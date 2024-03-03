const Quora = require('./model');
const Job = require('../jobs/model');
const puppeteerReply = require('../facebook/templates/reply');
const { NodeHtmlMarkdown } = require('node-html-markdown');
const RoundRobin = require('../../mechanism/roundrobin');
const upvote = require('../facebook/templates/upvote');
const nhm = new NodeHtmlMarkdown(
  /* options (optional) */ {},
  /* customTransformers (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined,
);

const quoras = (app) => {
  app.get('/api/quoras', async (req, res) => {
    try {
      const { page = 1, pageSize = 10, status, sortBy } = req.query;

      const filter = status ? { status } : {};
      const sort = sortBy ? { [sortBy]: 1 } : {};

      const quoras = await Quora.find(filter)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));

      res.json(quoras);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET Quora by ID
  app.get('/api/quoras/:id', async (req, res) => {
    try {
      const quora = await Quora.findById(req.params.id);
      if (!quora) {
        return res.status(404).json({ error: 'Quora not found' });
      }
      res.json(quora);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST a new Quora
  app.post('/api/quoras', async (req, res) => {
    const quoraData = req.body;

    try {
      const quora = await Quora.create(quoraData);
      res.status(201).json(quora);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/quoras-bulk', async (req, res) => {
    const quoraData = req.body;

    console.log('huynvq::==================>bulk', quoraData);
    try {
      const urlsToCheck = quoraData.map((quora) => quora.url);
      const existingQuoras = await Quora.find({ url: { $in: urlsToCheck } });
      const newQuoras = quoraData.filter((quora) => {
        return !existingQuoras.some((existingQuora) => existingQuora.url === quora.url);
      });
      const insertedQuoras = await Quora.insertMany(newQuoras);
      res.status(201).json(insertedQuoras);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/quoras-reply/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const quora = await Quora.findById(id);

      const { keyword, title, url, status, number_of_upvote, number_of_comment } = quora;

      const roundRobin = new RoundRobin();
      const client = await roundRobin.getNextClient('quora-executor');
      console.log('huynvq::=====>client', client);
      const { _id: client_id, name: client_name } = client;
      //nếu ko truyền client thì tìm 1 client tên là quora, trạng thái đang active để lưu
      console.log('huynvq::======>client_id', client_id, client_name);

      const contentMd = nhm.translate(content);
      await Job.create({
        name: `${url}`,
        status: 'iddle',
        code: puppeteerReply(url, contentMd),
        client_id: client_id,
        client_name: client_name,
      });

      await Quora.findByIdAndUpdate(id, { reply: content });

      res.status(200).json(true);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/quoras-upvote/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const quora = await Quora.findById(id);
      const { answer_url } = quora;

      const roundRobin = new RoundRobin();
      const client = await roundRobin.getNextClient('quora-executor');
      const { _id: client_id, name: client_name } = client;

      //nếu ko truyền client thì tìm 1 client tên là quora, trạng thái đang active để lưu

      await Job.create({
        name: `${url}`,
        status: 'iddle',
        code: upvote(answer_url),
        client_id: client_id,
        client_name: client_name,
      });

      await Quora.findByIdAndUpdate(id, { reply: content });

      res.status(200).json(true);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT (update) Quora by ID
  app.put('/api/quoras/:id', async (req, res) => {
    const { id } = req.params;
    const quoraData = req.body;

    try {
      const updatedQuora = await Quora.findByIdAndUpdate(id, quoraData, { new: true });
      if (!updatedQuora) {
        return res.status(404).json({ error: 'Quora not found' });
      }
      res.json(updatedQuora);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE Quora by ID
  app.delete('/api/quoras/:id', async (req, res) => {
    try {
      const deletedQuora = await Quora.findByIdAndDelete(req.params.id);
      if (!deletedQuora) {
        return res.status(404).json({ error: 'Quora not found' });
      }
      res.json({ message: 'Quora deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = quoras;
