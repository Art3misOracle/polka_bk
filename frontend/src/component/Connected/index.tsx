"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CardImg from "../../../public/new/card.png";
import ResImg from "../../../public/new/res.png";
import ButtonImg from "../../../public/new/button-fate.png";

interface ConnectedProps {
    isConnected: boolean;
    lyrics: string;
    getAi: (description: string) => void;
}

const Connected: React.FC<ConnectedProps> = ({ isConnected, lyrics, getAi }) => {
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [showCards, setShowCards] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isConnected && !lyrics) {
            setShowDialog(true);
        }
    }, [isConnected, lyrics]);

    const handleCardClick = (index: number) => {
        if (selectedCardIndex === index) {
            if (flippedCard === null) {
                setFlippedCard(index);
            }
        } else {
            setSelectedCardIndex(index);
            setFlippedCard(null);
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

    if (!isConnected || lyrics) {
        return null;
    }

    return (
        <div className="z-10 flex justify-center">
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-md z-50">
                    <div className="bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl border-2 border-gray-700 shadow-2xl max-w-3xl w-full transform transition-all duration-300 ease-in-out hover:scale-105">
                        <h2 className="text-5xl font-bold mb-10 text-white text-center">Ask Your Question</h2>
                        <textarea
                            className="w-full p-8 mb-10 text-black bg-gray-800 bg-opacity-70 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ease-in-out resize-none text-2xl"
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
            {showCards && (
                <div className="relative flex items-center gap-10 mt-20">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div
                            key={index}
                            className={`transform transition duration-700 cursor-pointer ${selectedCardIndex === null
                                    ? 'hover:-translate-y-10 hover:animate-glowPulse'
                                    : selectedCardIndex === index
                                        ? `scale-150 translate-y-[800px] absolute left-1/2 -translate-x-1/2 ${flippedCard !== index ? 'animate-glowPulse' : ''}`
                                        : 'opacity-0 pointer-events-none'
                                }`}
                            style={{
                                zIndex: selectedCardIndex === index ? 10 : 1,
                            }}
                            onClick={() => handleCardClick(index)}
                        >
                            <Image
                                src={flippedCard === index ? ResImg : CardImg}
                                alt="Card"
                                className="w-[186px]"
                                style={{
                                    transform: flippedCard === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    transition: 'transform 1.6s'
                                }}
                            />
                            {
                                flippedCard === index && (
                                    <div className='w-full flex justify-center'>
                                        <div className="absolute bottom-0 text-center flex items-center justify-center">
                                            <Image src={ButtonImg} alt="See my Fate" className="w-[240px]" />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Connected;
