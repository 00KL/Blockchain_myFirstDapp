// 1. Declaração de variável global para armazenar a instância web3
let PetContract;

// 2. Configuração do endereço do contrato e ABI
const Pet_Contract_Address = "0x10D412ad62Ff7F56FB409cEc64fadc0A0a2A2430";
const Pet_Contract_ABI = [
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "newPetName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "newPetOwner",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "newPetAge",
                    "type": "string"
                }
            ],
            "name": "setPet",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPet",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "petAge",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "petName",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "petOwner",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

/* 3. Prompt user to sign in to MetaMask */
const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    const signer = provider.getSigner(accounts[0]);

    /* 3.1 Criação da instância do contrato inteligente de Pet */
    PetContract = new ethers.Contract(
      Pet_Contract_Address,
      Pet_Contract_ABI,
      signer
    );
  });
});

// 4. Criando variáveis para o re-uso dos elementos DOM
const petFormSection = document.querySelector(".pet-form-section");
const showPetFormBtn = document.querySelector(".show-pet-form-btn");
const petSection = document.querySelector(".pet-detail-section");
const setPetButton = document.querySelector("#set-new-pet");
const refreshBtn = document.querySelector(".refresh-pet-details-btn");

/* 5. Função para setar os detalhes do Pet */
const setNewPet = () => {
  // atualizar botão de valor
  setPetButton.value = "Setting Pet...";

  /* 5.1 Pega os inputs do formulário pet */
  const petNameInput = document.querySelector("#pet-name");
  const petOwnerInput = document.querySelector("#pet-owner");
  const petAgeInput = document.querySelector("#pet-age");

  // 5.2 pegando valores dos inputs
  petName = petNameInput.value;
  petOwner = petOwnerInput.value;
  petAge = petAgeInput.value;

  /* 5.3 Seta os detalhes do pet no contrato inteligente */
  PetContract.setPet(petName, petOwner, petAge)
    .then(() => {
      // valor do botão de atualização
      setPetButton.value = "Pet Set...";

      /* 5.4 Limpa o formuário */
      petNameInput.value = "";
      petOwnerInput.value = "";
      petAgeInput.value = "";

      // valor do botão de atualização
      setPetButton.value = "Set Pet";

      /* 5.5 Seta os detalhes do pet no contrato inteligente */
      getCurrentPet();
    })
    .catch((err) => {
      // Se um erro ocorrer , mostra a mensagem de erro
      setPetButton.value = "Set Pet";
      alert("Error setting pet details" + err.message);
    });
};

/* Função para setar detalhes do pet quando clicar no botão */
setPetButton.addEventListener("click", setNewPet);

/* 6. função para pegar os detalhes do pet */
const getCurrentPet = async () => {
    setPetButton.value = "Getting Pet...";
  
    /* 6.1 Pega detalhes do pet no contrato inteligente */
    const pet = await PetContract.getPet();
  
    /* 6.2 Mostra a seção de detalhes do pet
  
     6.2.1 Esconde o formulário de pet no DOM */
    petSection.style.display = "block";
    petFormSection.style.display = "none";
  
    /* 6.3 Pet é um array com 3 strings [petName, petOwner, petAge] */
    const petName = pet[0];
    const petOwner = pet[1];
    const petAge = pet[2];
  
    /* 6.4 Mostra os detalhes do pet no DOM */
    document.querySelector(".pet-detail-name").innerText = petName;
    document.querySelector(".pet-detail-owner").innerText = petOwner;
    document.querySelector(".pet-detail-age").innerText = petAge;
  };

/* 7. Função para mostrar o formulário pet quando se clica no botão */
showPetFormBtn.addEventListener("click", () => {
  petSection.style.display = "none";
  petFormSection.style.display = "block";
  setPetButton.value = "Submit";
});

/* 8. Função para atualizar os detalhes do pet */
refreshBtn.addEventListener("click", (e) => {
  e.target.innerText = "Refreshing...";
  getCurrentPet().then(() => {
    e.target.innerText = "Refreshed";
    setTimeout(() => {
      e.target.innerText = "Refresh";
    }, 2000);
  });
});