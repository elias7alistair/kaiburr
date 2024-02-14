import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';


const Chart = ({ selectedRows, data }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (selectedRows.length > 0 && data.length > 0) {
      const selectedData = data.filter(item => selectedRows.includes(item.id));
      
      const xValues = selectedData.map((item) => item.title);
      const yValues1 = selectedData.map((item) => item.price);
      const yValues2 = selectedData.map((item) => item.rating);

      setChartData({
        x: xValues,
        y1: yValues1,
        y2: yValues2
      });
    } else {
      setChartData({});
    }
  }, [selectedRows, data]);

  return (
    <div className="ChartContainer"> 
      <div className="Chart">
        {selectedRows.length > 0 ? (
          <Plot
            data={[
              {
                type: 'bar',
                x: chartData.x,
                y: chartData.y1,
                name: 'Price',
                marker: { color: 'blue' }
              },
              {
                type: 'bar',
                x: chartData.x,
                y: chartData.y2,
                name: 'Rating',
                marker: { color: 'orange' }
              }
            ]}
            layout={{ width: 800, height: 400, title: 'Products Chart', barmode: 'group' }}
          />
        ) : (
          <p>No data selected.</p>
        )}
      </div>
    </div>
  );
};

export default Chart;
