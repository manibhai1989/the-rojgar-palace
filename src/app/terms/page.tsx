import { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms & Conditions | The Job Palace',
    description: 'Terms of Service for The Job Palace. Please read our disclaimer regarding job data accuracy.',
};

export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl font-sans text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#AC1E23] dark:text-red-400 mb-8 border-b-4 border-[#AC1E23] pb-4">
                Terms & Conditions
            </h1>

            {/* HIGH IMPORTANCE DISCLAIMER */}
            <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-600 p-6 md:p-8 rounded-r-lg shadow-md mb-12">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="h-8 w-8 text-red-600 shrink-0 mt-1" />
                    <div>
                        <h2 className="text-2xl font-black text-red-700 dark:text-red-400 mb-4 uppercase tracking-wide">
                            Disclaimer (Important Notice)
                        </h2>

                        <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 leading-relaxed">
                            "While every effort has been made to ensure the accuracy of the data acquired from the internet, we cannot be held responsible for any inadvertent errors. Users are advised to exercise discretion and verify information independently."
                        </p>

                        <p className="text-base text-slate-700 dark:text-slate-300 italic mb-4">
                            (We have acquired data from public sources with great care, but The Job Palace assumes no liability for inaccuracies. Please verify details against the official notification.)
                        </p>

                        <div className="h-px w-full bg-red-200 dark:bg-red-800 my-4" />

                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                            **Candidates are strongly advised to verify the Official Notification PDF before proceeding with any payments or applications.**
                        </p>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">1. Use of Website</h2>
                <p className="leading-relaxed">
                    By accessing this website, you agree to be bound by these website Terms and Conditions of Use, all applicable laws, and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">2. Accuracy of Information</h2>
                <p className="leading-relaxed">
                    The materials appearing on The Job Palace's website could include technical, typographical, or photographic errors. The Job Palace does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">3. Third-Party Links</h2>
                <p className="leading-relaxed">
                    The Job Palace has not reviewed all of the sites linked to its Internet web site (such as official government websites) and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Job Palace of the site. Use of any such linked web site is at the user's own risk.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">4. No Liability</h2>
                <p className="leading-relaxed">
                    In no event shall The Job Palace or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Job Palace's Internet site.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">5. Changes to Terms</h2>
                <p className="leading-relaxed">
                    The Job Palace may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
                </p>
            </section>
        </main>
    );
}
