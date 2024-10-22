"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CardImg from "@/public/new/card.png";
import ResImg from "@/public/new/res.png";
import ButtonImg from "@/public/new/button-fate.png";
import ManImg from "@/public/new/man.png";
import DialogImg from "@/public/new/dialog.svg";
import BtnSvg from "@/public/new/btn.svg";
import BtnStart from "@/public/new/image.png";
import Confetti from 'react-confetti';

interface ConnectedProps {
    isConnected: boolean;
    lyrics: string;
    getAi: (description: string) => void;
    mint: () => Promise<boolean>;
}

const Connected: React.FC<ConnectedProps> = ({ isConnected, lyrics, getAi, mint }) => {
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [showCards, setShowCards] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [buttonMoved, setButtonMoved] = useState<boolean>(false);
    const [showFate, setShowFate] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    useEffect(() => {
        if (isConnected) {
            setShowDialog(true);
        }
    }, [isConnected]);

    const seeMyFate = () => {
        setShowFate(true);
        setButtonMoved(true);
    }

    const handleCardClick = (index: number) => {
        if (selectedCardIndex === index) {
            if (flippedCard === null) {
                setFlippedCard(index);
            }
        } else {
            setSelectedCardIndex(index);
            setFlippedCard(null);
            setButtonMoved(false);
        }
    };

    const handleSubmitQuestion = async () => {
        if (description.trim()) {
            setShowDialog(false);
            setIsLoading(true);
            try {
                await getAi(description);
            } finally {
                setIsLoading(false);
                setShowCards(true);
            }
        }
    };

    const resetToInitialState = () => {
        setSelectedCardIndex(null);
        setFlippedCard(null);
        setDescription("");
        setShowCards(false);
        setShowDialog(true);
        setIsLoading(false);
        setButtonMoved(false);
        setShowFate(false);
        setShowConfetti(false);
    };

    const handleMint = async () => {
        const success = await mint();
        if (success) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000); // 5秒后停止撒花
        }
    };

    if (!isConnected) {
        return null;
    }

    return (
        <div className="z-10 flex justify-center relative ">
            {showConfetti && <Confetti />}
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-md z-50">
                    <div className="bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl border-2 border-gray-700 shadow-2xl max-w-3xl w-full transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h2 className="text-5xl font-bold mb-10 text-white text-center">Ask Your Question</h2>
                        <textarea
                            className="w-full p-8 mb-10 text-black bg-gray-200 bg-opacity-70 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ease-in-out resize-none text-2xl"
                            rows={6}
                            placeholder="Enter your question here..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button
                            className="w-full bg-gray-700 text-white py-6 px-10 rounded-lg text-2xl font-semibold hover:bg-gray-600 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onClick={handleSubmitQuestion}
                        >
                            Reveal My Fate
                        </button>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-md z-50">
                    <div className="text-white text-2xl">Loading...</div>
                </div>
            )}
            {showFate && (
                <div className="flex justify-center items-center absolute -bottom-32 -left-32 w-full h-full animate-fadeIn">
                    <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <Image src={ManImg} alt="Man" width={270}/>
                    </div>
                    <div className="animate-fadeIn flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
                        <div className="relative">
                            <Image src={DialogImg} alt="Dialog" width={840} height={420} />
                            <div className="absolute inset-0 flex items-center justify-center pl-12 pr-4">
                                <div className="text-[#32CEFF] text-2xl">{lyrics}</div>
                            </div>
                        </div>
                        <div className='flex gap-6 -mt-16'>
                            <div 
                                className='relative w-[240px] h-[240px] flex items-center justify-center animate-fadeIn cursor-pointer' 
                                style={{ animationDelay: '0.6s' }}
                                onClick={resetToInitialState}
                            >
                                <Image src={BtnSvg} alt="Btn" layout="fill" objectFit="contain" draggable={false} />
                                <span className="relative z-10 text-xl text-white font-bold">Start again</span>
                            </div>
                            <div className='relative w-[240px] h-[240px] flex items-center justify-center animate-fadeIn cursor-pointer' style={{ animationDelay: '0.8s' }}
                                onClick={handleMint}
                            >
                                <Image src={BtnSvg} alt="Btn" layout="fill" objectFit="contain" draggable={false}/>
                                <span className="relative z-10 text-xl text-white font-bold">Mint</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showCards && (
                <div className="relative flex items-center gap-10 mt-20">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div
                            key={index}
                            className={`transform transition duration-700 cursor-pointer ${selectedCardIndex === null
                                ? 'hover:-translate-y-10 hover:animate-glowPulse'
                                : selectedCardIndex === index
                                    ? `scale-150 translate-y-[10px] absolute left-1/2 -translate-x-1/2 ${flippedCard !== index ? 'animate-glowPulse' : ''}`
                                    : 'opacity-0 pointer-events-none'
                                }`}
                            style={{
                                zIndex: selectedCardIndex === index ? 10 : 1,
                            }}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className={`transition-all duration-1000 ${buttonMoved ? 'translate-x-[400px]' : ''}`}>
                                <Image
                                    src={flippedCard === index ? ResImg : CardImg}
                                    alt="Card"
                                    className="w-[186px] transition-all duration-1000"
                                    style={{
                                        transform: flippedCard === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transition: 'transform 1.6s'
                                    }}
                                />
                                {
                                    flippedCard === index && (
                                        <div className='w-full flex justify-center mt-16'>
                                            <div
                                                onClick={seeMyFate}
                                                className="absolute bottom-0 text-center flex items-center justify-center transition-all duration-1000"
                                                style={{
                                                    opacity: buttonMoved ? 0 : 1,
                                                    transition: 'opacity 1s'
                                                }}
                                            >
                                                <Image src={ButtonImg} alt="See my Fate" className="w-[240px]" />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Connected;
