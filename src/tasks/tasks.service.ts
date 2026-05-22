import { Injectable } from '@nestjs/common';
import { createTaskRepository, deleteTaskRepository, getAllTasksRepository, getTaskByIdRepository, updateTaskRepository } from "../repositories/task.repository";
import { getUserByIdRepository } from "../repositories/user.repository";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task.types";
import { err, ok, type Result } from "../utils/result";

@Injectable()
export class TasksService {
    createTask(input: CreateTaskInput): Result<Task>{
        if(input.title == ''){
            return err('Title is required')
        }
        if(input.title.length > 100){
            return err('Title cannot exceed 100 characters')
        }
        if(input.priority != 'low' && input.priority != 'medium' && input.priority != 'high'){
            return err('Priority must be low, medium or high')
        }
    
        const userId = getUserByIdRepository(input.userId);
        if(!userId.success){
            return err('User not found')
        }
    
        const data: Task = {
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            priority: input.priority,
            status: 'to-do',
            createDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),
            completedAt: null,
            userId: input.userId
        }
    
        if(createTaskRepository(data).success){
            return ok(data);
        } else {
            return err('Error creating task')
        }
    }
    
    getAllTasks(): Result<Task[]>{
        return getAllTasksRepository();
    }
    
    getTaskById(id: string): Result<Task>{
        return getTaskByIdRepository(id);
    }
    
    updateTask(id: string, task: UpdateTaskInput): Result<Task>{
        if(task.title == ''){
            return err('Title is required')
        }
        if(task.title && task.title?.length > 100){
            return err('Title cannot exceed 100 characters')
        }
        if(task.priority !== undefined && task.priority != 'low' && task.priority != 'medium' && task.priority != 'high'){
            return err('Priority must be low, medium or high')
        }
    
        if(task.status !== undefined && task.status != 'to-do' && task.status != 'in-progress' && task.status != 'done'){
            return err('Status must be to-do, in-progress or done')
        }
    
        const getTaskId = getTaskByIdRepository(id);
        if(!getTaskId.success){
            return err('Task not found')
        }
    
        return updateTaskRepository(id, task);
    }
    
    deleteTask(id: string): Result<Task>{
        return deleteTaskRepository(id);
    }
}
