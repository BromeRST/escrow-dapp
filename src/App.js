import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/Escrow.json";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allContracts, setAllContracts] = useState([]);
  const [arb, setArb] = useState("");
  const [ben, setBen] = useState("");
  const [am, setAm] = useState("");

  const contractAddress = "0xEe826157f4AD84c4E9e3b0E01b803e8FcaCc686f";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllContracts();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    const { ethereum } = window;
    try {

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllContracts();
    } catch (error) {
      console.log(error)
    }
  }

  const addNewContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const escrowContract = new ethers.Contract(contractAddress, contractABI, signer);


        const contractTxn = await escrowContract.writeNewContract(arb, ben, {value: ethers.utils.parseEther(am), gasLimit: 300000 })
        console.log("Mining...", contractTxn.hash);

        await contractTxn.wait();
        console.log("Mined -- ", contractTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllContracts = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const escrowContract = new ethers.Contract(contractAddress, contractABI, signer);
        const contracts = await escrowContract.getAllContracts();

        const contractsCleaned = contracts.map(c => {
          return {
            arbiterAddress: c.Arbiter,
            beneficiaryAddress: c.Beneficiary,
            depositorAddress: c.Depositor,
            timestamp: new Date(c.timestamp * 1000),
            amount: c.Amount,
            arbiterApproved: c.ArbiterApproved,
            escrowApproved: c.IsApproved,
            ewscowDismissed: c.Dismissed,
          };
        });

        setAllContracts(contractsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const approveEscrow = async (i) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const escrowContract = new ethers.Contract(contractAddress, contractABI, signer);

        const approveTxn = await escrowContract.approve(i)
        console.log("Mining...", approveTxn.hash);

        await approveTxn.wait();
        console.log("Mined -- ", approveTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const approveArbiterFromBeneficiary = async (i) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const escrowContract = new ethers.Contract(contractAddress, contractABI, signer);


        const approveTxn = await escrowContract.approveArbiter(i)
        console.log("Mining...", approveTxn.hash);

        await approveTxn.wait();
        console.log("Mined -- ", approveTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const dismissThisEscrow = async (i) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const escrowContract = new ethers.Contract(contractAddress, contractABI, signer);


        const approveTxn = await escrowContract.dismissEscrow(i)
        console.log("Mining...", approveTxn.hash);

        await approveTxn.wait();
        console.log("Mined -- ", approveTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteEscrow = async (i) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const escrowContract = new ethers.Contract(contractAddress, contractABI, signer);

        const approveTxn = await escrowContract.deleteContract(i)
        console.log("Mining...", approveTxn.hash);

        await approveTxn.wait();
        console.log("Mined -- ", approveTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let escrowContract;
  
    const onNewContract = (arbiter, beneficiary, depositor, times, amountEl, arbAppr, isAppr, isDism) => {
      console.log("NewContract", arbiter, beneficiary, depositor, times, amountEl, arbAppr, isAppr, isDism);
      setAllContracts(prevState => [
        ...prevState,
        {
          arbiterAddress: arbiter,
          beneficiaryAddress: beneficiary,
          depositorAddress: depositor,
          timestamp: new Date(times * 1000),
          amount: amountEl,
          arbiterApproved: arbAppr,
          escrowApproved: isAppr,
          ewscowDismissed: isDism,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      escrowContract = new ethers.Contract(contractAddress, contractABI, signer);
      escrowContract.on("NewContract", onNewContract);
    }
  
    return () => {
      if (escrowContract) {
        escrowContract.off("NewContract", onNewContract);
      }
    };
  }, []);

  function handleArbiterChange(e) {
    const {value} = e.target
    setArb(value)
  }

  function handleBeneficiaryChange(e) {
    const {value} = e.target
    setBen(value)
  }

  function handleAmountChange(e) {
    const {value} = e.target
    setAm(value)
  }

  function deployButtonClick() {
    addNewContract();
    setArb("");
    setBen("");
    setAm("");
  }

  function deleteButtonClick(e) {
    const {id} = e.target;
    deleteEscrow(id);
  }

  function approveButtonClick(e) {
    const {id} = e.target
    approveEscrow(id);
  }

  function approveArbiterButtonClick(e) {
    const {id} = e.target
    approveArbiterFromBeneficiary(id);
  }

  function dismissButtonClick(e) {
    const {id} = e.target
    dismissThisEscrow(id);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="flexi">
      <div className="contract">
        {!currentAccount && (
            <div className="button" onClick={connectWallet}>
              Connect Wallet
            </div>
        )}
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" value={arb} onChange={handleArbiterChange}/>
        </label>

        <label>
          Beneficiary Address
          <input type="text" value={ben} onChange={handleBeneficiaryChange}/>
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" value={am} onChange={handleAmountChange}/>
        </label>

        <div className="button" onClick={deployButtonClick}>
          Deploy
        </div>
    </div>

    <div className="existing-contracts">
      <h1> Existing Contracts </h1>

      <div id="container">
          {allContracts.length > 0 && 
            allContracts.map((c, i) => (
              <div key={i} className="existing-contract">
                <ul className="fields">
                <li>
                    <div> Depositor </div>
                    <div> {c.depositorAddress} </div>
                  </li>
                  <li>
                    <div> Arbiter </div>
                    <div> {c.arbiterAddress} </div>
                  </li>
                  <li>
                    <div> Beneficiary </div>
                    <div> {c.beneficiaryAddress} </div>
                  </li>
                  <li>
                    <div> Timestamp </div>
                    <div> {c.timestamp} </div>
                  </li>
                  <li>
                    <div> Value </div>
                    <div> {ethers.utils.formatUnits(c.amount)} </div>
                  </li>
                  <button className="button btn" id={i} onClick={approveArbiterButtonClick} disabled={c.arbiterApproved || c.escrowDismissed}>
                  {c.arbiterApproved ? "Arbiter has been approved" : "Arbiter's approve from Beneficiary"}
                  </button>
                  <button className="button btn" id={i} onClick={approveButtonClick} disabled={c.escrowApproved || c.escrowDismissed}>
                    {c.escrowApproved ? "Escrow approved" : "Approve"}
                  </button>
                  <button className="button btn" id={i} onClick={dismissButtonClick} disabled={c.escrowApproved || c.escrowDismissed}>
                    {c.escrowDismissed ? "Escrow had been dismissed" : "Dismiss this escrow"}
                  </button>
                  <button className="button btn" id={i} onClick={deleteButtonClick} disabled={c.Arbiter === "0x0000000000000000000000000000000000000000"}>
                    {c.Arbiter === "0x0000000000000000000000000000000000000000" ? "Escrow had been deleted" : "Delete this escrow"}
                  </button>
                </ul>
            </div>
            ))
          }
      </div>
    </div>
  </div>
  )

}

export default App;