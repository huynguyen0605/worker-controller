const Facebook = require('./model');
const Job = require('../jobs/model');
const puppeteerReply = require('./templates/reply');
const { NodeHtmlMarkdown } = require('node-html-markdown');
const RoundRobin = require('../../mechanism/roundrobin');
const upvote = require('./templates/upvote');
const fbAnalyzer = require('./facebook-analyzer');
const isIgnore = require('./facebook-analyzer/ignore-keywords');

const analyzer = async (newFacebooks) => {
  console.log('start analyzer', newFacebooks.length);
  let analyzedJobs = [];
  let analyzedFacebooks = [];
  newFacebooks.forEach((facebook) => {
    const ignoreKeyword = isIgnore(facebook.title);
    if (ignoreKeyword) {
      console.log('ignored post', ignoreKeyword);
      return;
    }
    let result = { ...facebook };
    let answer = fbAnalyzer(facebook.title);
    console.log('answer', answer);
    if (answer) {
      result = {
        ...facebook,
        reply: `<p>${answer}</p>`,
        status: 'replied',
      };
      analyzedJobs.push({
        name: facebook.url,
        code: puppeteerReply(facebook.url, answer),
        domain: 'facebook',
        tags: facebook.tags,
        status: 'iddle',
      });
    }

    analyzedFacebooks.push(result);
  });
  console.log('analyzedFacebooks', analyzedFacebooks.length);
  if (analyzedFacebooks.length == 0) return;
  await Facebook.insertMany(analyzedFacebooks);
  const namesToCheck = analyzedJobs.map((job) => job.name);
  const existingJobs = await Job.find({ name: { $in: namesToCheck } });
  const newJobs = analyzedJobs.filter((job) => {
    return !existingJobs.some((existingJob) => existingJob.name === job.name);
  });
  await Job.insertMany(newJobs);
};

const reAnalyze = async (facebooks) => {
  console.log('start reanalyze', facebooks.length);
  let analyzedJobs = [];
  let analyzedFacebooks = [];
  facebooks.forEach((facebook) => {
    const ignoreKeyword = isIgnore(facebook.title);
    if (ignoreKeyword) {
      console.log('ignored post', ignoreKeyword);
      return;
    }
    let result = { ...facebook };
    let answer = fbAnalyzer(facebook.title);
    console.log('answer', answer);
    if (answer) {
      result = {
        ...facebook,
        reply: `<p>${answer}</p>`,
        status: 'replied',
      };
      analyzedJobs.push({
        name: facebook.url,
        code: puppeteerReply(facebook.url, answer),
        domain: 'facebook',
        tags: facebook.tags,
        status: 'iddle',
      });
    }

    analyzedFacebooks.push(result);
  });
  console.log('reAnalyzedFacebooks', analyzedFacebooks.length);
  if (analyzedFacebooks.length == 0) return;

  // Update documents in the Facebook collection based on URL
  await Promise.all(
    analyzedFacebooks.map(async (analyzedFacebook) => {
      // Exclude the '__v' field from being updated
      const { __v, ...updatedData } = analyzedFacebook;
      await Facebook.updateOne(
        { url: analyzedFacebook.url },
        { $set: updatedData },
        { upsert: true },
      );
    }),
  );

  const namesToCheck = analyzedJobs.map((job) => job.name);
  const existingJobs = await Job.find({ name: { $in: namesToCheck } });
  const newJobs = analyzedJobs.filter((job) => {
    return !existingJobs.some((existingJob) => existingJob.name === job.name);
  });
  await Job.insertMany(newJobs);
};
const facebooks = (app) => {
  app.get('/api/facebooks', async (req, res) => {
    try {
      const { page = 1, pageSize = 10, status, sortBy } = req.query;

      let filter = !status ? {} : status == 'iddle' ? { status: null } : { status: 'replied' };
      const sort = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };
      filter = {
        ...filter,
        visible: true,
      };

      const facebooks = await Facebook.find(filter)
        .populate('tags')
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));

      res.json(facebooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET Facebook by ID
  app.get('/api/facebooks/:id', async (req, res) => {
    try {
      const facebook = await Facebook.findById(req.params.id);
      if (!facebook) {
        return res.status(404).json({ error: 'Facebook not found' });
      }
      res.json(facebook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST a new Facebook
  app.post('/api/facebooks', async (req, res) => {
    const facebookData = req.body;

    try {
      const facebook = await Facebook.create(facebookData);
      res.status(201).json(facebook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/analyze-facebook', async (req, res) => {
    const facebooks = await Facebook.find({ status: null, visible: true });
    await reAnalyze(facebooks);
    res.status(201).json(true);
  });

  app.post('/api/facebooks-bulk', async (req, res) => {
    const facebookData = req.body;

    try {
      console.log('huynvq::==================>bulk', facebookData.length);
      const urlsToCheck = facebookData.map((facebook) => facebook.url);
      const existingFacebooks = await Facebook.find({ url: { $in: urlsToCheck } });
      const newFacebooks = facebookData.filter((facebook) => {
        return !existingFacebooks.some((existingFacebook) => existingFacebook.url === facebook.url);
      });

      await analyzer(newFacebooks);
      res.status(201).json(true);
    } catch (error) {
      console.log('error bulk', error.message);
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/facebooks-reply/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const facebook = await Facebook.findById(id);

      const { keyword, title, url, status, number_of_upvote, number_of_comment, tags } = facebook;
      const contentMd = content.replace(/<[^>]*>/g, '');
      await Job.create({
        name: `${url}`,
        status: 'iddle',
        code: puppeteerReply(url, contentMd),
        domain: 'facebook',
        tags: tags,
      });

      await Facebook.findByIdAndUpdate(id, { reply: content, status: 'replied' });

      res.status(200).json(true);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT (update) Facebook by ID
  app.put('/api/facebooks/:id', async (req, res) => {
    const { id } = req.params;
    const facebookData = req.body;

    try {
      const updatedFacebook = await Facebook.findByIdAndUpdate(id, facebookData, { new: true });
      if (!updatedFacebook) {
        return res.status(404).json({ error: 'Facebook not found' });
      }
      res.json(updatedFacebook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE Facebook by ID
  app.delete('/api/facebooks/:id', async (req, res) => {
    try {
      const deletedFacebook = await Facebook.findByIdAndDelete(req.params.id);
      if (!deletedFacebook) {
        return res.status(404).json({ error: 'Facebook not found' });
      }
      res.json({ message: 'Facebook deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = facebooks;
