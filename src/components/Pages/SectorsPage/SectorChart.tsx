import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, LineSeriesPartialOptions, DeepPartial, ChartOptions, ColorType, Time } from 'lightweight-charts';
import './SectorChart.css';  // Import the chart-specific CSS

interface SectorChartProps {
    tickers: { symbol: string, color: string }[];
    currentInterval: '1W' | '1M' | '3M' | '6M' | '1Y';
    setLegendHTML: React.Dispatch<React.SetStateAction<string>>; // Ensure this is defined
    setSeries: React.Dispatch<React.SetStateAction<{ [key: string]: ISeriesApi<'Line'> }>>;
    series: { [key: string]: ISeriesApi<'Line'> }; 
}

// Function to fetch data from the Polygon API
async function fetchData(ticker: string, from: string, to: string): Promise<LineData<Time>[]> {
    const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX'; // Replace with your actual Polygon API key
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return [];
    }

    const firstValue = data.results[0].c;

    return data.results.map((item: any) => ({
        time: (item.t / 1000) as Time, // Convert to seconds and typecast as Time
        value: ((item.c - firstValue) / firstValue) * 100, // Percentage change
    }));
}

const SectorChart: React.FC<SectorChartProps> = ({ tickers, currentInterval, setSeries, series }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    // Declare legendHTML as state
    const [legendHTML, setLegendHTML] = useState<string>('');

    const intervals: Record<'1W' | '1M' | '3M' | '6M' | '1Y', { from: string, to: string }> = {
        '1W': { from: '2024-09-20', to: '2024-09-27' },
        '1M': { from: '2024-07-23', to: '2024-08-23' },
        '3M': { from: '2024-05-23', to: '2024-08-23' },
        '6M': { from: '2024-02-23', to: '2024-08-23' },
        '1Y': { from: '2023-08-23', to: '2024-08-23' },
    };

    useEffect(() => {
        if (chartContainerRef.current) {
            const chartOptions: DeepPartial<ChartOptions> = {
                layout: { textColor: 'white', background: { type: ColorType.Solid, color: 'transparent' }},
                grid: { vertLines: { color: '#2c2c2e' }, horzLines: { color: '#2c2c2e' }},
                rightPriceScale: { borderColor: '#485c7b' },
                timeScale: { borderColor: '#485c7b' },
                crosshair: { horzLine: { visible: false } }
            };

            const chart = createChart(chartContainerRef.current, chartOptions);
            chartRef.current = chart;

            // Subscribe to crosshair move to show labels
            chart.subscribeCrosshairMove(param => {
                if (!param.time) {
                    setLegendHTML(''); // Clear legend when no time is hovered
                    return;
                }

                const visibleTickers: { symbol: string, price: string, color: string }[] = [];

                tickers.forEach(ticker => {
                    const seriesData = param.seriesData.get(series[ticker.symbol]);
                    if (!seriesData) return;

                    let price: number | null = null;
                    if ('value' in seriesData) price = seriesData.value;
                    else if ('close' in seriesData) price = seriesData.close;

                    if (price !== null) {
                        visibleTickers.push({
                            symbol: ticker.symbol,
                            price: price.toFixed(2),
                            color: ticker.color
                        });
                    }
                });

                // Sort the labels to avoid overlap
                visibleTickers.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

                // Build the HTML for the legend labels
                let newLegendHTML = '';
                visibleTickers.forEach(ticker => {
                    newLegendHTML += `<div class="legend-box" style="color: ${ticker.color}; border: 1px solid ${ticker.color};">
                                        ${ticker.symbol}: ${ticker.price}%
                                      </div>`;
                });

                // Update the legend HTML with the new labels
                setLegendHTML(newLegendHTML);
            });

            tickers.forEach(async ticker => {
                const lineSeries = chart.addLineSeries({ color: ticker.color });
                const data = await fetchData(ticker.symbol, intervals[currentInterval].from, intervals[currentInterval].to);
                lineSeries.setData(data);
                setSeries(prev => ({ ...prev, [ticker.symbol]: lineSeries }));
                chart.timeScale().fitContent();
            });

            return () => {
                chart.remove();
            };
        }
    }, [currentInterval]);

    return (
        <div className="chart-wrapper">
            <div className="chart-container" ref={chartContainerRef}></div>

        </div>
    );
};

export default SectorChart;
