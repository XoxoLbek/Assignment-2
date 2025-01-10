// Подключаем библиотеку ethers
const { ethers } = require("ethers");

// Адрес и ABI вашего контракта
const contractAddress = "0x3e9655cf727cc60bFd764f91CbBdc7C1196F9ed4"; // Замените на адрес вашего контракта
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "ModelListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "ModelPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "rater",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "rating",
          "type": "uint8"
        }
      ],
      "name": "ModelRated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "models",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfRatings",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
];

// Функция для подключения к MetaMask
async function connectMetaMask() {
    // Проверка наличия MetaMask
    if (typeof window.ethereum !== "undefined") {
        // Запрашиваем доступ к кошельку
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("MetaMask подключен!");
            initializeContract();
        } catch (error) {
            console.error("Ошибка подключения к MetaMask:", error);
        }
    } else {
        alert("MetaMask не установлен!");
    }
}

// Функция для инициализации контракта после подключения к MetaMask
async function initializeContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Создаем экземпляр контракта с помощью Ethers.js
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Пример вызова метода контракта (получение информации о модели)
    const modelId = 0; // Пример ID модели
    const modelDetails = await contract.getModelDetails(modelId);
    console.log("Детали модели:", modelDetails);
}

// Вызов функции подключения при загрузке страницы
connectMetaMask();

// Пример функции для отправки транзакции на блокчейн
async function listModel(name, description, price) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.listModel(name, description, price);
    console.log("Транзакция отправлена:", tx);
    await tx.wait();
    console.log("Транзакция подтверждена!");
}
