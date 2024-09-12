import React, { useState } from 'react';
import SectorChart from './SectorChart';

const SectorsPage: React.FC = () => {
    const [currentInterval, setCurrentInterval] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
    const [legendHTML, setLegendHTML] = useState<string>('');
    const [series, setSeries] = useState<{ [key: string]: any }>({});

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

    const toggleSeries = (ticker: string) => {
        const lineSeries = series[ticker];
        if (lineSeries) {
            const isVisible = lineSeries.options().visible !== false;
            lineSeries.applyOptions({ visible: !isVisible });
        }
    };

    return (
        <div className="sectors-page">
            <h1>Sectors Chart</h1>
            <SectorChart 
                tickers={tickers} 
                currentInterval={currentInterval} 
                setLegendHTML={setLegendHTML} 
                setSeries={setSeries} 
                series={series} 
            />
            <div id="legend" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: legendHTML }} />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {tickers.map(ticker => (
                    <label key={ticker.symbol}>
                        <input type="checkbox" defaultChecked onChange={() => toggleSeries(ticker.symbol)} /> {ticker.symbol}
                    </label>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {['1M', '3M', '6M', '1Y'].map(interval => (
                    <button key={interval} onClick={() => setCurrentInterval(interval as '1M' | '3M' | '6M' | '1Y')}>
                        {interval}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SectorsPage;
