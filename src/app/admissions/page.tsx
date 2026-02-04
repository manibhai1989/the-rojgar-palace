import { searchAdmissions } from "./actions";
import AdmissionsClient from "@/components/admissions/AdmissionsClient";

export const metadata = {
    title: "University & Course Admissions | Sarkari Result Hub",
    description: "Browse the latest admission notifications for universities, colleges, and professional courses across the country.",
};

export default async function AdmissionsPage() {
    const { admissions = [] } = await searchAdmissions();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-500 mb-4 pb-2">
                    Admissions & Course Entries
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Take the first step towards your career with the latest university and college admission updates.
                </p>
            </header>

            <AdmissionsClient initialAdmissions={admissions} />
        </div>
    );
}
