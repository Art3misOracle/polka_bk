"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import React, { useEffect, useState } from 'react';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi'
import { ethers } from 'ethers';
import CatImg from "../../public/new/cat.png"
import ChatBox from "../../public/new/chat-box.png"
import ButtonImg from "../../public/new/button-star.png"
import CardImg from "../../public/new/card.png"
import contractABI from "../../abi/abi.json"
import animation1 from "../../public/Animation/AnimationFire.json"
import animation2 from "../../public/Animation/AnimationFirework.json"
import LottieAnimation from "../component/LottieAnimation";

export default function Home() {
  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [cardimage, setcardimage] = useState("");
  const [position, setposition] = useState("");
  const [mintdone, setmintdone] = useState(false);
  const { isConnected: connected, address } = useAccount()
  const [contractResult, setContractResult] = useState(null);
  const { data: hash, error, isPending, writeContract } = useWriteContract()


  const CONTRACT_ADDRESS = '0x6d9055be44BbF7DBFb14272A582A34Af7Bb9F295'
  const { data: result, error: errorName, isPending: isPendingName, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'drawCard',
    enabled: false, // 禁用自动读取
  })
  const getDrawCardAndFetchReading = async () => {
    setLoading(true);
    await refetch(); // 重新读取合约数据
    setContractResult(result); // 设置结果
  };
  const { data: tokenId, refetch: refetchToken } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCurrentTokenId',
    enabled: false, // 禁用自动读取
  })
  const getToken = async () => {
    await refetchToken(); // 重新读取合约数据
  };


  const handleDrawCardAndFetchreading = async () => {
    setLoading(true);

    try {
      getDrawCardAndFetchReading()
      console.log("abi result", result);

      const output = result.split('; ');

      const card = output[0];
      const position = output[1];

      console.log("card", output[0], "position", output[1], "cardimg", output[2]);

      setcardimage(output[2]);
      setDrawnCard(output[0]);
      setposition(output[1]);

      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `You are a Major Arcana Tarot reader. Client asks this question “${description}” and draws the “${card}” card in “${position}” position. Interpret to the client in no more than 100 words.`,
          },
        ],
      };

      let apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = "https://apikeyplus.com/v1/chat/completions";
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append(
        "Authorization",
        `Bearer ${apiKey}`
      );
      const readingResponse = await fetch(baseURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
      console.log('0---===---000', readingResponse)

      if (!readingResponse.ok) {
        throw new Error("Failed to fetch reading");
      }

      const readingData = await readingResponse.json();
      setLyrics(readingData.choices[0].message.content);
      console.log(readingData);
      console.log("Data to send in mint:", card, position);

    } catch (error) {
      console.error("Error handling draw card and fetching reading:", error);
      setLoading(false)
    } finally {
    }


  };

  const mintreading = async () => {
    setLoading(true);

    try {

      // let abi = { "entrys": [{ "stateMutability": "Nonpayable", "type": "Constructor" }, { "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "approved", "type": "address" }, { "indexed": true, "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "Event" }, { "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "operator", "type": "address" }, { "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "Event" }, { "inputs": [{ "name": "card_drawn", "type": "string" }], "name": "CardsDrawn", "type": "Event" }, { "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": true, "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "Event" }, { "outputs": [{ "type": "string" }], "constant": true, "name": "MAJOR_ARCANA_URI", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "address" }], "constant": true, "name": "Owner", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "string" }], "constant": true, "name": "baseURI", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "string" }], "constant": true, "name": "drawCards", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "constant": true, "name": "getCurrentTokenId", "stateMutability": "View", "type": "Function" }, { "payable": true, "inputs": [{ "name": "to", "type": "address" }, { "name": "tokenURI", "type": "string" }], "name": "mintReading", "stateMutability": "Payable", "type": "Function" }, { "outputs": [{ "type": "bool" }], "inputs": [{ "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" }], "name": "mintWithTokenURI", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "type": "string" }], "constant": true, "name": "name", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "address" }], "constant": true, "inputs": [{ "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "string" }], "constant": true, "name": "symbol", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "string" }], "constant": true, "inputs": [{ "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "stateMutability": "View", "type": "Function" }, { "inputs": [{ "name": "_amount", "type": "uint256" }], "name": "withdraw", "stateMutability": "Nonpayable", "type": "Function" }] };

      // let contractmint = await tronWeb.contract(abi.entrys, 'TKwFErXfUzYGSnTrM6ryCRWj4i66S2UHeL');

      // const getCurrentTokenId = await contractmint["getCurrentTokenId"]().call();
      getToken()

      const currentToken = ethers.formatEther(`${tokenId.toString()}`);

      const jsontxt = {
        "title": "Asset Metadata",
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Tronquility#" + parseInt(currentToken)
          },
          "description": {
            "type": "string",
            "description": lyrics
          },
          "image": {
            "type": "string",
            "description": cardimage
          }
        }
      }

      console.log("currentToken", currentToken, jsontxt);


      writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'mintReading',
        args: [address, jsontxt]
      })

      // let result = await contractmint["mintReading"](address, jsontxt).send(
      //   {
      //     feeLimit: 100_000_000,  // Fee limit for the transaction
      //     callValue: tronWeb.toSun(10)          // Adjust call value if necessary
      //   }
      // );

      console.log("abi mint result", hash);

      setmintdone(true);
    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-between w-full relative ${lyrics && ques ? 'py-40' : 'py-60'}`}
      style={{
        backgroundImage: (lyrics && ques)
          ? "url(/profilebg.png)"
          : (address)
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
          position: "absolute", // Makes the div overlay the background
          top: 30, // Adjust as needed
        }}
      >
        <p
          className="text-white text-2xl backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit rounded-xl"
          style={{ fontFamily: 'fantasy' }}
        >
          {/* Tronquility */}
        </p>
        <div
        >
          <Navbar />
        </div>
      </div>

      <div className="lg:flex md:flex gap-10">
        <div>
          {!connected && (
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


          {!lyrics && connected && (
            <div className="z-10 ">
              <div className="flex items-center gap-10 mt-20 pt-40">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div 
                    key={index} 
                    className="transform transition duration-700 hover:-translate-y-10 cursor-pointer"
                    style={{
                      animation: 'none',
                      ':hover': {
                        animation: 'glowPulse 1.5s infinite alternate'
                      }
                    }}
                  >
                    <Image src={CardImg} alt="Cat" className="w-[186px]" />
                  </div>
                ))}
              </div>
              {/* 
              <div className="mt-20 flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Write your question here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="py-3 px-4 rounded-full w-full focus:outline-none text-white mt-48 placeholder-white"
                  style={{ width: '100%', minWidth: '700px', backgroundColor: '#A89495' }}
                />

                <button
                  onClick={async () => {
                    await handleDrawCardAndFetchreading()
                    setLoading(false)
                  }
                  }
                  className="bg-white rounded-full py-3 px-20 text-black mt-4 uppercase" style={{ fontFamily: 'fantasy', backgroundColor: '#DACFE6' }}
                >
                  Ask
                </button>

              </div> */}
            </div>
          )}

          {connected && lyrics && (

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

      {ques && !connected && (
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
                <Navbar />
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
              {/* <div className="flex items-center p-4 rounded-b pb-20">
                <Link href="/profile"
                  type="button"
                  className="w-1/2 mx-auto text-black bg-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  My Profile
                </Link>
              </div> */}
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
