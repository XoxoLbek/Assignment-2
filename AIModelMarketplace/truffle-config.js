module.exports = {
  networks: {
    development: {
      // Настройка подключения к локальному Ganache
      host: "127.0.0.1",  // Адрес хоста
      port: 7545,         // Порт, на котором работает Ganache (по умолчанию 7545)
      network_id: "5777", // Идентификатор сети (по умолчанию для Ganache)
    },
  },

  // Настройка компилятора Solidity
  compilers: {
    solc: {
      version: "0.8.0", // Указание версии компилятора Solidity
    },
  },
};
