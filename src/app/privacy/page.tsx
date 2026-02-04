import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | The Rojgar Palace',
    description: 'Privacy Policy for The Rojgar Palace - Detailed information on data collection and usage.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl font-sans text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#AC1E23] dark:text-red-400 mb-8 border-b-4 border-[#AC1E23] pb-4">
                Privacy Policy
            </h1>

            <section className="space-y-6 mb-12">
                <p className="text-lg leading-relaxed">
                    At <span className="font-bold">The Rojgar Palace</span>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by The Rojgar Palace and how we use it.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-[#008000] p-6 rounded-r-lg shadow-sm">
                    <h2 className="text-xl font-bold text-[#008000] dark:text-emerald-400 mb-2">Consent</h2>
                    <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Information We Collect</h2>
                <p className="leading-relaxed">
                    The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Name and Contact Information (if you contact us directly)</li>
                    <li>Usage Data (Log Files, Device Info)</li>
                    <li>Cookies and Web Beacons</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">How We Use Your Information</h2>
                <p className="leading-relaxed">
                    We use the information we collect in various ways, including to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Provide, operate, and maintain our website</li>
                    <li>Improve, personalize, and expand our website</li>
                    <li>Understand and analyze how you use our website</li>
                    <li>Develop new products, services, features, and functionality</li>
                    <li>Send you updates and other information relating to the website</li>
                    <li>Find and prevent fraud</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Log Files</h2>
                <p className="leading-relaxed">
                    The Rojgar Palace follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Third Party Privacy Policies</h2>
                <p className="leading-relaxed">
                    The Rojgar Palace's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </p>

                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mt-8">
                    <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2">Contact Us</h2>
                    <p>
                        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:manish.icst@gmail.com" className="text-blue-600 dark:text-blue-400 underline font-bold">manish.icst@gmail.com</a>.
                    </p>
                </div>
            </section>
        </main>
    );
}
