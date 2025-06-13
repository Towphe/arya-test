import { NextRequest } from "next/server";
import prisma from "@/prisma/db";
import { TaskDto, SubTaskDto } from "@/models/TaskDto";

export async function GET(request: NextRequest) {
    // get user id from header
    const userId = request.headers.get("user-id");
    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }
    // get tasks for user
    const tasks = await prisma.task.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    return new Response(JSON.stringify({tasks: tasks}), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    // extract user id from header
    const userId = request.headers.get("user-id");
    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }
    // validate request body
    if (!request.body) {
        return new Response("Request body is required", { status: 400 });
    }

    // parse request body
    const task:TaskDto = await request.json();

    // crreate task in database
    const createdTask = await prisma.task.create({
        data: {
            title: task.title,
            description: task.description,
            deadline: task.deadline ? new Date(task.deadline) : null,
            user_id: userId,
            status: "pending"
        },
    });
    
    // create subtasks if any
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksData = task.subtasks.map((subtask: SubTaskDto) => ({
            title: subtask.title,
            description: subtask.description,
            deadline: subtask.deadline ? new Date(subtask.deadline) : null,
            task_id: createdTask.task_id,
            status: "pending"
        }));

        await prisma.sub_task.createMany({
            data: subtasksData,
        });
    }

    return new Response(JSON.stringify(createdTask), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}