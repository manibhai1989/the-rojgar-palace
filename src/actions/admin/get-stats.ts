'use server'

import { prisma } from "@/lib/prisma"

export interface ActivityItem {
    id: string
    action: string
    target: string
    time: Date
}

export interface DashboardStats {
    totalSeekers: number
    activeJobs: number
    applications: number
    revenue: number
    recentActivities: ActivityItem[]
    systemHealth: boolean
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const [userCount, activeJobsCount, applicationsCount, recentLogs] = await Promise.all([
            prisma.user.count(),
            prisma.job.count({
                where: {
                    endDate: {
                        gte: new Date()
                    }
                }
            }),
            prisma.application.count(),
            prisma.auditLog.findMany({
                take: 4,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    action: true,
                    details: true,
                    createdAt: true
                }
            })
        ])

        const formattedActivities = recentLogs.map(log => ({
            id: log.id,
            action: log.action,
            target: log.details || "System Event",
            time: log.createdAt
        }));

        return {
            totalSeekers: userCount,
            activeJobs: activeJobsCount,
            applications: applicationsCount,
            revenue: 0,
            recentActivities: formattedActivities,
            systemHealth: true
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            totalSeekers: 0,
            activeJobs: 0,
            applications: 0,
            revenue: 0,
            recentActivities: [],
            systemHealth: false,
            // @ts-ignore - added for debugging
            errorMessage: (error as Error).message
        }
    }

}
