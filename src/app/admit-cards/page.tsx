import { searchAdmitCards } from "./actions";
import AdmitCardsClient from "@/components/admit-cards/AdmitCardsClient";

export const metadata = {
    title: "Exam Admit Cards | Sarkari Result Hub",
    description: "Download official admit cards, hall tickets, and call letters for various competitive exams and selection tests.",
};

export default async function AdmitCardsPage() {
    let admitCards: any[] = [];
    try {
        const res = await searchAdmitCards();
        if (res?.success && res?.admitCards) {
            admitCards = res.admitCards;
        }
    } catch (e) {
        console.error("Failed to fetch admit cards:", e);
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 mb-4 pb-2">
                    Admit Cards & Hall Tickets
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Quickly find and download your examination entry tickets from verified official sources.
                </p>
            </header>

            <AdmitCardsClient initialAdmitCards={admitCards} />
        </div>
    );
}
