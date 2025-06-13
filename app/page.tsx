"use client";

import { Searchbar } from "@/components/Searchbar";
import { TaskCard } from "@/components/TaskCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent,DialogFooter,DialogTitle } from "@/components/ui/dialog";
import { Task } from "@/models/Task";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const subTaskSchema = z.object({
    title: z.string().min(1, "Search term is required"),
    description: z.string().min(1, "Description is required"),
    deadline: z.date().nullable().optional(),
});

const taskSchema = z.object({
    title: z.string().min(1, "Search term is required"),
    description: z.string().min(1, "Description is required"),
    deadline: z.date().nullable().optional(),
    subtasks: z.array(subTaskSchema).optional(),
});

  export default function Home() {
    const [userId, setUserId] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

    const createForm = useForm<z.infer<typeof taskSchema>>({
      resolver: zodResolver(taskSchema),
      defaultValues: {
        title: "",
        description: "",
        deadline: (new Date()),
        subtasks: [],
      },
    });
    async function createTask(data: z.infer<typeof taskSchema>) {
      if (!userId) {
        console.error("User ID is not set");
        return;
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!res.ok) {
        console.error("Failed to create task");
        return;
      }
      
      // refetch tasks after creating a new one

      fetchTasks();
      setIsCreateModalOpen(false);
      createForm.reset();
      setSelectedTask(undefined);
    }

    async function editTask(data: z.infer<typeof taskSchema>) {
      if (!userId) {
        console.error("User ID is not set");
        return;
      }

      const res = await fetch(`/api/tasks/${selectedTask?.task_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!res.ok) {
        console.error("Failed to create task");
        return;
      }
      
      // refetch tasks after creating a new one

      fetchTasks();
      setIsEditModalOpen(false);
      editForm.reset();
      setSelectedTask(undefined);
    }

    async function fetchTasks() {
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch tasks");
        return;
      }
      const data = await res.json();
      setTasks(data.tasks);
    }

    async function search(searchTerm: string) {
      console.log(searchTerm);
    }

    function onView(task: Task) {
      setSelectedTask(task);
      setIsViewModalOpen(true);
    }

    function onDelete(task: Task) {
      setSelectedTask(task);
      setIsDeleteModalOpen(true);
    }

    async function deleteTask() {
      if (!selectedTask) return;

      // call delete endpoint
      const res = await fetch(`/api/tasks/${selectedTask.task_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      });
      if (!res.ok) {
        console.error("Failed to delete task");
        return;
      }
      setIsDeleteModalOpen(false);
      setSelectedTask(undefined);
      // refetch tasks after deleting
      fetchTasks(); 
    }

    const editForm = useForm<z.infer<typeof taskSchema>>({
      resolver: zodResolver(taskSchema),
      defaultValues: {
        title: "",
        description: "",
        deadline: (new Date()),
        subtasks: [],
      },
    });

    function onEdit(task: Task) {
      setSelectedTask(task);
      setIsEditModalOpen(true);
      editForm.reset({
        title: task.title,
        description: task.description,
        deadline: task.deadline ? new Date(task.deadline) : null,
      });
    }

    const [tasks, setTasks] = useState<Task[]>([]);

    // Simulate fetching tasks from an API
    useEffect(() => {
      
      // check localStorage for ID,
      // if not found, generate a new ID
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // generate UUID
        const newUserId = crypto.randomUUID();
        localStorage.setItem("userId", newUserId);
        setUserId(newUserId);
      } else {
        setUserId(userId);
      }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  return (
    <div className="w-full h-full max-h-screen px-4">
      <h1 className="text-lg font-semibold w-full sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/5 3xl:w-1/6 mx-auto">Tasks</h1>
      <Searchbar onSubmit={search} />
      <div className="w-full overflow-y-scroll flex flex-col justify-center items-center">
        {
          tasks && tasks.map((task, i) => <TaskCard
                                key={i}
                                task={task}
                                onView={onView}
                                onDelete={onDelete}
                                onEdit={onEdit}
                              />
          )
        }
        {
          !tasks || tasks.length === 0 && (
            <div className="text-gray-500 mt-4">
              No tasks available. Click the button below to create a new task.
            </div>
          )
        }
      </div>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="absolute bottom-6 right-6 rounded-full h-14 cursor-pointer block">
        <Plus className="size-8" />
      </Button>

      {/* Modals */}
      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={isDeleteModalOpen}
        onOpenChange={(open:boolean) => {
          setIsDeleteModalOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel
              className="cursor-pointer"
              >Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTask()}
              className="cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors"
              >Delete</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Task Modal */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open:boolean) => {
          setIsCreateModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogTitle>Create Task</DialogTitle>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(createTask)}>
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl className="mb-4">
                      <Input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter task title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-4">
                      <Input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              <FormField
                control={createForm.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl className="mb-4">
                      <Input
                        type="date"
                        className="w-full p-2 border rounded"
                        placeholder="Enter description"
                        value={field.value ? (typeof field.value === "string" ? field.value : field.value.toISOString().split("T")[0]) : ""}
                        onChange={e => {
                          const val = e.target.value;
                          field.onChange(val ? new Date(val) : null);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">
                Create Task
              </Button>
            </form>
          </Form>
          <div className="flex justify-center items-center">
            <p>Or let AI generate it forr you</p>
          </div>
          <div>
            <p>Describe what you want to do</p>
            <Input type="text" placeholder="Describe the tasks" />
            <Button
              onClick={() => alert("This feature is not implemented yet.")}
              type="button"
              className="w-full bg-purple-500  text-white hover:bg-purple-600 transition-colors cursor-pointer mt-2">
              Generate Tasks
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open:boolean) => {
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogTitle>Edit Task</DialogTitle>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(editTask)}>
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl className="mb-4">
                      <Input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter task title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl className="mb-4">
                      <Input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              <FormField
                control={editForm.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl className="mb-4">
                      <Input
                        type="date"
                        className="w-full p-2 border rounded"
                        placeholder="Enter description"
                        value={field.value ? (typeof field.value === "string" ? field.value : field.value.toISOString().split("T")[0]) : ""}
                        onChange={e => {
                          const val = e.target.value;
                          field.onChange(val ? new Date(val) : null);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              <Button
                type="submit"
                className="w-full bg-yellow-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">
                Update Task
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Task Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open:boolean) => {
          setIsViewModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogTitle>{selectedTask?.title}</DialogTitle>
          <div>
            <p className="">{selectedTask?.description}</p>
          </div>
          <DialogFooter className="w-full">
            <div className="w-full flex justify-end gap-1.5">
            <button
              className="p-2 rounded-full hover:text-white hover:bg-yellow-500 transition-colors cursor-pointer"
              onClick={() => selectedTask && onEdit(selectedTask)}
              type="button">
              <Pencil className="size-4" />
            </button>
            <button
              className="p-2 rounded-full hover:text-white  hover:bg-red-500 transition-colors cursor-pointer"
              onClick={() => selectedTask && onDelete(selectedTask)}
              type="button">
                <Trash2 className="size-4" />
            </button>
            </div>
          </DialogFooter>
        </DialogContent>

      </Dialog>
    </div>
  );
}
