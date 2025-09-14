"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, Key, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Using Prisma types - fallback to standard import if generated types aren't available
type Group = {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  token: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
};

interface PageProps {
  groupId: string;
}

export default function GroupDetail({ groupId }: PageProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchgroup = async () => {
      if (isLoaded) return;
      setIsLoaded(true);
      try {
        const response = await fetch(`/api/group/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          setGroup(data);
          setLoading(false);
          setIsLoaded(true);
        } else {
          toast.error("ไม่พบกลุ่มที่คุณต้องการ");
          setLoading(false);
          setIsNotFound(true);
        }
      } catch {
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลโปรเจค");
        setLoading(false);
        setIsError(true);
      }
    };

    fetchgroup();
  }, [isLoaded, groupId]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const copyAPIToClipboard = (api: string) => {
    navigator.clipboard.writeText(api);
    toast.success("คัดลอก API ไปยังคลิปบอร์ดแล้ว");
  };

  const copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("คัดลอกลิงค์ไปยังคลิปบอร์ดแล้ว");
  };

  const copyTokenToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("คัดลอก Token ไปยังคลิปบอร์ดแล้ว");
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        เกิดข้อผิดพลาดในการโหลดข้อมูลโปรเจค
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "gray" }}>
        ไม่พบโปรเจคที่คุณต้องการ
      </div>
    );
  }

  if (group) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/*  <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button> */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  toast.info("ฟีเจอร์นี้กำลังอยู่ในช่วงพัฒนา");
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">ลบ</span>
              </Button>
            </div>
          </div>

          {/* Group Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-balance break-words">
              {group.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                ID: {group.id}
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                Active
              </Badge>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* group Details */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    รายละเอียดโปรเจค
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        วันที่สร้าง
                      </p>
                      <p className="text-sm break-words">
                        {formatDate(new Date(group.createdAt))}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        อัพเดทล่าสุด
                      </p>
                      <p className="text-sm break-words">
                        {formatDate(new Date(group.updatedAt))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    ลิงค์ชวนเพื่อรับ Notification
                  </CardTitle>
                  <CardDescription>
                    ใช้สำหรับการเชื่อมต่อ Webhook เพื่อรับการแจ้งเตือนต่างๆ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-muted rounded-md text-xs sm:text-sm font-mono break-all min-w-0 overflow-x-auto">
                      {`${process.env.NEXT_PUBLIC_NOTIFY_WEBHOOK_URL}/group/${group.id}`}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto shrink-0"
                      onClick={() =>
                        copyLinkToClipboard(
                          `${process.env.NEXT_PUBLIC_NOTIFY_WEBHOOK_URL}/group/${group.id}`
                        )
                      }
                    >
                      คัดลอก
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Access Token
                  </CardTitle>
                  <CardDescription>
                    ใช้สำหรับการยืนยันตัวตนใน API requests ของคุณ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-muted rounded-md text-xs sm:text-sm font-mono break-all min-w-0 overflow-x-auto">
                      {group.token}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto shrink-0"
                      onClick={() => copyTokenToClipboard(group.token)}
                    >
                      คัดลอก
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Endpoint
                  </CardTitle>
                  <CardDescription>
                    ใช้สำหรับการส่งการแจ้งเตือนผ่าน API
                    โดยต้องมีการยืนยันตัวตนด้วย
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-muted rounded-md text-xs sm:text-sm font-mono break-all min-w-0 overflow-x-auto">
                      {`${process.env.NEXT_PUBLIC_NOTIFY_WEBHOOK_URL}/api/sent/${group.id}`}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto shrink-0"
                      onClick={() =>
                        copyAPIToClipboard(
                          `${process.env.NEXT_PUBLIC_NOTIFY_WEBHOOK_URL}/api/sent/${group.id}`
                        )
                      }
                    >
                      คัดลอก
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    ตัวอย่างการส่ง API
                  </CardTitle>
                  <CardDescription>
                    ตัวอย่างการใช้ Access Token ในการเรียก API ต้องมี Header
                    ชื่อ Authorization: Bearer YOUR_TOKEN
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">ตัวอย่างการใช้ API ด้วย curl:</p>
                    <div className="overflow-x-auto">
                      <code className="block px-3 py-2 bg-muted rounded-md text-xs font-mono break-all whitespace-pre-wrap">
                        {`curl -X POST "${process.env.NEXT_PUBLIC_NOTIFY_WEBHOOK_URL}/api/sent/${group.id}" -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"title": "แจ้งเตือนใหม่", "message": "มีออเดอร์ใหม่เข้ามา", "image": "https://example.com/image.png"}'`}
                      </code>
                    </div>
                    <div className="overflow-x-auto">
                      <Table className="mt-4">
                        <TableCaption>รายละเอียดของ API</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[100px]">
                              ชื่อ
                            </TableHead>
                            <TableHead className="min-w-[200px]">
                              รายละเอียด
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">title</TableCell>
                            <TableCell className="font-medium">
                              ชื่อการแจ้งเตือน
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">body</TableCell>
                            <TableCell className="font-medium">
                              รายละเอียดการแจ้งเตือน
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">icon</TableCell>
                            <TableCell className="font-medium">
                              ICON ของ Notify(ถ้ามี)
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">image</TableCell>
                            <TableCell className="font-medium">
                              URL ของรูปภาพ (ถ้ามี)
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">url</TableCell>
                            <TableCell className="font-medium">
                              URL Callback (ถ้ามี)
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Owner Information */}
            {/* <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  รายละเอียดเจ้าของโปรเจค
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(group.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {group.user.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group.user.email}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono">{group.user.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">วันที่สมัคร:</span>
                    <span>{formatDate(group.user.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
          </div>
        </div>
      </div>
    );
  }
}
