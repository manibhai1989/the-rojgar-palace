import { searchResults } from "./actions";
import ResultsClient from "@/components/results/ResultsClient";

export const metadata = {
    title: "Exam Results | Sarkari Result Hub",
    description: "Access the latest official exam results for competitive examinations, board results, and selection lists.",
};

export default async function ResultsPage() {
    const { results = [] } = await searchResults();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500 mb-4 pb-2">
                    Latest Exam Results
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Stay updated with the latest selection lists and official results from across the country.
                </p>
            </header>

            <ResultsClient initialResults={results} />
        </div>
    );
}
