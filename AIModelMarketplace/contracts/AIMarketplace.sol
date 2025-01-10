// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {

    struct Model {
        string name;
        string description;
        uint256 price;
        address creator;
        uint256 totalRating;
        uint256 numberOfRatings;
    }

    // Массив для хранения моделей
    Model[] public models;

    // Маппинг для хранения оценок пользователей
    mapping(uint256 => mapping(address => uint8)) public ratings;

    // Событие при добавлении новой модели
    event ModelListed(uint256 modelId, string name, string description, uint256 price, address creator);

    // Событие при покупке модели
    event ModelPurchased(uint256 modelId, address buyer, uint256 price);

    // Событие при оценке модели
    event ModelRated(uint256 modelId, address rater, uint8 rating);

    // Событие при выводе средств
    event FundsWithdrawn(address recipient, uint256 amount);

    // Владелец контракта
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Модификатор для проверки владельца контракта
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    // Модификатор для проверки, что модель была куплена
    modifier onlyPurchased(uint256 modelId) {
        require(ratings[modelId][msg.sender] != 0, "You must purchase the model before rating");
        _;
    }

    // Функция для добавления новой модели
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than 0");

        // Создание новой модели
        models.push(Model({
            name: name,
            description: description,
            price: price,
            creator: msg.sender,
            totalRating: 0,
            numberOfRatings: 0
        }));

        uint256 modelId = models.length - 1; // Получаем ID новой модели
        emit ModelListed(modelId, name, description, price, msg.sender);
    }

    // Функция для покупки модели
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Invalid model ID");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect price sent");

        // Перевод средств создателю модели
        payable(model.creator).transfer(msg.value);

        emit ModelPurchased(modelId, msg.sender, model.price);
    }

    // Функция для оценки купленной модели
    function rateModel(uint256 modelId, uint8 rating) public onlyPurchased(modelId) {
        require(modelId < models.length, "Invalid model ID");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Model storage model = models[modelId];

        // Если пользователь еще не поставил оценку, записываем новую
        require(ratings[modelId][msg.sender] == 0, "You have already rated this model");

        ratings[modelId][msg.sender] = rating;

        // Обновляем рейтинг модели
        model.totalRating += rating;
        model.numberOfRatings++;

        emit ModelRated(modelId, msg.sender, rating);
    }

    // Функция для вывода средств владельцем контракта
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner).transfer(balance);
        emit FundsWithdrawn(owner, balance);
    }

    // Функция для получения информации о модели
    function getModelDetails(uint256 modelId) public view returns (string memory name, string memory description, uint256 price, address creator, uint256 averageRating) {
        require(modelId < models.length, "Invalid model ID");

        Model storage model = models[modelId];

        uint256 avgRating = model.numberOfRatings == 0 ? 0 : model.totalRating / model.numberOfRatings;

        return (model.name, model.description, model.price, model.creator, avgRating);
    }

    // Функция для получения количества моделей
    function getModelCount() public view returns (uint256) {
        return models.length;
    }
}