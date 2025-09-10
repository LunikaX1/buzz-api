
import GroupDetail from '@/components/group-detail'
import React from 'react'


export const revalidate = 0 // Disable caching for dynamic data
export default async function ProjectDetail({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await Promise.resolve(params)
    return (
        <GroupDetail groupId={id} />
    )
}