import React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useTree } from "@table-library/react-table-library/tree";
import './CustomSectors.css'

interface SectorNode {
  id: string;
  name: string;
  description?: string;
  type?: string;
  isComplete: boolean;
  nodes: SectorNode[];
}

interface TreeAction {
  type: string;
  id: string;
}

interface TreeState {
  expandedIds: string[];
}

const CustomSectors: React.FC = () => {
  const data = {
    nodes: [
      {
        id: "1",
        name: "American Indices",
        description: "Tracks large-cap US equities.",
        isComplete: false,
        nodes: [
          {
            id: "1-1",
            name: "SPY",
            type: "ETF",
            isComplete: true,
            nodes: [],
          },
          {
            id: "1-2",
            name: "QQQ",
            type: "ETF",
            isComplete: false,
            nodes: [],
          },
        ],
      },
      {
        id: "2",
        name: "European Indices",
        description: "Tracks large-cap European equities.",
        isComplete: false,
        nodes: [
          {
            id: "2-1",
            name: "DAX",
            type: "ETF",
            isComplete: true,
            nodes: [],
          },
          {
            id: "2-2",
            name: "FTSE",
            type: "ETF",
            isComplete: false,
            nodes: [],
          },
        ],
      },
    ],
  };

  const theme = useTheme(getTheme());

  const tree = useTree<SectorNode>(data, {
    onChange: onTreeChange,
  });

  function onTreeChange(action: any, state: any) {
    console.log("Tree Action:", action);
    console.log("Tree State:", state);
  }

  const COLUMNS = [
    {
      label: "Sector",
      renderCell: (item: SectorNode) => item.name,
      tree: true,
    },
    {
      label: "Description",
      renderCell: (item: SectorNode) => item.description || "N/A",
    },
    {
      label: "Type",
      renderCell: (item: SectorNode) => item.type || "N/A",
    },
    {
      label: "Complete",
      renderCell: (item: SectorNode) => (item.isComplete ? "Yes" : "No"),
    },
    {
      label: "Tasks",
      renderCell: (item: SectorNode) => (item.nodes ? item.nodes.length : "-"),
    },
  ];

  return (
    <div className="custom-sectors-table-container">
      <table className="custom-sectors-table">
        <CompactTable columns={COLUMNS} data={data} theme={theme} tree={tree} />
        </table>
      </div>
  );
};

export default CustomSectors;
