const airasiaAdapter = require('../providers/airasiaAdapter');
const nokairAdapter = require('../providers/nokairAdapter');
const vietjetAdapter = require('../providers/vietjetAdapter');

exports.aggregateFlights = async (query) => {
  const providers = [airasiaAdapter, nokairAdapter, vietjetAdapter];
  const results = await Promise.all(providers.map((p) => p.search(query)));

  // เลือก best price ต่อ provider
  const bestByProvider = {};
  results.forEach((r) => {
    bestByProvider[r.provider] = {
      price: r.price,
      currency: r.currency,
      link: r.link,
    };
  });

  return bestByProvider;
};