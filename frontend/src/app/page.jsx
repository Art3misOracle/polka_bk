"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CatImg from "../../public/new/cat.png"
import ChatBox from "../../public/new/chat-box.png"
import ButtonImg from "../../public/new/button-star.png"
import CardImg from "../../public/new/card.png"
import contractABI from "../../abi/abi.json"
import animation1 from "../../public/Animation/AnimationFire.json"
import animation2 from "../../public/Animation/AnimationFirework.json"
import LottieAnimation from "../component/LottieAnimation";
import { GearApi } from "@gear-js/api";
import {
  web3Enable,
  web3Accounts,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { Program } from "./lib";

const VNFT_PROGRAM_ID =
  "0xbb164a2a6f53a17cf06624621a7d94d41526e3806616332a02ccfe4d90d69ed8";

export default function Home() {
  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [cardimage, setcardimage] = useState("");
  const [position, setposition] = useState("");
  const [mintdone, setmintdone] = useState(false);
  const [contractResult, setContractResult] = useState(null);

  const [gearApi, setGearApi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isConnected, setConnected] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const connectToGearApi = async () => {
        try {
          const api = await GearApi.create({
            providerAddress: "wss://testnet.vara.network",
          });
          setGearApi(api);
          console.log("Connected to Vara testnet");
        } catch (error) {
          console.error("Failed to connect to Gear API:", error);
        }
      };

      connectToGearApi();
    }
  }, []);

  const connectWallet = async () => {
    try {
      const extensions = await web3Enable("My Gear App");
      if (extensions.length === 0) {
        console.log("No extension found");
        return;
      }

      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);

      if (allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0]);
        setConnected(true);
        console.log("Wallet connected:", allAccounts[0].address);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const mintExample = async () => {
    const to =
      "0x726db3a23fc98b838572bfcc641776dd9f510071f400d77fac526266c0fcdca7";
    const token_metadata = {
      name: "I The Magician, upright",
      description: "this is a sample answer",
      media: "test_ipfs_url",
      reference: "test_json",
    };
    const vnft = new Program(gearApi, VNFT_PROGRAM_ID);
    const transaction = vnft.vnft.mint(to, token_metadata);
    const injector = await web3FromSource(selectedAccount.meta.source);
    transaction.withAccount(selectedAccount.address, {
      signer: injector.signer,
    });
    await transaction.calculateGas();
    const { msgId, blockHash, response } = await transaction.signAndSend();
    await response();
    console.log("VNFT minted successfully");
  };

  const handleAccountChange = (event) => {
    const account = accounts.find((acc) => acc.address === event.target.value);
    setSelectedAccount(account);
  };

  const handleDrawCardAndFetchreading = async () => {
    setLoading(true);

    try {
      // ... (rest of the function remains unchanged)
    } catch (error) {
      console.error("Error handling draw card and fetching reading:", error);
      setLoading(false)
    } finally {
    }
  };

  const mintreading = async () => {
    setLoading(true);

    try {
      // ... (rest of the function remains unchanged)
    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    setSelectedCardIndex(index);
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-between w-full relative ${lyrics && ques ? 'py-40' : 'py-60'}`}
      style={{
        backgroundImage: (lyrics && ques)
          ? "url(/profilebg.png)"
          : (isConnected)
            ? "url(/web_bg.png)"
            : "url(/web_bg.png)",
        backgroundPosition: "center",
        backgroundSize: "cover",
        position: "relative",
        zIndex: 0,
      }}
    >
      <div className="absolute top-[35.8%] left-[73.4%] w-16 h-16">
        <LottieAnimation animationData={animation1} speed={1} />
      </div>
      <div className="absolute top-[45.2%] left-[24.0%] w-14 h-14">
        <LottieAnimation animationData={animation1} speed={0.75} />
      </div>
      <div className="absolute top-[45.2%] left-[26.0%] w-14 h-14">
        <LottieAnimation animationData={animation1} speed={1.25} />
      </div>

      <div
        className="z-10 lg:max-w-7xl w-full justify-between font-mono text-sm lg:flex md:flex"
        style={{
          position: "absolute",
          top: 30,
        }}
      >
        <p
          className="text-white text-2xl backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit rounded-xl"
          style={{ fontFamily: 'fantasy' }}
        >
        </p>
        <div>
          {isConnected ? (
            <>
              {accounts.length > 0 && (
                <div className="mb-4">
                  <label
                    htmlFor="account-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Account
                  </label>
                  <select
                    id="account-select"
                    onChange={handleAccountChange}
                    value={selectedAccount?.address || ""}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {accounts.map((account) => (
                      <option key={account.address} value={account.address}>
                        {account.meta.name || account.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedAccount && (
                <p className="text-sm text-white">
                  Connected Account:{" "}
                  <span className="font-semibold text-white">
                    {selectedAccount.address}
                  </span>
                </p>
              )}
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="lg:flex md:flex gap-10">
        <div>
          {!isConnected && (
            <div className="flex items-center mt-72 relative">
              <div className="flex items-center">
                <Image src={CatImg} alt="Cat" className="w-[240px]" />
                <Image src={ChatBox} alt="Cat" className="w-[828px]" />
              </div>
              <button
                className="absolute bottom-4 left-1/2"
                onClick={() => {
                  setques(true);
                }}
              >
                <Image src={ButtonImg} alt="Cat" className="w-[240px]" />
              </button>
            </div>
          )}

          {!lyrics && isConnected && (
            <div className="z-10 flex justify-center">
              <div className="flex items-center gap-10 mt-20 pt-40">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div 
                    key={index} 
                    className={`transform transition duration-700 cursor-pointer ${
                      selectedCardIndex === null
                        ? 'hover:-translate-y-10 hover:animate-glowPulse'
                        : selectedCardIndex === index
                        ? 'scale-150 translate-y-6'
                        : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => handleCardClick(index)}
                  >
                    <Image src={CardImg} alt="Cat" className="w-[186px]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isConnected && lyrics && (
            <div
              className="px-10 py-10 rounded-2xl max-w-xl"
              style={{
                boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.7)"
              }}
            >
              <div>
                <div>
                  <div className="flex gap-4 pb-8">
                    <button
                      onClick={() => {
                        setques(true);
                        setDrawnCard(null);
                        setLyrics("");
                      }}
                      className="rounded-full py-2 px-8 text-black font-semibold"
                      style={{ backgroundColor: "#E8C6AA" }}
                    >
                      Start Again
                    </button>

                    <button
                      onClick={mintreading}
                      className="rounded-full py-2 px-6 text-black font-semibold"
                      style={{ backgroundColor: "#E8C6AA" }}
                    >
                      Mint reading
                    </button>

                  </div>
                  <h2 className="font-bold mb-2 text-black">
                    Your Tarot Reading:
                  </h2>
                  <p className="text-black">{lyrics}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {drawnCard && lyrics && (
          <div>
            <h2 className="mb-4 ml-20 text-white">{drawnCard}</h2>
            {position === "upright" ? (
              <img
                src={`https://nftstorage.link/ipfs/${cardimage.split("ipfs://")[1]
                  }`}
                width="350"
                height="350"
              />
            ) : (
              <img
                src={`https://nftstorage.link/ipfs/${cardimage.split("ipfs://")[1]
                  }`}
                width="350"
                height="350"
                style={{ transform: "rotate(180deg)" }}
              />
            )}
          </div>
        )}
      </div>

      {ques && !isConnected && (
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setques(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-2xl text-center font-bold" style={{ color: '#FFB000' }}>
                  Please connect your Wallet
                </p>
              </div>
              <div className="flex items-center p-4 rounded-b pb-20 pt-10 justify-center">
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mintdone && (
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setmintdone(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 space-y-4 pb-20">
                <p className="text-3xl text-center font-bold text-green-500">
                  Successfully Minted!!
                </p>
                <p className="text-lg text-center pt-4">
                  Please check the NFT in your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow">
              <div className="flex justify-center gap-4">
                <img
                  className="w-50 h-40"
                  src="/loader.gif"
                  alt="Loading icon"
                />

                {/* <span className="text-white mt-2">Loading...</span> */}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
