import { Task, type UpdateTaskInput } from "../types/task.types"
import fs from "fs"
import { err, ok, type Result } from "../utils/result";


export function createTaskRepository(task: Task): Result<Task>{
    try {
        const readFile = fs.readFileSync("./src/data/tasks.json", 'utf-8');

        const tasks: Task[] = JSON.parse(readFile);

        tasks.push(task);

        fs.writeFileSync("./src/data/tasks.json", JSON.stringify(tasks))

        return ok(task)

    } catch (error) {
        return err('Error creating task')
    }
}

export function getAllTasksRepository(): Result<Task[]>{
    try {
        const readFile = fs.readFileSync("./src/data/tasks.json", 'utf-8');

        const tasks: Task[] = JSON.parse(readFile);

        return ok(tasks)

    } catch (error) {
        return err('Error getting tasks')
    }
}

export function getTaskByIdRepository(id: string): Result<Task>{
    try {
        const readFile = fs.readFileSync("./src/data/tasks.json", 'utf-8');

        const tasks: Task[] = JSON.parse(readFile)
        
        const getTask = tasks.find(task => task.id === id)

        if(!getTask){
            return err('Task not found')
        }

        return ok(getTask)

    } catch (error) {
        return err('Error getting task')
    }
}

export function updateTaskRepository(id: string, task: UpdateTaskInput): Result<Task>{
    try {
        const readFile = fs.readFileSync("./src/data/tasks.json", 'utf-8');

        const tasks: Task[] = JSON.parse(readFile)
        
        const getTaskId = tasks.find(task => task.id === id)

        if(!getTaskId){
            return err('Task not found')
        }

        getTaskId.title = task.title || getTaskId.title
        getTaskId.description = task.description || getTaskId.description
        getTaskId.priority = task.priority || getTaskId.priority
        getTaskId.status = task.status || getTaskId.status
        getTaskId.updateDate = new Date().toISOString()

        if(task.status === 'done'){
            getTaskId.completedAt = new Date().toISOString()
        }

        fs.writeFileSync("./src/data/tasks.json", JSON.stringify(tasks))

        return ok(getTaskId)

    } catch (error) {
        return err('Error updating task')
    }
}

export function deleteTaskRepository(id: string): Result<Task>{
    try {
        const readFile = fs.readFileSync("./src/data/tasks.json", 'utf-8');

        const tasks: Task[] = JSON.parse(readFile);
        
        const getTaskById = tasks.find(task => task.id === id)

        if(!getTaskById){
            return err('Task not found')
        }

        const filter = tasks.filter(task => task.id !== id)

        fs.writeFileSync("./src/data/tasks.json", JSON.stringify(filter))

        return ok(getTaskById)

    } catch (error) {
        return err('Error deleting task')
    }
}