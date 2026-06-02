import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService){}

    @Get()
    async getAllTasks(){
        const tasks = await this.tasksService.getAllTasks();
        if(!tasks.success){
            throw new BadRequestException(tasks.error)
        }
        return tasks;
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string){
        const task = await this.tasksService.getTaskById(id);
        if(!task.success){
            throw new NotFoundException(task.error)
        }
        return task;
    }

    @Post()
    @HttpCode(201)
    async createTask(@Body() create: CreateTaskDTO){
        const task = await this.tasksService.createTask(create);
        if(!task.success){
            throw new BadRequestException(task.error)
        }

        return task;
    }

    @Put('/:id')
    async updateTask(@Param('id') id: string, @Body() update: UpdateTaskDTO){
        const task = await this.tasksService.updateTask(id, update)
        if(!task.success){
            if(task.error == 'Task not found'){
                throw new NotFoundException(task.error)
            }
            throw new BadRequestException(task.error)
        }
        return task;
    }

    @Delete('/:id')
    async deleteTask(@Param('id') id: string){
        const task = await this.tasksService.deleteTask(id);
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
