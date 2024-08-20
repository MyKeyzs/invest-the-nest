import React from "react";
import { format } from "d3-format";
import { GenericChartComponent, last } from "@react-financial-charts/core";
import { ToolTipText, ToolTipTSpanLabel } from "@react-financial-charts/tooltip";

const displayTextsDefault = {
  o: "O: ",
  h: " H: ",
  l: " L: ",
  c: " C: ",
  na: " n/a ",
  v: " \xa0 Vol: "
};

interface OHLCTooltipProps {
  accessor: (d: any) => any;
  changeFormat: (n: number) => string;
  className?: string;
  displayTexts?: typeof displayTextsDefault;
  displayValuesFor: (props: any, moreProps: any) => any;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  labelFill?: string;
  labelFontWeight?: number;
  ohlcFormat: (n: number) => string;
  onClick?: () => void;
  origin?: [number, number];
  percentFormat: (n: number) => string;
  textFill?: (d: any) => string;
  volumeFormat: (n: number) => string;
  x: number;
  y: number;
  show: boolean;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export const OHLCTooltip: React.FC<OHLCTooltipProps> = (props) => {
  const renderSVG = (moreProps: any) => {
    console.log("OHLCTooltip is rendering");
    const {
      accessor,
      changeFormat,
      className,
      displayTexts = displayTextsDefault,
      displayValuesFor,
      fontFamily,
      fontSize,
      fontWeight,
      labelFill,
      labelFontWeight,
      ohlcFormat,
      onClick,
      origin: originProp = [0, 0],
      percentFormat,
      textFill,
      volumeFormat,
    } = props;
  
    const {
      chartConfig, // Removed width and height destructuring
      fullData
    } = moreProps;
  
    const currentItem = displayValuesFor(props, moreProps) || last(fullData);
    console.log("Current Item:", currentItem);  // Debugging: Log the current item data

    let open = displayTexts.na;
    let high = displayTexts.na;
    let low = displayTexts.na;
    let close = displayTexts.na;
    let change = displayTexts.na;
    let volume = displayTexts.na;

    if (currentItem !== undefined && accessor !== undefined) {
      const item = accessor(currentItem);
      if (item !== undefined) {
        console.log("OHLC Data:", item);  // Debugging: Log the OHLC data

        open = ohlcFormat(item.open);
        high = ohlcFormat(item.high);
        low = ohlcFormat(item.low);
        close = ohlcFormat(item.close);
        change = `${changeFormat(item.close - item.open)} (${percentFormat(
          (item.close - item.open) / item.open
        )})`;
        volume = volumeFormat(item.volume);
      }
    }

    const [x, y] = originProp;
    const valueFill = textFill ? textFill(currentItem) : "#ffffff";

    return (
      <g
        className={className}
        transform={`translate(${x}, ${y})`}
        onClick={onClick}
      >
        <ToolTipText
          x={0}
          y={0}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
        >
          <ToolTipTSpanLabel fill={labelFill} fontWeight={labelFontWeight}>
            {displayTexts.o}
          </ToolTipTSpanLabel>
          <tspan fill={valueFill}>{open}</tspan>
          <ToolTipTSpanLabel fill={labelFill} fontWeight={labelFontWeight}>
            {displayTexts.h}
          </ToolTipTSpanLabel>
          <tspan fill={valueFill}>{high}</tspan>
          <ToolTipTSpanLabel fill={labelFill} fontWeight={labelFontWeight}>
            {displayTexts.l}
          </ToolTipTSpanLabel>
          <tspan fill={valueFill}>{low}</tspan>
          <ToolTipTSpanLabel fill={labelFill} fontWeight={labelFontWeight}>
            {displayTexts.c}
          </ToolTipTSpanLabel>
          <tspan fill={valueFill}>{close}</tspan>
          <tspan fill={valueFill}>{` ${change}`}</tspan>
          <ToolTipTSpanLabel fill={labelFill} fontWeight={labelFontWeight}>
            {displayTexts.v}
          </ToolTipTSpanLabel>
          <tspan fill={valueFill}>{volume}</tspan>
        </ToolTipText>
      </g>
    );
  };

  return (
    <GenericChartComponent
      clip={false}
      svgDraw={renderSVG}
      drawOn={["mousemove"]}
    />
  );
};

OHLCTooltip.defaultProps = {
  accessor: (d: any) => d,
  changeFormat: format("+.2f"),
  className: "react-financial-charts-tooltip-hover",
  displayTexts: displayTextsDefault,
  displayValuesFor: (_: any, props: any) => props.currentItem,
  fontFamily: "-apple-system, system-ui, 'Helvetica Neue', Ubuntu, sans-serif",
  fontSize: 12,
  fontWeight: 300,
  labelFill: "#9EAAC7",
  labelFontWeight: 300,
  ohlcFormat: format(".2f"),
  percentFormat: format("+.2%"),
  volumeFormat: format(".4s"),
};
