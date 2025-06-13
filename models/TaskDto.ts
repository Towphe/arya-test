
export interface SubTaskDto {
    title: string;
    description: string;
    deadline: Date | null;
}

export interface TaskDto {
    title: string;
    description: string;
    deadline: Date | null;
    subtasks: SubTaskDto[];
}