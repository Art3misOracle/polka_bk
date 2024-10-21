"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import CardImg from "../../../public/new/card.png";
import ResImg from "../../../public/new/res.png";
import ButtonImg from "../../../public/new/button-fate.png";

interface ConnectedProps {
    isConnected: boolean;
    lyrics: string;
}

const Connected: React.FC<ConnectedProps> = ({ isConnected, lyrics }) => {
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

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

    if (!isConnected || lyrics) {
        return null;
    }

    return (
        <div className="z-10 flex justify-center">
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

        </div>
    );
};

export default Connected;
