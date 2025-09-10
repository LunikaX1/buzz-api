"use client"
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Group } from '@/generated/prisma'
import Link from 'next/link'
import { Button } from './ui/button'

type Props = {
    groups: Group[]
}

export default function GroupList({ groups }: Props) {
    console.log(groups);
    return (
        <div>
            {groups.map((group) => (
                <Card key={group.id} className="mb-4">
                    <CardHeader>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription>{group.plan}</CardDescription>
                        <CardAction>
                            <Button asChild>
                                <Link href={`/group/${group.id}`}>รายละเอียด</Link>
                            </Button>
                        </CardAction>
                    </CardHeader>

                </Card>
            ))}
        </div>
    )
}