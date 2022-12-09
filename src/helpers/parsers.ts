import ganttData from '../gantt.json'
import inventoryData from '../inventory.json'
import {Task} from "../types/public-types";
import {getWeekNumberISO8601, toMonthName} from "./date-helper";

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
  const labelsDay = Object.keys(inventoryData)

  const dates = labelsDay.map(d => new Date(d))
  const mates = Array.from(new Set(Object.values(inventoryData).map(dateDate => Object.keys(dateDate)).flat())).sort()

  const labelsWeek = Array.from(new Set(dates.map(d => getWeekNumberISO8601(d)))).sort()
  const labelsMonth = Array.from(new Set(dates.map(d => d.getMonth() + 1))).sort().map(toMonthName)

  const mateDataDay: { [key: string]: number[] } = {}
  const mateDataWeek: { [key: string]: number[] } = {}
  const mateDataMonth: { [key: string]: number[] } = {}

  const mateDataWeekTmp: { [key: string]: { [key: string]: number } } = {}
  const mateDataMonthTmp: { [key: string]: { [key: string]: number } } = {}

  mates.forEach(m => {
    mateDataDay[m] = []
    mateDataWeek[m] = []
    mateDataMonth[m] = []
    mateDataMonthTmp[m] = {}
    mateDataWeekTmp[m] = {}
  })

  Object.values(inventoryData).forEach(dateData => {
    for (const [mate, count] of Object.entries(dateData)) {
      mateDataDay[mate].push(count)
    }
  })


  // use the last value in a week / month as the week / month data
  Object.entries(inventoryData).forEach(([d, dateData]) => {
    const date = new Date(d)
    const week = getWeekNumberISO8601(date)
    const month = toMonthName(date.getMonth() + 1)

    for (const [mate, count] of Object.entries(dateData)) {
      mateDataWeekTmp[mate][week] = count
      mateDataMonthTmp[mate][month] = count
    }
  })

  mates.forEach(m => {
    labelsWeek.forEach(w => mateDataWeek[m].push(mateDataWeekTmp[m][w]))
    labelsMonth.forEach(month => mateDataMonth[m].push(mateDataMonthTmp[m][month]))
  })

  // to center month data if we have 1 month
  if (labelsMonth.length === 1) {
    labelsMonth.unshift('')
    labelsMonth.push('')

    Object.values(mateDataMonth).forEach(mateData => {
      mateData.unshift(NaN)
      mateData.push(NaN)
    })
  }

  return {labelsDay, labelsWeek, labelsMonth, mates, mateDataDay, mateDataWeek, mateDataMonth, dates}
}