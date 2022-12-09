import React from "react";
import styles from "./task-list-table.module.css";
import {Task} from "../../types/public-types";

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

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {

        return (
          <div
            className={styles.taskListTableRow}
            style={{height: rowHeight * 2}}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div className={styles.taskListEmptyExpander}/>
                <div>{t.name}</div>
                <div className={styles.taskListEmptyExpander}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
