import { Megaphone } from "lucide-react";
import React from "react";

//Nextjs Layout

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Megaphone className="size-4" />
          </div>
          Buzz Api
        </a>
        {children}
      </div>
    </div>
  );
}
