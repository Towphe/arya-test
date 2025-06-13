"use client";

import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";

interface SearchbarProps {
    onSubmit: (searchTerm: string) => void;
}

const searchSchema = z.object({
    search: z.string().min(1, "Search term is required"),
});

export function Searchbar({onSubmit}: SearchbarProps) {
    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            search: "",
        },
    });

    function submit(data: z.infer<typeof searchSchema>) {
        onSubmit(data.search);
        // console.log("Search submitted:", data.search);
    }

    return (
        <div className="mx-auto w-full sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/5 3xl:w-1/6 py-6">
            <label className="mb-1 block">Search Task</label>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="w-full max-w-md flex justify-center items-start gap-2">
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem
                                className="w-full">
                                <FormControl>
                                    <Input
                                        className="w-full"
                                        placeholder="Enter search term" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="cursor-pointer">
                        <Search />
                    </Button>
                </form>
            </Form>
        </div>
    );
}