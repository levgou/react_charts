import React, {useRef, useState} from 'react';
import './App.css';
import {Task, ViewMode} from "./types/public-types";
import {DateSetup} from "./types/date-setup";
import {ganttDateRange, seedDates} from "./helpers/date-helper";
import {Grid} from "./components/grid/grid";
import {Gantt} from "./components/gantt/gantt";

export function initTasks() {
    const currentDate = new Date();
    const tasks: Task[] = [
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                2,
                12,
                28
            ),
            name: "Idea",
            id: "Task 0",
            progress: 0,
            type: "task",
            project: "ProjectSample",
            displayOrder: 2,
            rowIndex: 0,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
            name: "Research",
            id: "Task 1",
            progress: 0,
            type: "task",
            project: "ProjectSample",
            displayOrder: 3,
            rowIndex: 1,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
            name: "Discussion with team",
            id: "Task 2",
            progress: 0,
            type: "task",
            project: "ProjectSample",
            displayOrder: 4,
            rowIndex: 2,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
            name: "Developing",
            id: "Task 3",
            progress: 0,
            type: "task",
            project: "ProjectSample",
            displayOrder: 5,
            rowIndex: 3,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
            name: "Review",
            id: "Task 4",
            type: "task",
            progress: 0,
            project: "ProjectSample",
            displayOrder: 6,
            rowIndex: 4,
        },
    ];
    return tasks;
}

function App() {
    const [tasks, setTasks] = React.useState<Task[]>(initTasks());

    const handleTaskChange = (task: Task) => {
        let newTasks = tasks.map(t => (t.id === task.id ? task : t));
        setTasks(newTasks);
    };

    return (
        <div className="App">
            <Gantt tasks={tasks} listCellWidth={"250"} onDateChange={handleTaskChange}/>
        </div>
    );
}

export default App;
