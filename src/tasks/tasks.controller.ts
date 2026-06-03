import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(JwtGuard)
@ApiTags('Tasks')
@ApiBearerAuth()
export class TasksController {
    constructor(private readonly tasksService: TasksService){}

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'List of tasks' })
    async getAllTasks(){
        const tasks = await this.tasksService.getAllTasks();
        if(!tasks.success){
            throw new BadRequestException(tasks.error)
        }
        return tasks;
    }

    @Get('/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get task by ID' })
    @ApiResponse({ status: 200, description: 'Task found' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    async getTaskById(@Param('id') id: string){
        const task = await this.tasksService.getTaskById(id);
        if(!task.success){
            throw new NotFoundException(task.error)
        }
        return task;
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createTask(@Body() create: CreateTaskDTO){
        const task = await this.tasksService.createTask(create);
        if(!task.success){
            throw new BadRequestException(task.error)
        }

        return task;
    }

    @Put('/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Update task by ID' })
    @ApiResponse({ status: 200, description: 'Task updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Task not found' })
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
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete task by ID' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    @ApiResponse({ status: 404, description: 'Task not found' })
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
