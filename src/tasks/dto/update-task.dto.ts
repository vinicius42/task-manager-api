import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Priority, TaskStatus } from "src/types/task.types";

export class UpdateTaskDTO{
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(Priority, { message: 'Priority must be low, medium or high' })
    @IsOptional()
    priority?: Priority;

    @IsEnum(TaskStatus, { message: 'Status must be to-do, in-progress or done' })
    @IsOptional()
    status?: TaskStatus;
}