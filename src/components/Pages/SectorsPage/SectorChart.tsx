import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, LineData, LineSeriesPartialOptions, DeepPartial, ChartOptions, ColorType } from 'lightweight-charts';

interface SectorChartProps {
    tickers: { symbol: string, color: string }[];
    currentInterval: '1M' | '3M' | '6M' | '1Y';
    setLegendHTML: React.Dispatch<React.SetStateAction<string>>;
    setSeries: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
    series: { [key: string]: any }; 
}

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

const SectorChart: React.FC<SectorChartProps> = ({ tickers, currentInterval, setLegendHTML, setSeries, series }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    const intervals: Record<'1M' | '3M' | '6M' | '1Y', { from: string, to: string }> = {
        '1M': { from: '2024-07-23', to: '2024-08-23' },
        '3M': { from: '2024-05-23', to: '2024-08-23' },
        '6M': { from: '2024-02-23', to: '2024-08-23' },
        '1Y': { from: '2023-08-23', to: '2024-08-23' },
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

            const legend = document.createElement('div');
            Object.assign(legend.style, {
                position: 'absolute',
                left: '12px',
                bottom: '12px',
                zIndex: '1',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                lineHeight: '18px',
                fontWeight: '300',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '5px',
                borderRadius: '5px',
            });
            chartContainerRef.current.appendChild(legend);

            chartRef.current.subscribeCrosshairMove(param => {
                if (!param.time) {
                    setLegendHTML('');
                    return;
                }

                let updatedLegendHTML = '';
                tickers.forEach(ticker => {
                    const seriesData = param.seriesData.get(series[ticker.symbol]);

                    if (!seriesData) return;

                    let price: number | null = null;
                    if ('value' in seriesData) price = seriesData.value;
                    else if ('close' in seriesData) price = seriesData.close;

                    if (price !== null) {
                        updatedLegendHTML += `<div><strong style="color:${ticker.color}">${ticker.symbol}</strong>: ${price.toFixed(2)}</div>`;
                    }
                });

                setLegendHTML(updatedLegendHTML);
            });

            const addSeriesToChart = async (ticker: string, color: string) => {
                const seriesOptions: LineSeriesPartialOptions = { color };
                const lineSeries = chartRef.current?.addLineSeries(seriesOptions);
                const { from, to } = intervals[currentInterval];
                const data = await fetchData(ticker, from, to);
                lineSeries?.setData(data);
                setSeries(prev => ({ ...prev, [ticker]: lineSeries }));
            };

            tickers.forEach(ticker => addSeriesToChart(ticker.symbol, ticker.color));

            chartRef.current.timeScale().fitContent();
        }

        return () => chartRef.current?.remove();
    }, [currentInterval]);

    return (
        <>
            <div id="container" ref={chartContainerRef} style={{ width: '90%', height: 'calc(100% - 220px)', marginBottom: '20px', position: 'relative' }}></div>
            <div id="legend" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: setLegendHTML }} />
        </>
    );
};

export default SectorChart;
