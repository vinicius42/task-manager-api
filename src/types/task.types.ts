export const TaskStatus = {
    TODO: 'to-do',
    IN_PROGRESS: 'in-progress',
    DONE: 'done'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const Priority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus; 
    createDate: string;
    updateDate: string;
    completedAt: string | null;
    userId: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'status' | 'createDate' | 'updateDate' | 'completedAt'>;

export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status'>>; // resultado: Task com apenas title, description, priority e status e todos opcionais