import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { CreateTaskInput, UpdateTaskInput } from 'src/types/task.types';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService){}

    @Get()
    getAllTasks(){
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string){
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() create: CreateTaskInput){
        return this.tasksService.createTask(create);
    }

    @Put('/:id')
    updateTask(@Param('id') id: string, @Body() update: UpdateTaskInput){
        return this.tasksService.updateTask(id, update);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string){
        return this.tasksService.deleteTask(id);
    }
}
