import type { Priority, Task, TaskStatus } from "src/types/task.types";
import { TaskEntity } from "./entity/task.entity";

export function TaskEntityToTask(taskEntity: TaskEntity): Task {
    return {
        id: taskEntity.id,
        title: taskEntity.title,
        description: taskEntity.description,
        priority: taskEntity.priority as Priority,
        status: taskEntity.status as TaskStatus,
        userId: taskEntity.userId,
        createDate: taskEntity.createDate,
        updateDate: taskEntity.updateDate,
        completedAt: taskEntity.completedAt
    }

}