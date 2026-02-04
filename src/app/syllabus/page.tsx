import { searchSyllabus } from "./actions";
import SyllabusClient from "@/components/syllabus/SyllabusClient";

export const metadata = {
    title: "Exam Syllabus | Sarkari Result Hub",
    description: "Download detailed official exam syllabus and exam patterns for various competitive examinations and government recruitments.",
};

export default async function SyllabusPage() {
    const { syllabus = [] } = await searchSyllabus();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 mb-4 pb-2">
                    Exam Syllabus & Pattern
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Prepare effectively with detailed official exam syllabus and patterns from verified sources.
                </p>
            </header>

            <SyllabusClient initialSyllabus={syllabus} />
        </div>
    );
}
