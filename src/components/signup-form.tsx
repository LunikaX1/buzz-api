"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const password = watch("password");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { email, password } = data;
    // Handle sign up logic here
    (async () => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้");
        }
        toast.success("สมัครสมาชิกเรียบร้อยแล้ว");
        router.push("/auth/signin");
      } catch {
        toast.error("เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้");
      }
    })();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">สมัครสมาชิก</CardTitle>
          <CardDescription>สร้างบัญชีใหม่เพื่อเริ่มต้น</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                สมัครสมาชิกด้วยอีเมล
              </span>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">ยืนยันรหัสผ่าน</Label>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password || "รหัสผ่านไม่ตรงกัน",
                  })}
                  required
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.confirmPassword.message?.toString()}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full">
                สมัครสมาชิก
              </Button>
            </div>
            <div className="text-center text-sm mt-2">
              <span>มีบัญชีอยู่แล้ว? </span>
              <a href="/auth/signin" className="underline underline-offset-4">
                เข้าสู่ระบบ
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <span>โดยการคลิกต่อไปนี้ คุณยอมรับ </span>
        <a href="#" className="underline underline-offset-4">
          ข้อกำหนดในการให้บริการ
        </a>
        <span> และ </span>
        <a href="#" className="underline underline-offset-4">
          นโยบายความเป็นส่วนตัว
        </a>
      </div>
    </div>
  );
}
