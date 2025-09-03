exports.search = async (query) => {
  return {
    provider: 'NokAir',
    price: Math.floor(Math.random() * 2500) + 1200,
    currency: 'THB',
    link: 'https://nokair.com/mock',
  };
};