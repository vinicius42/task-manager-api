import { Injectable } from '@nestjs/common';
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task.types";
import { err, ok, type Result } from "../utils/result";
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { TaskEntityToTask } from './task.mapper';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}
    async createTask(input: CreateTaskInput): Promise<Result<Task>>{
        const getUser = await this.userRepository.findOneBy({ id: input.userId });
        if(!getUser){
            return err('User not found')
        }
        const create = this.taskRepository.create(input);
        create.createDate = new Date().toISOString();
        create.updateDate = new Date().toISOString();
        create.priority = input.priority ?? 'low';
        create.status = 'to-do';

        const saveTask = await this.taskRepository.save(create);

        const taskMapped = TaskEntityToTask(saveTask);

        return ok(taskMapped);
    }
    
    async getAllTasks(): Promise<Result<Task[]>>{
        const tasks = await this.taskRepository.find();
        const tasksMapped = tasks.map(TaskEntityToTask);
        return ok(tasksMapped)
    }
    
    async getTaskById(id: string): Promise<Result<Task>>{
        const taskById = await this.taskRepository.findOneBy({ id });
        if(!taskById){
            return err('Task not found')
        }
        const taskMapped = TaskEntityToTask(taskById);
        return ok(taskMapped)
    }
    
    async updateTask(id: string, task: UpdateTaskInput): Promise<Result<Task>>{
        const taskUpdate = await this.taskRepository.findOneBy({ id });
        if(!taskUpdate){
            return err('Task not found')
        }

        taskUpdate.title = task.title ?? taskUpdate.title
        taskUpdate.description = task.description ?? taskUpdate.description
        taskUpdate.priority = task.priority ?? taskUpdate.priority
        taskUpdate.status = task.status ?? taskUpdate.status
        taskUpdate.updateDate = new Date().toISOString();

        const updatedTask = await this.taskRepository.save(taskUpdate);
        const taskMapped = TaskEntityToTask(updatedTask);
        return ok(taskMapped);
    }
    
    async deleteTask(id: string): Promise<Result<Task>>{
        const getTask = await this.taskRepository.findOneBy({ id });
        if(!getTask){
            return err('Task not found')
        }
        const deletedTask = await this.taskRepository.remove(getTask);
        const taskMapped = TaskEntityToTask(deletedTask);
        return ok(taskMapped);
    }
}
