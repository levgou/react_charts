import ganttData from '../gantt.json'
import inventoryData from '../inventory.json'
import {Task} from "../types/public-types";

function dateRangeOverlaps(a_start: Date, a_end: Date, b_start: Date, b_end: Date) {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

export interface MachineTask extends Task {
  recipe: string,
  machine: string
}

export const parseGanttJson = () => {
  const tasks = ganttData.map(item => ({
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

  const machines = Array.from(new Set(tasks.map(t => (t as MachineTask).machine))).sort()

  const tasksGroupedByMachine: { [key: string]: MachineTask[] } = {}
  machines.forEach(m => tasksGroupedByMachine[m] = [])
  tasks.forEach(t => tasksGroupedByMachine[t.machine].push(t))

  // assume we wont need more than 2 rows per machine for simplicity
  Object.entries(tasksGroupedByMachine).forEach(([machine, machineTasks], index) => {
    machineTasks.forEach(mt => {
      mt.rowIndex = index * 2
    })

    machineTasks.forEach(mt => {
      const intersectsWithOtherTask = machineTasks.some(otherTask => {
        if (mt.recipe === otherTask.recipe && mt.machine === otherTask.machine) {
          return false
        }
        return dateRangeOverlaps(mt.start, mt.end, otherTask.start, otherTask.end) && mt.rowIndex === otherTask.rowIndex
      })

      if (intersectsWithOtherTask) {
        mt.rowIndex += 1
      }
    })

  })

  return tasks
}

export const parseInventoryJson = () => {
  const labels = Object.keys(inventoryData)
  const mates = Array.from(new Set(Object.values(inventoryData).map(dateDate => Object.keys(dateDate)).flat())).sort()
  const mateData: { [key: string]: number[] } = {}
  mates.forEach(m => mateData[m] = [])

  Object.values(inventoryData).forEach(dateData => {
    for (const [mate, count] of Object.entries(dateData)) {
      mateData[mate].push(count)
    }
  })

  return {labels, mates, mateData}
}