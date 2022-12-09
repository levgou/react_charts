import ganttData from '../gantt.json'
import {Task} from "../types/public-types";

export interface MachineTask extends Task {
  recipe: string,
  machine: string
}

export const parseGanttJson = () =>
  ganttData.map(item => ({
    machine: item.machine,
    recipe: item.recipe,
    id: `${item.machine}_${item.recipe}`,
    type: 'task',
    name: item.recipe,
    rowIndex: 0,
    start: new Date(item.start),
    end: new Date(item.end),
    progress: 0,
  } as MachineTask))
