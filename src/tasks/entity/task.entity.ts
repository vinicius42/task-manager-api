import { Priority, TaskStatus } from "src/types/task.types";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class TaskEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column()
    description?: string;

    @Column()
    status!: TaskStatus;

    @Column()
    priority!: Priority;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column()
    userId!: string;

    @Column()
    createDate!: string;

    @Column()
    updateDate!: string;

    @Column({ nullable: true })
    completedAt!: string;

}