import React, {useMemo, useRef, useState} from 'react';
import './App.css';
import {Task, ViewMode} from "./types/public-types";
import {Gantt} from "./components/gantt/gantt";
import {parseGanttJson, parseInventoryJson} from "./helpers/parsers";
// @ts-ignore
import autocolors from 'chartjs-plugin-autocolors';
// @ts-ignore
import Hammer from "hammerjs";


import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Zoom from 'chartjs-plugin-zoom';

import {Line} from 'react-chartjs-2';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Zoom,
  autocolors
);


function App() {
  const [tasks, setTasks] = React.useState<Task[]>(parseGanttJson());
  const lineChart = useRef(null);

  const handleTaskChange = (task: Task) => {
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    setTasks(newTasks);
  };

  const [viewMode, setViewMode] = useState(ViewMode.Day)
  // @ts-ignore
  const columnWidth = viewMode === ViewMode.Month ? 500 : viewMode === ViewMode.Week ? 300 : 65

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          drag: {
            enabled: true,
            mode: 'x',
            modifierKey: 'shift'
          },
        }
      }
    },
  };

  const {labels, mates, mateData} = useMemo(parseInventoryJson, [])

  const datasets = Object.entries(mateData).map(([mate, counts]) => ({
    label: mate,
    data: counts,
  }))

  const data = {
    labels,
    datasets
  }

  const handleResetZoom = () => {
    if (lineChart.current) {
      // @ts-ignore
      lineChart.current.resetZoom()
    }
  };

  const hideAll = () => {
    // @ts-ignore
    mates.forEach((m, i) => lineChart.current.hide(i))
  }

  const showAll = () => {
    // @ts-ignore
    mates.forEach((m, i) => lineChart.current.show(i))
  }

  return (
    <div className="App">

      <div style={{
        marginBottom: 100,
        display: "block",
        width: 1000,
        marginLeft: "auto",
        marginRight: 'auto',
      }}>
        {/*@ts-ignore*/}
        <Line options={options} data={data} ref={lineChart}/>
        <p>
          <i>*Hold shift to zoom on selection</i>
          <button style={{marginLeft: 30}} onClick={handleResetZoom}>Reset Zoom</button>
          <button style={{marginLeft: 10}} onClick={hideAll}>Hide All</button>
          <button style={{marginLeft: 10}} onClick={showAll}>Show All</button>

          <br/>
          <br/>

          <i>Select time frame: </i>
          <button onClick={() => setViewMode(ViewMode.Day)} style={{marginLeft: 10}}>Day</button>
          <button style={{marginLeft: 10}} onClick={() => setViewMode(ViewMode.Week)}>Week</button>
          <button style={{marginLeft: 10}} onClick={() => setViewMode(ViewMode.Month)}>Month</button>
        </p>
      </div>
      <Gantt
        tasks={tasks}
        listCellWidth={"250"}
        onDateChange={handleTaskChange}
        viewMode={viewMode}
        columnWidth={columnWidth}
      />
    </div>
  );
}

export default App;
