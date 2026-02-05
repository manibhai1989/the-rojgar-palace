'use server'

import { prisma } from "@/lib/prisma"

export interface DashboardStats {
    totalSeekers: number
    activeJobs: number
    applications: number
    revenue: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const [userCount, activeJobsCount, applicationsCount] = await Promise.all([
            prisma.user.count(),
            prisma.job.count({
                where: {
                    endDate: {
                        gte: new Date()
                    }
                }
            }),
            prisma.application.count()
        ])

        return {
            totalSeekers: userCount,
            activeJobs: activeJobsCount,
            applications: applicationsCount,
            revenue: 0 // Placeholder as no payment system exists yet
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            totalSeekers: 0,
            activeJobs: 0,
            applications: 0,
            revenue: 0
        }
    }
}
