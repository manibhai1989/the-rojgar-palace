import { searchAnswerKeys } from "./actions";
import AnswerKeysClient from "@/components/answer-keys/AnswerKeysClient";

export const metadata = {
    title: "Exam Answer Keys | Sarkari Result Hub",
    description: "Access the latest official exam answer keys, solved papers, and objection links for various competitive exams.",
};

export default async function AnswerKeysPage() {
    const { answerKeys = [] } = await searchAnswerKeys();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500 mb-4 pb-2">
                    Latest Answer Keys
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Verify your performance with the latest official solutions and answer keys.
                </p>
            </header>

            <AnswerKeysClient initialAnswerKeys={answerKeys} />
        </div>
    );
}
