import React, { useEffect, useRef, useState } from 'react';
import './SectorChart.css';
import {
    createChart,
    IChartApi,
    ISeriesApi,
    LineData,
    HistogramData,
  } from "lightweight-charts";
  import axios from "axios";

const SectorChart: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRefs = useRef<{ [key: string]: ISeriesApi<'Line'> }>({}); // Store series references

    // Component state
    const [currentInterval, setCurrentInterval] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('1W');
    const [legendHTML, setLegendHTML] = useState<string>(''); // Legend content

    // Define tickers and colors
    const tickers = [
        { symbol: 'SPY', color: 'rgb(44, 130, 201)' },
        { symbol: 'XLC', color: 'rgb(239, 83, 80)' },
        { symbol: 'XLY', color: 'rgb(124, 179, 66)' },
        { symbol: 'XLP', color: 'rgb(255, 202, 40)' },
        { symbol: 'XLE', color: 'rgb(126, 87, 194)' },
        { symbol: 'XLF', color: 'rgb(0, 188, 212)' },
        { symbol: 'XLV', color: 'rgb(255, 87, 34)' },
        { symbol: 'XLI', color: 'rgb(171, 71, 188)' },
        { symbol: 'XLB', color: 'rgb(76, 175, 80)' },
        { symbol: 'XLRE', color: 'rgb(156, 39, 176)' },
        { symbol: 'XLK', color: 'rgb(255, 235, 59)' },
        { symbol: 'XLU', color: 'rgb(33, 150, 243)' },
    ];

    // Helper function to fetch data
    const fetchData = async (ticker: string, from: string, to: string): Promise<LineData<Time>[]> => {
        const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX';
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) return [];

        const firstValue = data.results[0].c;
        return data.results.map((item: any) => ({
            time: (item.t / 1000) as Time,
            value: ((item.c - firstValue) / firstValue) * 100, // Percentage change
        }));
    };

    // Update chart data on interval change
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart if not already created
        if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                layout: { textColor: 'white', background: { color: 'transparent' } },
                grid: { vertLines: { color: '#2c2c2e' }, horzLines: { color: '#2c2c2e' } },
                rightPriceScale: { borderColor: '#485c7b' },
                timeScale: { borderColor: '#485c7b' },
            });
        }

        // Define interval ranges
        const today = new Date();
        const to = today.toISOString().split('T')[0];
        const from = new Date(today);

        switch (currentInterval) {
            case '1W':
                from.setDate(today.getDate() - 7);
                break;
            case '1M':
                from.setMonth(today.getMonth() - 1);
                break;
            case '3M':
                from.setMonth(today.getMonth() - 3);
                break;
            case '6M':
                from.setMonth(today.getMonth() - 6);
                break;
            case '1Y':
                from.setFullYear(today.getFullYear() - 1);
                break;
        }

        const fromISO = from.toISOString().split('T')[0];

        // Fetch and set data for each ticker
        tickers.forEach(async ({ symbol, color }) => {
            if (!chartRef.current) return;

            if (!seriesRefs.current[symbol]) {
                seriesRefs.current[symbol] = chartRef.current.addLineSeries({ color });
            }

            const data = await fetchData(symbol, fromISO, to);
            seriesRefs.current[symbol].setData(data);
            chartRef.current.timeScale().fitContent();
        });

        // Clean up chart on unmount
        return () => {
            chartRef.current?.remove();
            chartRef.current = null;
        };
    }, [currentInterval, tickers]);

    // Crosshair move logic for updating legend
    useEffect(() => {
        if (!chartRef.current) return;

        chartRef.current.subscribeCrosshairMove(param => {
            if (!param.time) {
                setLegendHTML('');
                return;
            }

            const legend = tickers
                .map(({ symbol, color }) => {
                    const seriesData = param.seriesData.get(seriesRefs.current[symbol]);
                    if (!seriesData || typeof seriesData.value !== 'number') return null;

                    return `<div style="color: ${color}; margin-right: 10px;">
                                ${symbol}: ${seriesData.value.toFixed(2)}%
                            </div>`;
                })
                .filter(Boolean)
                .join('');
            setLegendHTML(legend);
        });
    }, [tickers]);

    return (
        <div className="sector-chart">
            <div className="chart-container" ref={chartContainerRef}></div>
            <div className="legend-container" dangerouslySetInnerHTML={{ __html: legendHTML }}></div>
            <div className="interval-buttons">
                {['1W', '1M', '3M', '6M', '1Y'].map(interval => (
                    <button
                        key={interval}
                        className={`interval-button ${currentInterval === interval ? 'active' : ''}`}
                        onClick={() => setCurrentInterval(interval as '1W' | '1M' | '3M' | '6M' | '1Y')}
                    >
                        {interval}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SectorChart;
