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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,

  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Prevent automatic redirect/refresh
      });

      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch  {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">เข้าสู่ระบบ</CardTitle>
          <CardDescription>เข้าสู่ระบบด้วยบัญชีของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  เข้าสู่ระบบด้วยอีเมล
                </span>
              </div>
              <div className="grid gap-6">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </div>
              <div className="text-center text-sm">
                <span>ยังไม่มีบัญชี? </span>
                <a href="/auth/signup" className="underline underline-offset-4">
                  สมัครสมาชิก
                </a>
              </div>
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
