import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Priority } from "src/types/task.types";

export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(Priority)
    priority!: Priority;

    @IsString()
    @IsNotEmpty()
    userId!: string;

}