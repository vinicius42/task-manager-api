import fs from "fs"
import { err, ok, type Result } from "../utils/result";
import type { UpdateUserInput, User } from "../types/user.types";

export function createUserRepository(user: User): Result<User>{
    try {
        const readFile = fs.readFileSync("./src/data/users.json", 'utf-8');

        const users: User[] = JSON.parse(readFile);

        users.push(user);

        fs.writeFileSync("./src/data/users.json", JSON.stringify(users))

        return ok(user)

    } catch (error) {
        return err('Error creating user')
    }
}

export function getAllUsersRepository(): Result<User[]>{
    try {
        const readFile = fs.readFileSync("./src/data/users.json", 'utf-8');

        const users: User[] = JSON.parse(readFile);

        return ok(users)

    } catch (error) {
        return err('Error getting users')
    }
}

export function getUserByIdRepository(id: string): Result<User>{
    try {
        const readFile = fs.readFileSync("./src/data/users.json", 'utf-8')

        const users: User[] = JSON.parse(readFile)

        const getUser = users.find(user => user.id === id)

        if(!getUser){
            return err('User not found')
        }

        return ok(getUser)
    } catch (error) {
        return err('Error getting user')
    }
}

export function updateUserRepository(id: string, updateUser: UpdateUserInput): Result<User>{
    try {
        const readFile = fs.readFileSync("./src/data/users.json", 'utf-8')

        const users: User[] = JSON.parse(readFile)

        const getUserId = users.find(user => user.id === id)

        if(!getUserId){
            return err('User not found')
        }

        getUserId.email = updateUser.email || getUserId.email
        getUserId.password = updateUser.password || getUserId.password
        getUserId.role = updateUser.role || getUserId.role

        fs.writeFileSync("./src/data/users.json", JSON.stringify(users))

        return ok(getUserId)
    } catch (error) {
        return err('Error updating user')
    }
}

export function deleteUserRepository(id: string): Result<User>{
    try {
        const readFile = fs.readFileSync("./src/data/users.json", 'utf-8')

        const users: User[] = JSON.parse(readFile)

        const getUserId = users.find(user => user.id === id)

        if(!getUserId){
            return err('User not found')
        }

        const filter = users.filter(user => user.id !== id)

        fs.writeFileSync("./src/data/users.json", JSON.stringify(filter))

        return ok(getUserId)
    } catch (error) {
        return err('Error deleting user')
    }
}