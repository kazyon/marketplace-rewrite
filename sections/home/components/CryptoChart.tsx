import React, { useState, useEffect } from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export function CryptoChart() {
    const [price, setPrice] = useState(null);
    const [coinHistory, setCoinHistory] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [previousPrice, setPreviousPrice] = useState(null);
    const [priceChangePercentage, setPriceChangePercentage] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('usd');

    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        async function fetchData() {
            const currentApiUrl = '/api/getSolPrice';
            const previousApiUrl = `/api/getSolHistoricalPrice`;

            try {
                const currentResponse = await fetch(currentApiUrl);
                const currentData = await currentResponse.json();
                setPrice(currentData.solana);
                setCurrentPrice(currentData.solana.usd);

                const previousResponse = await fetch(previousApiUrl);
                const previousData = await previousResponse.json();
                setPreviousPrice(previousData.market_data.current_price.usd);
            } catch (error) {
                console.error('Error fetching Solana data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function coinHistory() {
            try {
                const response = await fetch('/api/getSolCoinHistory');
                const data = await response.json();
                setCoinHistory(data.image.small);
            } catch (error) {
                console.error('Error fetching Solana price:', error);
            }
        }
        coinHistory();
    }, []);

    useEffect(() => {
        if (currentPrice && previousPrice) {
            const change = ((currentPrice - previousPrice) / previousPrice) * 100;
            setPriceChangePercentage(change.toFixed(2));
        }
    }, [currentPrice, previousPrice]);

    const getPriceChangeStyle = (priceChange) => {
        return {
            color: priceChange < 0 ? 'red' : '#00f300',
        };
    };

    const renderCaretIcon = (priceChange) => {
        return priceChange < 0 ? <FaCaretDown /> : <FaCaretUp />;
    };

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const displayPrice = () => {
        return price && price[selectedCurrency] ? price[selectedCurrency] : 'Loading...';
    };

    return (
        <div className="chart-wrapper pr-2 pl-2 pb-2 pt-2 w-full  rounded-xl">
            {/*<Slider {...settings}>*/}
            <div>
                {price !== null ? (
                    <div>
                        <div className="container flex flex-col md:flex-row items-center justify-between text-sm">
                            <div className="flex items-center pr-2 dark:text-white">
                                <div className="pr-2">
                                    {coinHistory !== null ? (
                                        <img src={coinHistory} alt="" width="35" />
                                    ) : (
                                        <p>Loading data...</p>
                                    )}
                                </div>
                                <div className="pr-2 text-center text-white">Solana (SOL)</div>
                                {currentPrice !== null ? (
                                    <div className="flex">
                                        <div
                                            className="pr-2"
                                            style={getPriceChangeStyle(parseFloat(priceChangePercentage))}
                                        >
                                            ({priceChangePercentage}%)
                                        </div>
                                        <div className="flex items-center">
                                            <div style={getPriceChangeStyle(parseFloat(priceChangePercentage))}>
                                                (24h)
                                            </div>
                                            <div style={getPriceChangeStyle(parseFloat(priceChangePercentage))}>
                                                {renderCaretIcon(parseFloat(priceChangePercentage))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white">Loading price...</p>
                                )}
                            </div>
                            <div className="flex">
                                {/* Dropdown for currency selection */}
                                <select
                                    value={selectedCurrency}
                                    onChange={handleCurrencyChange}
                                    className="px-2 py-0 pr-8 appearance-none"
                                >
                                    <option value="usd">USD </option>
                                    <option value="eur">EUR</option>
                                    <option value="gbp">GBP</option>
                                </select>
                                <div className="text-white pl-2 flex justify-center items-center">
                                    {selectedCurrency.toUpperCase()} {displayPrice()} (
                                    {selectedCurrency === 'usd' ? '$' : selectedCurrency === 'eur' ? '€' : '£'})
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading price...</p>
                )}
            </div>
            {/*<div>second slide</div>*/}
            {/*<div>third slide</div>*/}
            {/* Additional slides if needed */}
            {/*</Slider>*/}
        </div>
    );
}
