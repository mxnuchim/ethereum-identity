import "./App.css";
import { useState, useRef } from "react";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Main from "./components/Main";
import Profile from "./components/Profile";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { client, getRecord } from "./utils/utils";

function App() {
  const [account, SetAccount] = useState("0x00000");
  const [profile, setProfile] = useState({});
  const [localDid, setDid] = useState(null);
  const [idxInstance, setIdxInstance] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const idxRef = useRef(null);
  const didRef = useRef(null);
  idxRef.current = idxInstance;
  didRef.current = localDid;

  let eth;

  async function logIn() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: process.env.WALLET_CONNECT_ID, // required
        },
      },
    };
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const provider = await web3Modal.connect();

    provider.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });
    provider.on("connect", (info) => {
      console.log(info);
    });

    eth = new ethers.providers.Web3Provider(provider);
    const signer = eth.getSigner();
    const signerAddress = await signer.getAddress();
    SetAccount(signerAddress);
  }

  async function connect() {
    const cdata = await client();
    const { did, idx, error } = cdata;
    if (error) {
      console.log("error: ", error);
      return;
    }
    setDid(did);
    setIdxInstance(idx);
    console.log(idx);
    const data = await idx.get("basicProfile", did.id);
    if (data) {
      setProfile(data);
      setLoaded(true);
      console.log(profile);
    } else if (!data) {
      await idx.set("basicProfile", { name: "Anonymous", bio: "😈" });
      const dataa = await idxRef.current.get("basicProfile", didRef.current.id);
      setProfile(dataa);
      setLoaded(true);
    } else {
      console.log("Not able to fetch your data, Try Again!");
    }
  }

  async function updateProfile(bio, name, setChecker) {
    if (!bio && !name) {
      alert("error... no profile information submitted");
      return;
    }
    setChecker(true);
    if (!idxInstance) {
      await connect();
    }
    const user = { ...profile };
    if (bio) user.bio = bio;
    if (name) user.name = name;
    await idxRef.current.set("basicProfile", user);
    setLocalProfileData();
    console.log("profile updated...");
    setChecker(false);
  }

  async function setLocalProfileData() {
    try {
      const data = await idxRef.current.get("basicProfile", didRef.current.id);
      if (!data) return;
      setProfile(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Main
              account={account}
              connect={connect}
              logIn={logIn}
              loaded={loaded}
              profile={profile}
            />
          </Route>
          <Route exact path="/profile">
            <Profile
              profile={profile}
              localDid={localDid}
              updateProfile={updateProfile}
            />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
