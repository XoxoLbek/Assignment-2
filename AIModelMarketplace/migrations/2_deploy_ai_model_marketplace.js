const AIModelMarketplace = artifacts.require("AIModelMarketplace");

module.exports = async function (deployer, network, accounts) {
    // Развертывание контракта
    await deployer.deploy(AIModelMarketplace);

    // Получение экземпляра развернутого контракта
    const marketplace = await AIModelMarketplace.deployed();

    // Выводим адрес контракта и владельца на консоль
    console.log("AIModelMarketplace contract deployed at:", marketplace.address);
    console.log("Contract owner is:", accounts[0]);

    // (Опционально) можно добавить логику для выполнения начальных операций, таких как добавление моделей
    // Пример добавления модели
    // await marketplace.listModel("AI Model 1", "Description of AI Model 1", web3.utils.toWei('0.1', 'ether'), { from: accounts[0] });
};