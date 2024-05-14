import React, { useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

const SampleComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();


      // Sender and recipient addresses
  const senderAddress = "0QASAh83BCbEvpZEsKFcw-STLK7Zw2jsO1MiXYaVWyAm8aaQ";
  const recipientAddress = "0QAiBWJkUUfiAtefGS2x3QnBLGdzvK2uxprETjAAoHA6UPK_";


// UQASAh83BCbEvpZEsKFcw-STLK7Zw2jsO1MiXYaVWyAm8R0a mainnet
// 0QASAh83BCbEvpZEsKFcw-STLK7Zw2jsO1MiXYaVWyAm8aaQ testnet


  const connectWalletAndSendTransaction = async () => {
    try {
      // Attempt to connect the wallet
    //   await tonConnectUI.connectWallet();
      
      // Check if the wallet is connected
      if (!tonConnectUI.connected) {
        throw new Error('Wallet connection failed');
      }

      // Now that the wallet is connected, proceed to send the transaction
      const transaction = {
        messages: [
          {
            address: recipientAddress,
            amount: "100000000", // Two TON in nanotons
            sender: userFriendlyAddress,
          }
        ],
        validUntil: Math.floor(Date.now() / 1000) + 60 * 60, // Example: valid for 1 hour from now
      };
      console.log(transaction)

      setIsLoading(true);
      await tonConnectUI.sendTransaction(transaction);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending transaction:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={connectWalletAndSendTransaction}
        className={`w-full ${
          isLoading
           ? "bg-gray-400 cursor-not-allowed py-2 px-4"
            : "bg-[#5c3b12] hover:bg-[#5f4627] text-white font-bold py-2 px-4 rounded"
        }`}
      >
        {isLoading? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          "Send transaction"
        )}
      </button>
    </div>
  );
};

export default SampleComponent;
