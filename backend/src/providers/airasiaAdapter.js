exports.search = async (query) => {
  return {
    provider: 'AirAsia',
    price: Math.floor(Math.random() * 2000) + 1000,
    currency: 'THB',
    link: 'https://airasia.com/mock',
  };
};