export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus; 
    createDate: string;
    updateDate: string;
    completedAt: string | null;
    userId: string;
}

export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'to-do' | 'in-progress' | 'done';

export type CreateTaskInput = Omit<Task, 'id' | 'status' | 'createDate' | 'updateDate' | 'completedAt'>;

export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status'>>; // resultado: Task com apenas title, description, priority e status e todos opcionais