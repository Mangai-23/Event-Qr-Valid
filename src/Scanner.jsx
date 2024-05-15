import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Web3 from 'web3';
import './Scanner.css';
import axios from 'axios';// Import your logo image here
import { IoCloseCircle } from "react-icons/io5";
import { IoQrCodeSharp } from "react-icons/io5";

function Scanner() {
  const [scannedqr, setScannerQr] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const[EveDetails, setEveDetails] = useState([]);
  const[personDetails, setPersonDetails] = useState({
    bool: true,
  });
  const [error, setError] = useState(null); // State for error handling
  const [btn, setBtn] = useState({
    disabled: true,
    text: "Please Connect to MetaMask"
  });
  const[ValidQr,setValidQr] =useState(false);
  const YOUR_CONTRACT_ADDRESS = "0x6a28A688B688F16A3CD5288e89165D702Bfc7CAa";
  const YourContractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_ticketPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_totalTickets",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "eveid",
                    "type": "string"
                }
            ],
            "name": "createEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "eventId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                }
            ],
            "name": "EventCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_eventId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "part",
                    "type": "string"
                }
            ],
            "name": "participantRegister",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_eventId",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_numTickets",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "p",
                    "type": "uint256"
                }
            ],
            "name": "registerPay",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "eve",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "eventid",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "events",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "location",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "ticketPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalTickets",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "ticketsSold",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "eventid",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "isActive",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_eventId",
                    "type": "string"
                }
            ],
            "name": "getEventDetails",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "location",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "ticketPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalTickets",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "ticketsSold",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isActive",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "eventid",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "part",
                    "type": "string"
                }
            ],
            "name": "getParticipantDetails",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "participantAddress",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "eventId",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "participants",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "participantAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "eventId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "participantId",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalEvents",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalParticipants",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
  useEffect(() => {
    const initWeb3 = async () => {
        if(!connected) {
            setBtn({disabled: false , text: "Please Connect to MetaMask"});
        }
        else{
            setBtn({disabled: true ,text: "Connected to MetaMask"});
        }
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setConnected(true);
          }
        } catch (error) {
          console.error("Failed to initialize web3:", error);
          setError("Failed to initialize web3");
        }
      } else {
        setError("MetaMask not installed");
      }
    };

    initWeb3();

  }, []);

  const handleConnectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAccount = accounts[0];
      setAccount(userAccount);
      setBtn({ disabled: true });
      setConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError("Failed to connect wallet");
    }
  };
  const handleCloseModal = () => {
    setScannerQr("");
    setShowModal(false);
};
  async function checkValid(userhash) {
    try {
      if (!web3) {
        throw new Error('Web3 not initialized');
      }
  
      const contract = new web3.eth.Contract(YourContractABI, YOUR_CONTRACT_ADDRESS);
      userhash = userhash.replace(/"/g, "");
      console.log("Checking validity for QR code:", userhash); // Log the QR code being checked
      const result = await contract.methods.getParticipantDetails(userhash).call();
      console.log("Participant details:", result);
      if (!result || !result.eventId) {
        setShowModal(true);
        setValidQr(false);
        // alert("Not a valid user");
        return; // Exit the function
      }
      const r = await axios.post("http://localhost:5000/eventfind",{eventid:result.eventId});
      console.log(r.data);
      setEveDetails(r.data);

      const q = await axios.post("http://localhost:5000/personfind",{participantid:result.participantAddress});
      console.log(q.data);
      setPersonDetails(q.data);
      const event = await contract.methods.getEventDetails(result.eventId).call();
      console.log("Event details:", event);
      console.log("Before Valid",personDetails.bool ,typeof personDetails.bool);
      if(personDetails.bool === "true"){
        console.log("After Valid....",personDetails.bool ,typeof personDetails.bool);
      const v = await axios.post("http://localhost:5000/valid",{participantid:result.participantAddress,eventid:result.eventId});
      setPersonDetails(v.data);
      console.log("After Valid",v.data);
        setValidQr(true);
        setEventDetails(event);
        setShowModal(true);
      }
       // Log the event details retrieved from the contract
      setScannerQr("");
      console.log(personDetails.bool);
      if(personDetails.bool==="false"){
        setShowModal(true);
        setValidQr(false);
      }
      console.log(showModal);
    } catch (error) {
      console.error("Failed to check validity:", error);
      setError("Failed to check validity");
    }
  }
  

  async function scan() {
    
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 400,
        height: 400,
      },
      fps: 5,
    });

    async function success(res) {
      scanner.clear();
      setScannerQr(res);
      if (res) {
          console.log(res);
          await checkValid(res);
      }
      
    }
   
    function error(err) {
      console.error("QR scanning error:", err);
      setScannerQr("");
    }

    scanner.render(success, error);
  }
  return (
    <>
      <div className="header">
        {/* <img src={logo} alt="Logo" className="logo" /> */}
        <div className="head-sub">
        <IoQrCodeSharp className="logo"/>
        <h1>Scan App</h1>
        </div>
        <div className="connect">
            <button className="connect-button" onClick={handleConnectWallet}>
            {connected ? "Connected": "Connect to Wallet"}
            </button>
        </div>
      </div>
      <div className="head-title"> 
      <h1>QR scanning for Event Pass validation</h1>
      </div>
      <p>{showModal}</p>
      
      {error && <p className="error">{error}</p>}
      {(scannedqr === "" && <div id="reader"><button className="scan-button" onClick={scan} title={btn.text}>Click to Scan</button></div>)}
      {/* <div>{scannedqr ? <p>Success</p> : null}</div> */}
      
      {showModal && ValidQr && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
            <h2>Event Details</h2>
            <IoCloseCircle className="close" onClick={handleCloseModal}/>
            </div>
            <p><span className="label">Email:</span> {personDetails.email}</p>
            <p><span className="label">Name:</span> {eventDetails.name}</p>
            <p><span className="label">Location:</span> {eventDetails.location}</p>
            <p><span className="label">No.of Persons:</span> {personDetails.person}</p>
            <p><span className="label">Date:</span> {EveDetails.date}</p>
          </div>
        </div>
      )}
      {showModal && !ValidQr && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
            <h2>Invalid QR Code</h2>
            <IoCloseCircle className="close" onClick={handleCloseModal}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Scanner;