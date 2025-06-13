import { Task } from "@/models/Task";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
    task: Task;
    onView: (task: Task) => void;
    onDelete: (task: Task) => void;
    onEdit: (task: Task) => void;
}

export function TaskCard({ task, onView, onDelete, onEdit }: TaskCardProps) {
    return (
        <div className="p-4 border-b border-gray-200 w-full sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/5 3xl:w-1/6">
            <div className="flex items-center justify-between mb-2 flex-wrap">
                <h2 className="text-md font-semibold">{task.title}</h2>
                <div className="flex justify-center items-center gap-1">
                    <button
                        className="p-2 rounded-full hover:text-white hover:bg-yellow-500 transition-colors cursor-pointer"
                        onClick={() => onEdit(task)}
                        type="button">
                        <Pencil className="size-4" />
                    </button>
                    <button
                        className="p-2 rounded-full hover:text-white  hover:bg-red-500 transition-colors cursor-pointer"
                        onClick={() => onDelete(task)}
                        type="button">
                        <Trash2 className="size-4" />
                    </button>
                    <button
                        className="p-2 rounded-full hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                        onClick={() => onView(task)}
                        type="button">
                        <Eye className="size-4" />
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-600">{task.description}</p>
        </div>
    );
}