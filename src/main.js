const disconectedContent = document.querySelectorAll(".disconected");
const connectedContent = document.querySelectorAll(".connected");
const showAccount = document.querySelector(".showAccount");
const showNetworkEnabled = document.querySelector(".showNetworkEnabled");
const connectBox = document.getElementById("connectBox");
const personalSign = document.getElementById("personalSign");
const personalSignVerify = document.getElementById("personalSignVerify");
const personalSignResult = document.getElementById("personalSignResult");
const personalSignVerifySigUtilResult = document.getElementById(
  "personalSignVerifySigUtilResult"
);
const connectEthereumNetwork = document.getElementById(
  "connectEthereumNetwork"
);

import { recoverPersonalSignature } from "eth-sig-util";

// (window as any).global = window;
// window.Buffer = window.Buffer || require('buffer').Buffer;
let accounts = [];

const getAccounts = async () => {
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
};

const showConnectedContents = () => {
  connectedContent.forEach((element) => (element.style.display = "none"));
  disconectedContent.forEach((element) => (element.style.display = "block"));
  console.log(accounts);
  if (accounts.length > 0) {
    connectedContent.forEach((element) => (element.style.display = "block"));
    disconectedContent.forEach((element) => (element.style.display = "none"));
  }
  showAccount.innerHTML = accounts;
};

connectEthereumNetwork.onclick = async () => {
  await getAccounts();

  showConnectedContents();
};

const signMessage = "Permitir acesso a aplicação?";
personalSign.onclick = async () => {
  try {
    const from = accounts[0];
    const msg = `0x${Buffer.from(signMessage, "utf8").toString("hex")}`;
    const sign = await ethereum.request({
      method: "personal_sign",
      params: [msg, from, "Example password"],
    });
    personalSignResult.innerHTML = sign;
    personalSignVerify.disabled = false;
  } catch (err) {
    console.error(err);
    personalSignResult.innerHTML = `Error: ${err.message}`;
  }
};

personalSignVerify.onclick = async () => {
  try {
    const from = accounts[0];
    const msg = `0x${Buffer.from(signMessage, "utf8").toString("hex")}`;
    const sign = personalSignResult.innerHTML;
    const recoveredAddr = recoverPersonalSignature({
      data: msg,
      sig: sign,
    });
    if (recoveredAddr === from) {
      console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
      personalSignVerifySigUtilResult.innerHTML = recoveredAddr;
    } else {
      console.log(
        `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`
      );
      console.log(`Failed comparing ${recoveredAddr} to ${from}`);
    }
    const ecRecoverAddr = await ethereum.request({
      method: "personal_ecRecover",
      params: [msg, sign],
    });
    if (ecRecoverAddr === from) {
      console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
      // personalSignVerifyECRecoverResult.innerHTML = ecRecoverAddr;
      personalSignVerifySigUtilResult.innerHTML = ecRecoverAddr;
    } else {
      console.log(
        `Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`
      );
    }
  } catch (err) {
    console.error(err);
    personalSignVerifySigUtilResult.innerHTML = `Error: ${err.message}`;
    // personalSignVerifySigUtilResult.innerHTML = `Error: ${err.message}`;
    // personalSignVerifyECRecoverResult.innerHTML = `Error: ${err.message}`;
  }
};

window.onload = async function () {
  showNetworkEnabled.innerHTML = "No";
  if (typeof window.ethereum !== "undefined") {
    showNetworkEnabled.innerHTML = "yes!";
  }
  await getAccounts();
  showConnectedContents();
};
