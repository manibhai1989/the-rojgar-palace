import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import JobForm, { JobFormData } from "@/components/admin/job-form";
import { updateJob } from "../../new/actions";
import { format } from "date-fns";
import React from "react";

interface EditJobPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
    const { id } = await params;

    // 1. Fetch Job
    const job = await prisma.job.findUnique({
        where: { id },
    });

    if (!job) {
        notFound();
    }

    // 2. Transform DB Job to JobFormData
    // Helper to safe stringify dates
    const formatDate = (d: Date | null) => d ? format(d, "dd/MM/yyyy") : "";

    // Helper to safe cast JSON
    const feesObj = Array.isArray(job.fees) ? job.fees as { category: string, amount: string }[] : [];
    const vacancyObj = Array.isArray(job.vacanciesDetail) ? job.vacanciesDetail as { postName: string, category: string, count: any }[] : [];

    const appProcess = job.applicationProcess as any || {};
    const importantLinks = Array.isArray(appProcess.links) ? appProcess.links : [];
    const customDates = Array.isArray(appProcess.customDates) ? appProcess.customDates : [];
    const extraDetails = Array.isArray(appProcess.extraDetails) ? appProcess.extraDetails : [];

    const eligibility = job.eligibility as any || {};
    const ageLimitDetails = {
        calculateDate: eligibility.ageCalculateDate || "",
        relaxation: eligibility.ageRelaxation || ""
    };

    const selectionProcess = job.selectionProcess as any || {};
    const selectionStages = Array.isArray(selectionProcess.stages) ? selectionProcess.stages : [];

    const initialData: JobFormData = {
        postName: job.title,
        advtNo: "", // Schema doesn't strictly have this column mapped yet in my createJob, likely missing or stored in shortInfo? Actually schema doesn't have advtNo column.
        shortInfo: job.shortInfo || "",
        totalVacancy: job.vacanciesCount.toString(),

        applicationBegin: formatDate(job.startDate),
        lastDateApply: formatDate(job.endDate),
        lastDateFee: formatDate(job.feeDeadline),
        examDate: formatDate(job.examDate),

        minAge: (eligibility.minAge || "").toString(),
        maxAge: (eligibility.maxAge || "").toString(),

        feesObj,
        vacancyObj,
        importantLinks,
        extraDetails,
        customDates,

        ageLimitDetails,
        selectionStages,
        educationalQualification: eligibility.educationDetails || ""
    };

    // 3. Handle Submit
    async function handleUpdate(data: JobFormData) {
        "use server";
        return await updateJob(id, data);
    }

    return (
        <JobForm
            initialData={initialData}
            onSubmit={handleUpdate}
            submitLabel="Update Job"
            isEditMode={true}
        />
    );
}
