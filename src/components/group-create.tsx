"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "ชื่อโปรเจคต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  }),
});

export function GroupCreate() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const name = values.name;

    const response = await fetch("/api/group/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      // Handle error
      toast.error("เกิดข้อผิดพลาดในการสร้างกลุ่ม");
      return;
    }

    // group created successfully
    toast.success("สร้างกลุ่มสำเร็จ");
    //refresh the page to load the new group
    window.location.reload();
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <h2 className="text-center mb-5 text-xl">สร้างกลุ่มใหม่</h2>
                <FormLabel>ชื่อกลุ่ม</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อกลุ่ม" {...field} />
                </FormControl>
                <FormDescription>นี่คือชื่อกลุ่มของคุณ</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            สร้างโปรเจค
          </Button>
        </form>
      </Form>
    </div>
  );
}
