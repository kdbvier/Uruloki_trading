import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
export const getWeb3Modal = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: '053b5c8b416b4e73b29954bbbd30bac9'
        }
      }
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  
    return web3Modal;
  };

  export const getConnectedAddress = async () => {
    // Get wallet address connected
    try {
    if (typeof window !== 'undefined') {
        const web3Mo = await getWeb3Modal();
        const provider = await web3Mo.connect();
        const signer = new ethers.providers.Web3Provider(provider).getSigner();
        const address = await signer.getAddress();
        console.log("Connected address:", address);
        if (address) {
          return address;
        } else {
          return '';
        }
      }
      return "";
    } catch(err) {
      return ''
    }
  };

