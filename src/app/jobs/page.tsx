import { searchJobs } from "./actions";
import JobsClient from "@/components/jobs/JobsClient";

export const metadata = {
    title: "Government Jobs | Sarkari Result Hub",
    description: "Search and filter through the latest government job openings, central and state government notifications.",
};

export default async function JobsPage() {
    const { jobs = [] } = await searchJobs();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 mb-4 pb-2">
                    Explore Opportunities
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Search through thousands of verified government job openings across various categories and organizations.
                </p>
            </header>

            <JobsClient initialJobs={jobs} />
        </div>
    );
}
