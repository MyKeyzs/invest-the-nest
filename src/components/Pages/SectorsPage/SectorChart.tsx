import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, LineSeriesPartialOptions, DeepPartial, ChartOptions, ColorType, Time } from 'lightweight-charts';
import './SectorChart.css';  // Import the chart-specific CSS
interface SectorChartProps {
    tickers: { symbol: string, color: string }[];
    currentInterval: '1W'|'1M' | '3M' | '6M' | '1Y';
    setLegendHTML: React.Dispatch<React.SetStateAction<string>>;
    setSeries: React.Dispatch<React.SetStateAction<{ [key: string]: ISeriesApi<'Line'> }>>;
    series: { [key: string]: ISeriesApi<'Line'> }; 
}

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

const SectorChart: React.FC<SectorChartProps> = ({ tickers, currentInterval, setLegendHTML, setSeries, series }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    const intervals: Record< '1W'|'1M' | '3M' | '6M' | '1Y', { from: string, to: string }> = {
        '1W': { from: '2024-09-20', to: '2024-09-27'},
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
                    horzLines: { color: '#2c2c2e' },
                },
                rightPriceScale: {
                    borderColor: '#485c7b',
                },
                timeScale: {
                    borderColor: '#485c7b',
                },
                crosshair: {
                    horzLine: { visible: false },
                },
            };

            const chart = createChart(chartContainerRef.current, chartOptions);
            chartRef.current = chart;

            const legend = document.createElement('div');
            legend.className = 'chart-legend';
            chartContainerRef.current.appendChild(legend);

            chart.subscribeCrosshairMove(param => {
                if (!param.time) {
                    setLegendHTML('');
                    return;
                }

                let legendHTML = '';
                tickers.forEach(ticker => {
                    const seriesData = param.seriesData.get(series[ticker.symbol]);
                    if (!seriesData) return;

                    let price: number | null = null;
                    if ('value' in seriesData) price = seriesData.value;
                    else if ('close' in seriesData) price = seriesData.close;

                    if (price !== null) {
                        legendHTML += `<div style="color:${ticker.color};">${ticker.symbol}: ${price.toFixed(2)}%</div>`;
                    }
                });

                setLegendHTML(legendHTML);
            });

            const addSeriesToChart = async (ticker: string, color: string) => {
                const seriesOptions: LineSeriesPartialOptions = { color };
                const lineSeries = chart.addLineSeries(seriesOptions) as ISeriesApi<'Line'>;
                const { from, to } = intervals[currentInterval];
                const data = await fetchData(ticker, from, to);
                lineSeries.setData(data);
                setSeries(prev => ({ ...prev, [ticker]: lineSeries }));
                chart.timeScale().fitContent();
            };

            tickers.forEach(ticker => addSeriesToChart(ticker.symbol, ticker.color));

            return () => {
                chart.remove();
            };
        }
    }, [currentInterval]);

    return (
        <div className="chart-wrapper">
            <div className="chart-container" ref={chartContainerRef}></div>
            <div className="chart-legend" />
            </div>
    );
};

export default SectorChart;
