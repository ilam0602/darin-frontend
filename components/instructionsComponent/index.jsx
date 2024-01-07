import styles from "./instructionsComponent.module.css";
import { useContractRead, useContractWrite,useAccount } from 'wagmi';
import { BigNumber,parseEther,formatEther} from 'ethers';
import contractJson from '../../json/Pass.json';
import React, { useState, useEffect } from 'react';
import {Button} from 'grommet';

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
  const contractAddress = "0xF18AD1cdC6632cC01ac06400741797eAb615b3C1"
  const deadAddress = "0x000000000000000000000000000000000000dEaD"
  const [currQty,setCurrQty] = useState(1)
  const [prevPrice,setPrevPrice] = useState(" ")
  const [debouncedQty, setDebouncedQty] = useState(currQty);


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
  
  const { data: contractPrice } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'getPassPrice',
    args: userAddress.address ? [0,debouncedQty] : [0,0],
  });

  const { data: contractPriceDisplay } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'getPassPrice',
    args: userAddress.address ? [0,1] : [0,0],
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
      let val = parseEther(displayPrice).toString()
      await purchasePass({ value:  val});
    } catch (error) {
      console.error("Error while trying to purchase pass:", error);
    }
  };

  const handleInc = async () => {
    // if(currQty + 1 <= supplyData)
    setCurrQty(currQty + 1)

  }
  const handleDec = async () => {
    if(currQty > 1){
      setCurrQty(currQty - 1)
    }
  }
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQty(currQty);
    }, 500); // 500 milliseconds delay
  
    return () => {
      clearTimeout(handler);
    };
  }, [currQty]);

  useEffect(() =>{
    if(contractPrice){
      setPrevPrice(contractPrice);
    }
  },[contractPrice]);

  
 
  const sendEtherValue = (isMounted && prevCol) ? parseEther("0.00005"):parseEther("0.0001") ;  // Converts 0.01 ETH to its Wei representation
  const displayPrice = ((isMounted && contractPrice) ? formatEther(contractPrice) : formatEther(prevPrice));
  const displayPriceDisplay = ((isMounted && contractPriceDisplay) ? formatEther(contractPriceDisplay) : "");

  return (
    <div className={styles.container}>
      {(isMounted) ?
      <div>
        <header className={styles.header_container}>
          <div className={styles.header}>
            <h1>Mint NFT</h1>
            <img src = "https://cdn.discordapp.com/attachments/1159221019945472142/1178468024089591919/FoF_Card_11_24_23_5.gif?ex=657f7b5f&is=656d065f&hm=706cf1f6a02d6fba19850030edf4654d102b58294400f67450fbe89ce1510388&"  alt="NFT Example" className={styles.mintImage} />
            <div className = {styles.balance_container}>
              <div className = {styles.field_title}>
                  <p> PRICE </p> 
              </div>
              <div className = {styles.field_amount}>
                  <p> {displayPriceDisplay} ETH</p> 
              </div>
            </div>
            <div className = {styles.balance_container}>
              <div className = {styles.field_title}>
                  <p> REMAINING </p> 
              </div>
              <div className = {styles.field_amount}>
                  <p> {supplyData.toString()} / 100</p> 
              </div>
            </div>
            <div className = {styles.amount_container}>
              <div className = {styles.field_title}>
                <p> MINT </p> {/* Changed to <p> */}
              </div>
              <div className = {styles.field_amount}>
                <Button primary  label="-" color="white" style={{height: "20px", width: "50px", padding:"0px 0px 24px 0px", paddingBottom:"24px"}} onClick={handleDec}/>
                <p className={styles.amount_tag}>{currQty}</p>
                <Button primary label="+" color="white" style={{height: "20px", width: "50px", padding:"0px 0px 24px 0px", paddingBottom:"24px"}} onClick={handleInc}/>
              </div>
            </div>
            <div className = {styles.total_container}>
              <div className = {styles.field_title}>
                <p>TOTAL </p>
              </div>
              <div className = {styles.field_amount}>
                <p>{displayPrice} ETH</p>
              </div>
            </div>
          </div>
          {!userAddress.address ? 
          <div>
          <ConnectKitButton/> 
          <span style={{margin:"15px"}}></span> 
          </div>:
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: "column"}}>
            <Button primary label="Mint Now" color="white" style={{height: "35px", width: "300px", padding:"0px 0px", paddingTop:"0px", fontWeight:"bold", fontSize:"14px", color:"black"}} onClick={handleSubscribeClick}/>
            <span style={{margin:"15px"}}></span>
            <ConnectKitButton />
          </div>
          }
        </header>
      </div>
      :
      <div>
        <div> Loading...</div>
      </div>
}
      
    </div> 
  );
}


