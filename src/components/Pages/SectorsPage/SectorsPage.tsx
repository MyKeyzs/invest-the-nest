import React, { useState } from 'react';
import SectorChart from './SectorChart';
import './SectorsPage.css';

const SectorsPage: React.FC = () => {
    // Manage the state for current interval and the legend content
    const [currentInterval, setCurrentInterval] = useState<'1W'| '1M' | '3M' | '6M' | '1Y'>('1W'); // Default to '1W'
    const [legendHTML, setLegendHTML] = useState<string>(''); // Store the legend HTML content
    const [series, setSeries] = useState<{ [key: string]: any }>({}); // Store the series data

    // Define the tickers and their colors
    const tickers = [
        { symbol: 'SPY', color: 'rgb(44, 130, 201)' },   // Blue
        { symbol: 'XLC', color: 'rgb(239, 83, 80)' },    // Red
        { symbol: 'XLY', color: 'rgb(124, 179, 66)' },   // Green
        { symbol: 'XLP', color: 'rgb(255, 202, 40)' },   // Yellow
        { symbol: 'XLE', color: 'rgb(126, 87, 194)' },   // Purple
        { symbol: 'XLF', color: 'rgb(0, 188, 212)' },    // Cyan
        { symbol: 'XLV', color: 'rgb(255, 87, 34)' },    // Orange
        { symbol: 'XLI', color: 'rgb(171, 71, 188)' },   // Violet
        { symbol: 'XLB', color: 'rgb(76, 175, 80)' },    // Light Green
        { symbol: 'XLRE', color: 'rgb(156, 39, 176)' },  // Deep Purple
        { symbol: 'XLK', color: 'rgb(255, 235, 59)' },   // Light Yellow
        { symbol: 'XLU', color: 'rgb(33, 150, 243)' },   // Light Blue
    ];

    // Toggle the visibility of each ticker series
    const toggleSeriesVisibility = (ticker: string) => {
        const lineSeries = series[ticker];
        if (lineSeries) {
            const isVisible = lineSeries.options().visible !== false;
            lineSeries.applyOptions({ visible: !isVisible });
        }
    };

    return (
        <div className="sectors-page">
            <h1>Sectors Chart</h1>
            {/* Pass the necessary props to the SectorChart component */}
            <SectorChart 
                tickers={tickers} 
                currentInterval={currentInterval} 
                setLegendHTML={setLegendHTML} // Pass setLegendHTML as a prop
                setSeries={setSeries} 
                series={series} 
            />
            {/* Render the dynamically updated legend */}
            <div className="legend-container" dangerouslySetInnerHTML={{ __html: legendHTML }}></div>
            {/* Render checkboxes to toggle series visibility */}
            <div className="ticker-checkboxes">
                {tickers.map(ticker => (
                    <label key={ticker.symbol}>
                        <input type="checkbox" defaultChecked onChange={() => toggleSeriesVisibility(ticker.symbol)} /> 
                        {ticker.symbol}
                    </label>
                ))}
            </div>
            {/* Render buttons to switch between intervals */}
            <div className="interval-buttons">
                {['1W', '1M', '3M', '6M', '1Y'].map(interval => (
                    <button key={interval} onClick={() => setCurrentInterval(interval as '1W' | '1M' | '3M' | '6M' | '1Y')}>
                        {interval}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SectorsPage;
