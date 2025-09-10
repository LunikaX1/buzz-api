import { SignInForm } from "@/components/signin-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Group } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export const revalidate = 0 // Disable caching for dynamic data

async function getData() {
  const session = await getServerSession()
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      group: true
    }
  })

  return user
}

export default async function Page() {
  console.log('Rendering dashboard page')
  const data = await getData()

  if (!data) {
    return (
      redirect('/auth/signin')
    )
  }

  const recentGroups = data.group.slice(0, 5)
  const groupCount = data.group.length

  return (
    <main className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">แดชบอร์ด</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">กลุ่มทั้งหมด</h3>
          <p className="text-2xl font-bold">{groupCount}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">บัญชี</h3>
          <p className="text-2xl font-bold capitalize">Free</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">สมัครสมาชิกเมื่อ</h3>
          <p className="text-2xl font-bold">{new Date(data.createdAt).toLocaleDateString()}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">อัพเดทล่าสุด</h3>
          <p className="text-2xl font-bold">{new Date(data.updatedAt).toLocaleDateString()}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">กลุ่มล่าสุด</h3>
          <div className="space-y-4">
            {recentGroups.map((group: Group) => (
              <div key={group.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-muted-foreground">
                    สร้างเมื่อ {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/project/${group.id}`}
                  className="text-sm text-blue-500 hover:underline"
                >
                  รายละเอียด
                </a>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">รายระเอียดบัญชี</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">อีเมล</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ชื่อ</p>
              <p className="font-medium">{data.name || 'ยังไม่ได้กำหนด'}</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
