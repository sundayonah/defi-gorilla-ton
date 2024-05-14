import React, { useState } from "react";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import toast from "react-hot-toast";
import axios from "axios";
// import client from "@/utils/db";

interface AddressProps {}

const Main: React.FC<AddressProps> = () => {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sender and recipient addresses
  const senderAddress = "0QASAh83BCbEvpZEsKFcw-STLK7Zw2jsO1MiXYaVWyAm8aaQ";
  const recipientAddress = "0QAiBWJkUUfiAtefGS2x3QnBLGdzvK2uxprETjAAoHA6UPK_";

  
  const transferToncoin = async () => {
    try {
      // Attempt to connect the wallet
     //   await tonConnectUI.connectWallet();
      
      // Check if the wallet is connected
      if (!tonConnectUI.connected) {
        toast.error('Wallet connection failed');
      }

     // Convert the input amount to nanotons
    const amountInNanotons = parseFloat(amount) * 1000000000;
    // Validate the amount between 0.1 SOL and 5 SOL
    const minAmount = 0.1 * 1000000000; // 0.1 SOL in lamports
    const maxAmount = 5 * 1000000000; // 5 SOL in lamports

    
    if (amountInNanotons < minAmount || amountInNanotons > maxAmount) {
      toast.error("Amount must be between 0.1 TON and 5 TON.");
      return;
    }
    setIsLoading(true);

      // Now that the wallet is connected, proceed to send the transactions
      const transaction = {
        messages: [
          {
            address: recipientAddress,
            amount: amountInNanotons.toString(),
            sender: senderAddress,
          }
        ],
        validUntil: Math.floor(Date.now() / 1000) + 60 * 60, // Example: valid for 1 hour from now
      };
      console.log(transaction)

      await tonConnectUI.sendTransaction(transaction);

       // Make POST request to API route
   const response =  await axios.post('/api/db', {
      // Send transaction data to be inserted into MongoDB
      amount: amountInNanotons,
      userAddress: userFriendlyAddress,
      timestamp: new Date().toISOString(),
    });

    console.log(response)
      setAmount('')
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending transactions:', error);
      setIsLoading(false);
    }
  };
  



  return (
    <div className="container w-full sm:w-[60%] md:w-[60%] lg:w-[30%] mx-auto mt-48 px-4">
      <div className="flex flex-col items-center justify-center space-y-4 p-3 rounded-md shadow-xl border border-gray-100">

        <h2 className="text-xl font-bold text-[#5c3b12]">Invest TON</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in nanotons"
          className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
        />

        <button
          onClick={() =>
            transferToncoin()
          }
          disabled={isLoading}
          className={`w-full ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed py-2 px-4"
              : "bg-[#5c3b12] hover:bg-[#5f4627] text-white font-bold py-2 px-4 rounded"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            "Deposit"
          )}
        </button>
      </div>
    </div>
  );
};

export default Main;
