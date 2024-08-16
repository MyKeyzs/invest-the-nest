import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
} from 'react-financial-charts';

interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema12?: number;  
  ema26?: number; 
  bullPower?: number; 
  bearPower?: number;
}

interface CalculatedValues {
  bullPower: number;
  bearPower: number;
}

interface ChartProps {
  ticker: string;
}

interface ExtendedStockData extends StockData {
  bullPower: number;
  bearPower: number;
}

const ChartComponent: React.FC<ChartProps> = ({ ticker }) => {
  const [chartData, setChartData] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-01/2024-01-01`, {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        const data = response.data.results.map((result: any) => ({
          date: new Date(result.t),
          open: result.o,
          high: result.h,
          low: result.l,
          close: result.c,
          volume: result.v,
        }));

        setChartData(data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Error fetching chart data. Please try again later.');
      }
    };

    fetchChartData();
  }, [ticker]);

  if (chartData.length === 0) {
    return <p>Loading chart data...</p>;
  }

  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: StockData) => d.date);
  const height = 700;
  const width = 900;
  const margin = { left: 0, right: 48, top: 0, bottom: 24 };

  const ema12 = ema()
  .id(1)
  .options({ windowSize: 12 })
  .merge((d: StockData, c: number) => {
    d.ema12 = c;
  })
  .accessor((d: StockData) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d: StockData, c: number) => {
      d.ema26 = c;
    })
    .accessor((d: StockData) => d.ema26);

    const elder = elderRay()
  .merge((d: StockData, calculated: CalculatedValues) => {
    d.bullPower = calculated.bullPower;
    d.bearPower = calculated.bearPower;
  })
  .accessor((d: StockData) => ({ bullPower: d.bullPower, bearPower: d.bearPower }));

  const calculatedData = elder(ema26(ema12(chartData)));
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(calculatedData);
  const pricesDisplayFormat = format('.2f');
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;

  const elderRayHeight = 100;
  const elderRayOrigin = (_: any, h: number) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (_: any, h: number) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;
  const yExtents = (data: StockData) => [data.high, data.low];
  const dateTimeFormat = '%d %b';
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  const barChartExtents = (data: StockData) => data.volume;

  const candleChartExtents = (data: StockData) => [data.high, data.low];

  const yEdgeIndicator = (data: StockData) => data.close;

  const volumeColor = (data: StockData) => (data.close > data.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)');

  const volumeSeries = (data: StockData) => data.volume;

  const openCloseColor = (data: StockData) => (data.close > data.open ? '#26a69a' : '#ef5350');

  return (
    <div className="chart-container">
      <h2 className="chart-title">{ticker} Chart</h2>
      <ChartCanvas
        height={height}
        ratio={3}
        width={width}
        margin={margin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="Data"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
      >
        <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
          <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
        </Chart>
        <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
          <XAxis showGridLines showTickLabel={false} />
          <YAxis showGridLines tickFormat={pricesDisplayFormat} />
          <CandlestickSeries />
          <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
          <CurrentCoordinate yAccessor={ema26.accessor()} fillStyle={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
          <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema12.stroke()} />
          <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />
          <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={openCloseColor}
            lineStroke={openCloseColor}
            displayFormat={pricesDisplayFormat}
            yAccessor={yEdgeIndicator}
          />
          <MovingAverageTooltip
            origin={[8, 24]}
            options={[
              {
                yAccessor: ema26.accessor(),
                type: 'EMA',
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize,
              },
              {
                yAccessor: ema12.accessor(),
                type: 'EMA',
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize,
              },
            ]}
          />
          <ZoomButtons />
          <OHLCTooltip origin={[8, 16]} />
        </Chart>
        <Chart id={4} height={elderRayHeight} yExtents={[0, elder.accessor()]} origin={elderRayOrigin} padding={{ top: 8, bottom: 8 }}>
          <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
          <YAxis ticks={4} tickFormat={pricesDisplayFormat} />
          <MouseCoordinateX displayFormat={timeDisplayFormat} />
          <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />
          <ElderRaySeries yAccessor={elder.accessor()} />
          <SingleValueTooltip
            yAccessor={elder.accessor()}
            yLabel="Elder Ray"
            yDisplayFormat={(value: number) => `${pricesDisplayFormat(value)}`} // Adjust to meet the expected signature
            origin={[8, 16]}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </div>
  );
};

export default ChartComponent;
