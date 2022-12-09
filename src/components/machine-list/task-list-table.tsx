import React from "react";
import styles from "./task-list-table.module.css";
import {Task} from "../../types/public-types";
import {MachineTask} from "../../helpers/parsers";

export const MachineListTable: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
        rowHeight,
        rowWidth,
        tasks,
        fontFamily,
        fontSize,
      }) => {

  const machines = Array.from(new Set(tasks.map(t => (t as MachineTask).machine))).sort()

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {machines.map(mac => {

        return (
          <div
            className={styles.taskListTableRow}
            style={{height: rowHeight * 2}}
            key={`${mac}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={mac}
            >
              <div className={styles.taskListNameWrapper}>
                <div className={styles.taskListEmptyExpander}/>
                <div>{mac}</div>
                <div className={styles.taskListEmptyExpander}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
