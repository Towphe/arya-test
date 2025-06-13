import { NextRequest } from "next/server";
import prisma from "@/prisma/db";
import { TaskDto } from "@/models/TaskDto";

export async function DELETE(request: NextRequest, { params }: {params: Promise<{ id: string }>}) {    
    const {id} = await params;

    if (!id) {
        return new Response("Task ID is required", { status: 400 });
    }

    // Check if the task exists
    const task = await prisma.task.findUnique({
        where: { task_id: id },
    });

    if (!task) {
        return new Response("Task not found", { status: 404 });
    }

    // Delete the task
    await prisma.task.delete({
        where: { task_id: id },
    });

    return new Response("Task deleted successfully", { status: 200 });
}

export async function PUT(request: NextRequest, { params }: {params: Promise<{ id: string }>}) {
    const {id} = await params;
    if (!id) {
        return new Response("Task ID is required", { status: 400 });
    }

    // Validate request body
    if (!request.body) {
        return new Response("Request body is required", { status: 400 });
    }

    // Parse request body
    const task: TaskDto = await request.json();

    // Update task in database
    const updatedTask = await prisma.task.update({
        where: { task_id: id },
        data: {
            title: task.title,
            description: task.description,
            deadline: task.deadline ? new Date(task.deadline) : null,
        },
    });

    // Update subtasks if any
    // if (task.subtasks && task.subtasks.length > 0) {
    //     for (const subtask of task.subtasks) {
    //         await prisma.sub_task.upsert({
    //             where: { title_task_id:  },
    //             update: {
    //                 description: subtask.description,
    //                 deadline: subtask.deadline ? new Date(subtask.deadline) : null,
    //             },
    //             create: {
    //                 title: subtask.title,
    //                 description: subtask.description,
    //                 deadline: subtask.deadline ? new Date(subtask.deadline) : null,
    //                 task_id: updatedTask.task_id,
    //             },
    //         });
    //     }
    // }

    return new Response(JSON.stringify(updatedTask), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}