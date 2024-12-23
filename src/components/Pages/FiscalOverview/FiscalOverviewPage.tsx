import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Sidebar from "../../SidebarComponent/Sidebar"; // Import your Sidebar component
import FiscalOverviewChart from "./FiscalOverviewChart";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import CentralBankRate from "./CentralBankRate";

const ResponsiveGridLayout = WidthProvider(Responsive);

const FiscalOverviewPage: React.FC = () => {

  const layouts = {
    lg: [
      { i: "chart", x: 0, y: 0, w: 12, h: 4, static: true },
      { i: "cell1", x: 0, y: 1, w: 4, h: 4.1 },
      { i: "cell2", x: 4, y: 1, w: 4, h: 4.1 },
      { i: "cell3", x: 8, y: 1, w: 4, h: 4.1 },
      { i: "cell4", x: 0, y: 2, w: 4, h: 4.1 },
      { i: "cell5", x: 4, y: 2, w: 4, h: 4.1 },
      { i: "cell6", x: 8, y: 2, w: 4, h: 4.1 },
    ],
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
    

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        <h1 style={{ textAlign: "center", padding: "20px", marginLeft: "200px" }}>Fiscal Overview</h1>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          isDraggable={true}
          isResizable={false}
        >
          <div key="chart" style={{ backgroundColor: "#2d3748" }}>
            <FiscalOverviewChart/></div>
          <div key="cell1" style={{ color: "#fff" }}><CentralBankRate/></div>
          <div key="cell2" style={{ color: "#fff" }}>Cell 2</div>
          <div key="cell3" style={{ color: "#fff" }}>Cell 3</div>
          <div key="cell4" style={{ color: "#fff" }}>Cell 4</div>
          <div key="cell5" style={{ color: "#fff" }}>Cell 5</div>
          <div key="cell6" style={{ color: "#fff" }}>Cell 6</div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default FiscalOverviewPage;
