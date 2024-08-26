import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, LineData, LineSeriesPartialOptions, DeepPartial, ChartOptions, ColorType } from 'lightweight-charts';

// Fetch data from Polygon API and calculate percentage change
async function fetchData(ticker: string, from: string, to: string): Promise<LineData[]> {
    const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX'; // Replace with your Polygon API key
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return [];
    }

    const firstValue = data.results[0].c; // Use the first close value as the base for percentage change

    return data.results.map((item: any) => ({
        time: item.t / 1000,
        value: ((item.c - firstValue) / firstValue) * 100, // Calculate percentage change
    }));
}

const SectorsPage: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const [series, setSeries] = useState<{ [key: string]: any }>({});
    const [currentInterval, setCurrentInterval] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
    const [legendHTML, setLegendHTML] = useState<string>('');

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

    // Define the intervals with their corresponding date ranges
    interface Interval {
        from: string;
        to: string;
    }

    const intervals: Record<'1M' | '3M' | '6M' | '1Y', Interval> = {
        '1M': {
            from: '2024-07-23',
            to: '2024-08-23',
        },
        '3M': {
            from: '2024-05-23',
            to: '2024-08-23',
        },
        '6M': {
            from: '2024-02-23',
            to: '2024-08-23',
        },
        '1Y': {
            from: '2023-08-23',
            to: '2024-08-23',
        },
    };

    useEffect(() => {
        if (chartContainerRef.current) {
            const chartOptions: DeepPartial<ChartOptions> = {
                layout: {
                    textColor: 'white',
                    background: { type: ColorType.Solid, color: 'transparent' },
                },
                grid: {
                    vertLines: { color: '#2c2c2e' },
                    horzLines: { color: '#2c2c2e', style: 1 }, // Dashed horizontal lines
                },
                rightPriceScale: {
                    borderColor: '#485c7b',
                    scaleMargins: {
                        top: 0.3, // Leave some space for the legend
                        bottom: 0.25,
                    },
                },
                timeScale: {
                    borderColor: '#485c7b',
                    timeVisible: true,
                    rightOffset: 5, // Reduce this value to make more room for the labels
                },
                crosshair: {
                    horzLine: {
                        visible: false,
                        labelVisible: false,
                    },
                },
            };
    
            chartRef.current = createChart(chartContainerRef.current, chartOptions);
    
            // Create and style the legend
            const legend = document.createElement('div');
            Object.assign(legend.style, {
                position: 'absolute',
                left: '12px',
                bottom: '12px', // Place the legend above the tickers
                zIndex: '1',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                lineHeight: '18px',
                fontWeight: '300',
                color: 'white', // Ensure the text is visible against the dark background
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Make the background semi-transparent
                padding: '5px',
                borderRadius: '5px',
            });
            chartContainerRef.current.appendChild(legend);
    
            chartRef.current.subscribeCrosshairMove(param => {
                console.log('Crosshair move param:', param);
                if (!param.time) {
                    setLegendHTML(''); // Clear the legend when no time is selected
                    console.log('No time selected, legend cleared.');
                    return;
                }
            
                // Loop through the tickers to update the legend
                let updatedLegendHTML = '';
                tickers.forEach(ticker => {
                    const seriesData = param.seriesData.get(series[ticker.symbol]);
            
                    if (!seriesData) {
                        console.log(`No data for ticker: ${ticker.symbol}`);
                        return; // Skip to the next ticker
                    }
            
                    let price: number | null = null;
            
                    // If seriesData exists, attempt to get the value or close price
                    if ('value' in seriesData) {
                        price = seriesData.value;
                    } else if ('close' in seriesData) {
                        price = seriesData.close;
                    }
            
                    if (price !== null) {
                        updatedLegendHTML += `<div><strong style="color:${ticker.color}">${ticker.symbol}</strong>: ${price.toFixed(2)}</div>`;
                    }
            
                    // Log the ticker and the price for debugging
                    console.log(`Ticker: ${ticker.symbol}, Price: ${price}`);
                });
            
                setLegendHTML(updatedLegendHTML);
            
                // Log the final HTML for the legend
                console.log('Updated Legend HTML:', updatedLegendHTML);
            });
    
            const addSeriesToChart = async (ticker: string, color: string) => {
                const seriesOptions: LineSeriesPartialOptions = { color };
                const lineSeries = chartRef.current?.addLineSeries(seriesOptions);
                const { from, to } = intervals[currentInterval];
                const data = await fetchData(ticker, from, to);
                
                lineSeries?.setData(data);
                setSeries(prev => {
                    const updatedSeries = { ...prev, [ticker]: lineSeries };
                    console.log('Updated series:', updatedSeries); // Log the updated series
                    return updatedSeries;
                });
            };
    
            // Add the series for each ticker with a unique color
            addSeriesToChart('SPY', 'rgb(44, 130, 201)');   // Blue
            addSeriesToChart('XLC', 'rgb(239, 83, 80)');    // Red
            addSeriesToChart('XLY', 'rgb(124, 179, 66)');   // Green
            addSeriesToChart('XLP', 'rgb(255, 202, 40)');   // Yellow
            addSeriesToChart('XLE', 'rgb(126, 87, 194)');   // Purple
            addSeriesToChart('XLF', 'rgb(0, 188, 212)');    // Cyan
            addSeriesToChart('XLV', 'rgb(255, 87, 34)');    // Orange
            addSeriesToChart('XLI', 'rgb(171, 71, 188)');   // Violet
            addSeriesToChart('XLB', 'rgb(76, 175, 80)');    // Light Green
            addSeriesToChart('XLRE', 'rgb(156, 39, 176)');  // Deep Purple
            addSeriesToChart('XLK', 'rgb(255, 235, 59)');   // Light Yellow
            addSeriesToChart('XLU', 'rgb(33, 150, 243)');   // Light Blue
    
            chartRef.current.timeScale().fitContent(); // Ensure the x-axis is not compressed
        }
    
        return () => chartRef.current?.remove();
    }, [currentInterval]);

    const toggleSeries = (ticker: string) => {
        const lineSeries = series[ticker];
        if (lineSeries) {
            const isVisible = lineSeries.options().visible !== false;
            lineSeries.applyOptions({ visible: !isVisible });
        }
    };

    return (
        <div style={{ backgroundColor: '#1c1c1e', color: 'white', padding: '5px', height: '100vh' }}>
            <h1>Sectors Chart</h1>
            <div id="container" style={{ width: '90%', height: 'calc(100% - 220px)', marginBottom: '20px', position: 'relative' }} ref={chartContainerRef}></div>
            <div id="legend" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: legendHTML }} />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {tickers.map(ticker => (
                    <label key={ticker.symbol}>
                        <input type="checkbox" defaultChecked onChange={() => toggleSeries(ticker.symbol)} /> {ticker.symbol}
                    </label>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {Object.keys(intervals).map(interval => (
                    <button key={interval} onClick={() => setCurrentInterval(interval as '1M' | '3M' | '6M' | '1Y')}>
                        {interval}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SectorsPage;