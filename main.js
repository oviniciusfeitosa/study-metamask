const disconectedContent = document.querySelectorAll(".disconected");
const connectedContent = document.querySelectorAll(".connected");
const showAccount = document.querySelector(".showAccount");
const showNetworkEnabled = document.querySelector(".showNetworkEnabled");
const connectBox = document.getElementById("connectBox");

async function connectEthereumNetwork() {
  account = await getAccount();

  showConnectedContents(account);
}

async function getAccount() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];

  return account;
}

function showConnectedContents(account) {
  connectedContent.forEach((element) => (element.style.display = "none"));
  disconectedContent.forEach((element) => (element.style.display = "block"));
  if (account) {
    connectedContent.forEach((element) => (element.style.display = "block"));
    disconectedContent.forEach((element) => (element.style.display = "none"));
  }
  showAccount.innerHTML = account;
}

window.onload = async function () {
  showNetworkEnabled.innerHTML = "No";
  if (typeof window.ethereum !== "undefined") {
    showNetworkEnabled.innerHTML = "yes!";
  }
  const account = await getAccount();
  showConnectedContents(account);
};
