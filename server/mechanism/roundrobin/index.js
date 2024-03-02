const Client = require('../../routes/clients/model');
class RoundRobin {
  this = undefined;
  clientsMap = {};
  indexMap = {};
  constructor() {
    if (this) return this;
    return new RoundRobin();
  }

  async newRound(key) {
    if (!this.clientsMap[key]) {
      this.clientsMap[key] = [];
    }

    if (!this.indexMap[key]) {
      this.indexMap[key] = 0;
    }

    const clients = await Client.find({
      name: { $regex: `^${key}\\d*$` },
      available: false,
    });

    this.clientsMap[key] = clients;
    this.indexMap[key] = 0;
  }

  async getNextClient(key) {
    if (!this.clientsMap[key]) await this.newRound(key);
    const clientLength = this.clientsMap[key].length;
    if (this.indexMap[key] >= clientLength) await this.newRound(key);
    console.log('huynvq::===============>this.clientMap', this.clientsMap, this.indexMap, key);
    return this.clientsMap[key][this.indexMap[key]];
  }
}

module.exports = RoundRobin;
