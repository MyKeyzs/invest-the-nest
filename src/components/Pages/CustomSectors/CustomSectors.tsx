import React, { useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GetDetailRowDataParams, ValueFormatterParams, CellStyle } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Mock Data
const sectorsData = [
  {
    sector: 'American Indices',
    description: 'Tracks large-cap US equities.',
    tickers: [
      { ticker: 'SPY', price: '$400', pnl: '+2.5%', totalValue: '$20,000', instrument: 'ETF' },
      { ticker: 'QQQ', price: '$300', pnl: '+1.2%', totalValue: '$15,000', instrument: 'ETF' },
      { ticker: 'IWM', price: '$200', pnl: '-0.8%', totalValue: '$10,000', instrument: 'ETF' },
    ],
  },
  {
    sector: 'European Indices',
    description: 'Tracks large-cap European equities.',
    tickers: [
      { ticker: 'DAX', price: '€15,000', pnl: '+1.5%', totalValue: '€25,000', instrument: 'ETF' },
      { ticker: 'FTSE', price: '£7,000', pnl: '+0.5%', totalValue: '£10,000', instrument: 'ETF' },
    ],
  },
];

// Custom Theme
const gridTheme = 'ag-theme-alpine';

const CustomSectors: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData] = useState(sectorsData);

  // Parent Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'sector',
        headerName: 'Sector',
        cellRenderer: 'agGroupCellRenderer',
        headerClass: 'header-sector',
        minWidth: 200,
      },
      {
        field: 'description',
        headerName: 'Description',
        editable: true,
        cellEditor: 'agTextCellEditor',
        flex: 2,
        tooltipField: 'description',
        cellStyle: (params: ValueFormatterParams): CellStyle => {
          if (params.value) {
            return { color: '#ccc', fontStyle: 'italic' };
          }
          return { color: '#888', fontStyle: 'normal' };
        },
      },
      {
        field: 'averageReturn',
        headerName: 'Average Return',
        valueGetter: (params: { data: { tickers: { pnl: string }[] } }) => {
          const tickers = params.data?.tickers || [];
          const pnlValues = tickers
            .map((ticker: { pnl: string }) => parseFloat(ticker.pnl.replace('%', '') || '0'))
            .filter((value: number) => !isNaN(value));

          if (pnlValues.length === 0) return 'N/A';
          const average = pnlValues.reduce((sum: number, val: number) => sum + val, 0) / pnlValues.length;
          return `${average.toFixed(2)}%`;
        },
        flex: 1,
        cellStyle: (params: ValueFormatterParams): CellStyle => {
          const value = parseFloat(params.value?.replace('%', '') || '0');
          if (value > 0) {
            return { color: 'lightgreen', fontWeight: 'bold' };
          } else if (value < 0) {
            return { color: 'red', fontWeight: 'bold' };
          }
          return {};
        },
      },
    ],
    []
  );

  // Detail Grid Column Definitions
  const detailColumnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'ticker', headerName: 'Ticker', flex: 1 },
      { field: 'price', headerName: 'Price', maxWidth: 120 },
      { field: 'instrument', headerName: 'Instrument', maxWidth: 100 },
      {
        field: 'pnl',
        headerName: 'P&L',
        maxWidth: 80,
        cellStyle: (params: ValueFormatterParams): CellStyle => {
          const value = parseFloat(params.value?.replace('%', '') || '0');
          return value > 0
            ? { color: 'lightgreen', fontWeight: 'bold' }
            : value < 0
            ? { color: 'red', fontWeight: 'bold' }
            : {};
        },
      },
      { field: 'totalValue', headerName: 'Total Value', flex: 1 },
    ],
    []
  );

  // Detail Cell Renderer Parameters
  const detailCellRendererParams = useMemo(() => {
    return {
      detailGridOptions: {
        columnDefs: detailColumnDefs,
      },
      getDetailRowData: (params: GetDetailRowDataParams) => {
        params.successCallback(params.data.tickers);
      },
    };
  }, [detailColumnDefs]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#FFF' }}>Custom Sectors</h1>
      <div style={{ height: '600px', width: '100%' }} className={gridTheme}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
          defaultColDef={{ resizable: true }}
          rowHeight={60}
          detailRowAutoHeight={true}
          animateRows={true}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default CustomSectors;
