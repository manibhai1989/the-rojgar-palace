"use client";

import JobForm, { JobFormData } from "@/components/admin/job-form";
import { createJob } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
    const router = useRouter();

    const handleSubmit = async (data: JobFormData) => {
        const result = await createJob(data);
        if (result.success) {
            // Optional: Redirect or reset
            // router.push("/admin/jobs");
        }
        return result;
    };

    return (
        <JobForm onSubmit={handleSubmit} submitLabel="Publish Job" />
    );
}
