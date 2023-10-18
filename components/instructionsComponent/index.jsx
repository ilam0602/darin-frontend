import styles from "./instructionsComponent.module.css";
import { useContractRead, useContractWrite,useAccount } from 'wagmi';
import { BigNumber,parseEther} from 'ethers';
import contractJson from '../../json/Pass.json';
import React, { useState, useEffect } from 'react';


// Utility function for checking if the customer has an NFT from the CURRENT collection
// Utility function for getting the pass ID (token) that the user owns

// Function for "Registering" only if the user is a holder of the CURRENT NFT
// Function for displaying NFT possession (display expiration date)

// Use the Kit Component for allowing user to log in - Done
/** <ConnectKitButton /> */

// Buy button on Mint Page

// Renewal Page

export default function InstructionsComponent() {
  const [isMounted, setIsMounted] = useState(false);
  const userAddress = useAccount();
  // const contractAddress = "0xae906ed692429c064eD677Bb170640863DF5d88C"
  const contractAddress = "0x2FaaceE3cC5f856FC0b297A7497875B67D320669"
  const deadAddress = "0x000000000000000000000000000000000000dEaD"

  const { data: balanceData } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'balanceOf',
    args: userAddress.address ? [userAddress.address, 0]: [deadAddress,0],
  });

  const { data: prevCol } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'ownsPreviousCollectionNFT',
    args: userAddress.address ? [userAddress.address]: [deadAddress],
  });
  const { data: expPass } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'isPassExpired',
    args: userAddress.address ? [userAddress.address,0] : [deadAddress,0],
  });


  const { write: purchasePass } = useContractWrite({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'purchasePass',
    args: [0],
    onError(error) {
      console.log('Error', error)
    },
  });


  const handleSubscribeClick = async () => {
    try {
      await purchasePass({ value: sendEtherValue.toString() });
    } catch (error) {
      console.error("Error while trying to purchase pass:", error);
    }
  };
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  
  
 

  let displayBalance = isMounted ? (userAddress.address && balanceData ? balanceData.toString() : "Wallet Not Connected") : "Loading..."; // Default text
  let displayPrevCol = isMounted ? (userAddress.address && (prevCol!== undefined) ?prevCol.toString():"Wallet Not Connected" ): "Loading..."; // Default text
  let displayExpPass = isMounted ? (userAddress.address && (expPass!== undefined )? expPass.toString():"Wallet Not Connected") : "Loading..."; // Default text


  const sendEtherValue = prevCol ? parseEther("0.00005"):parseEther("0.0001") ;  // Converts 0.01 ETH to its Wei representation


  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1> balance: {displayBalance} </h1>
          <h1> owns prev collection: {displayPrevCol} </h1>
          <h1> pass expired: {displayExpPass} </h1>
        </div>
      </header>
      <div>
             <button onClick={handleSubscribeClick}>Mint</button>

      </div>
    </div>
  );
}


