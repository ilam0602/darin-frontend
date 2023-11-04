import styles from "./instructionsComponent.module.css";
import { useContractRead, useContractWrite,useAccount } from 'wagmi';
import { BigNumber,parseEther,formatEther} from 'ethers';
import contractJson from '../../json/Pass.json';
import React, { useState, useEffect } from 'react';

import { ConnectKitButton } from "connectkit";

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
  const contractAddress = "0x5aB905fe512e3ee380B5FfaF42DE98F4167ca346"
  const deadAddress = "0x000000000000000000000000000000000000dEaD"
  const [currQty,setCurrQty] = useState(1)

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
  const { data: ownerAddress } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'owner',
  });

  const { data: supplyData } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'balanceOf',
    args: ownerAddress ? [ownerAddress, 0]: [deadAddress,0],
  });


  const { write: purchasePass } = useContractWrite({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'purchasePass',
    args: [0,currQty],
    onError(error) {
      console.log('Error', error)
    },
  });


  const handleSubscribeClick = async () => {
    try {
      // let val = sendEtherValue.toString()
      let val = parseEther((formatEther(sendEtherValue) * currQty).toString())
      await purchasePass({ value:  val});
    } catch (error) {
      console.error("Error while trying to purchase pass:", error);
    }
  };

  const handleInc = async () => {
    setCurrQty(currQty + 1)

  }
  const handleDec = async () => {
    if(currQty > 1){setCurrQty(currQty - 1)}

  }
  
  useEffect(() => {
    setIsMounted(true);
    console.log(ownerAddress);
    console.log(supplyData)
  }, []);

  
  
 

  let displayBalance = isMounted ? (userAddress.address && (balanceData !== undefined) ? balanceData.toString() : "Wallet Not Connected") : "Loading..."; // Default text
  let displaySupply = isMounted ? (ownerAddress && (supplyData !== undefined) ? supplyData.toString() : "Wallet Not Connected") : "Loading..."; // Default text
  let displayPrevCol = isMounted ? (userAddress.address && (prevCol!== undefined) ? prevCol.toString():"Wallet Not Connected" ) : "Loading..."; // Default text
  let displayExpPass = isMounted ? (userAddress.address && (expPass!== undefined )? expPass.toString():"Wallet Not Connected") : "Loading..."; // Default text


  const sendEtherValue = prevCol ? parseEther("0.00005"):parseEther("0.0001") ;  // Converts 0.01 ETH to its Wei representation


  return (
    <div className={styles.container}>
    {(!userAddress.address && isMounted) ?
    <ConnectKitButton/> :
    <div>
      <header className={styles.header_container}>
        <div className={styles.header}>
          {/* <hr></hr>
          <p> Your Balance: {displayBalance} </p> 
          <hr></hr>
          <p> Supply Left: {displaySupply} </p>  */}
          <hr></hr>
          <p> Balance: {formatEther(sendEtherValue)} Eth</p> 
          <hr></hr>
          <p> Amount: </p> {/* Changed to <p> */}
          <button onClick={handleDec}>-</button>
          <p>{currQty}</p>
          <button onClick={handleInc}>+</button>
          {/* <hr></hr>
          <p> Pass Expired: {displayExpPass} </p> */}
          <hr></hr>
          <p>Total: {(currQty * formatEther(sendEtherValue)).toFixed(5)} Eth</p>
        </div>
      </header>
      <hr></hr>
      <div>
        <button onClick={handleSubscribeClick}>Mint Now</button>
      </div>
      <hr></hr>
      <ConnectKitButton/>
      <hr></hr>
    </div>
    }
  </div> 
  );
}


