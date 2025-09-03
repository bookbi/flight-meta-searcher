exports.search = async (query) => {
  return {
    provider: 'VietJet',
    price: Math.floor(Math.random() * 1800) + 900,
    currency: 'THB',
    link: 'https://vietjetair.com/mock',
  };
};