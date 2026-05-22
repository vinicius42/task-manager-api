import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { CreateTaskInput, UpdateTaskInput } from 'src/types/task.types';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService){}

    @Get()
    getAllTasks(){
        const tasks = this.tasksService.getAllTasks();
        if(!tasks.success){
            throw new BadRequestException(tasks.error)
        }
        return tasks;
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string){
        const task = this.tasksService.getTaskById(id);
        if(!task.success){
            throw new NotFoundException(task.error)
        }
        return task;
    }

    @Post()
    @HttpCode(201)
    createTask(@Body() create: CreateTaskInput){
        const task = this.tasksService.createTask(create);
        if(!task.success){
            throw new BadRequestException(task.error)
        }

        return task;
    }

    @Put('/:id')
    updateTask(@Param('id') id: string, @Body() update: UpdateTaskInput){
        const task = this.tasksService.updateTask(id, update)
        if(!task.success){
            if(task.error == 'Task not found'){
                throw new NotFoundException(task.error)
            }
            throw new BadRequestException(task.error)
        }
        return task;
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string){
        const task = this.tasksService.deleteTask(id);
        if(!task.success){
            if(task.error == 'Task not found'){
                throw new NotFoundException(task.error)
            } else {
                throw new BadRequestException(task.error)
            }
        }
        return task;
    }
}
