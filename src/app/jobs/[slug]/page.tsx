import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/jobs/job-header";
import { QuickStatsBar } from "@/components/jobs/quick-stats-bar";
import { JobTabs } from "@/components/jobs/job-tabs";
import { EligibilityCalculator } from "@/components/jobs/eligibility-calculator";
import { DocumentChecklist } from "@/components/jobs/document-checklist";

import { Rocket, ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatText } from "@/lib/utils";
import { MarkdownText } from "@/components/ui/markdown-text";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const job = await prisma.job.findUnique({
        where: { slug }
    });

    if (!job) return { title: "Job Not Found" };

    return {
        title: `${(job as any).title} - ${(job as any).organization} | Sarkari Result Hub`,
        description: (job as any).shortInfo || `Latest recruitment details for ${(job as any).title} at ${(job as any).organization}.`,
    };
}

// Safe Data Accessors
const formatDate = (d: Date | null) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Notified Soon";

export default async function JobDetailsPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch Job Data
    const job = await prisma.job.findUnique({
        where: { slug }
    });

    if (!job) {
        notFound();
    }

    // Parse JSON fields safely
    // Parse JSON fields safely - DYNAMIC TYPES
    const fees = (job.fees as any) as Record<string, string>[] | undefined;
    const vacancies = (job.vacanciesDetail as any) as Record<string, string>[] | undefined;
    const links = (job.applicationProcess as any)?.links as { title: string, url: string }[] | undefined;
    const extraDetails = (job.applicationProcess as any)?.extraDetails as { title: string, content: string }[] | undefined;
    const customDates = (job.applicationProcess as any)?.customDates as { label: string, value: string }[] | undefined;

    // Eligibility & Age
    const elg = job.eligibility as any;
    const ageCalculateDate = elg?.ageCalculateDate;
    const ageRelaxation = elg?.ageRelaxation;
    const educationDetails = elg?.educationDetails;
    const educationShort = elg?.education || "Check Notification";

    // Selection
    const selectionStages = (job.selectionProcess as any)?.stages as string[] | undefined;

    // JSON-LD Structured Data for Google Jobs
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.shortInfo,
        "identifier": {
            "@type": "PropertyValue",
            "name": job.organization,
            "value": job.slug
        },
        "datePosted": job.createdAt.toISOString(),
        "validThrough": job.endDate.toISOString(),
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.organization,
            "sameAs": job.officialUrl
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
                "@type": "QuantitativeValue",
                "value": "Check Notification",
                "unitText": "MONTH"
            }
        },
        "employmentType": "FULL_TIME"
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl font-sans text-slate-900 dark:text-slate-100">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* 1. Header Section */}
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#AC1E23] dark:text-red-400">
                    {job.title}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <p>Post Date: <span className="text-[#008000] dark:text-emerald-400">{formatDate(job.createdAt)}</span></p>
                    <p>|</p>
                    <p>Update Date: <span className="text-[#008000] dark:text-emerald-400">{formatDate(job.updatedAt)}</span></p>
                </div>
                <p className="max-w-3xl mx-auto text-justify md:text-center text-sm leading-relaxed font-medium">
                    <span className="text-[#FF00FF] dark:text-pink-400 font-bold">{job.organization}</span> : {formatText(job.shortInfo)}
                </p>
            </div>

            {/* 2. Important Dates & Fees Grid */}
            <div className="grid md:grid-cols-2 border-2 border-[#AC1E23] dark:border-red-500 mb-6">
                {/* Important Dates */}
                <div className="border-b-2 md:border-b-0 md:border-r-2 border-[#AC1E23] dark:border-red-500">
                    <div className="bg-[#AC1E23] dark:bg-red-900 text-white text-center font-bold py-2 text-xl">
                        Important Dates
                    </div>
                    <ul className="p-6 space-y-3 font-medium">
                        <li className="flex justify-between">
                            <span>Application Begin :</span>
                            <span className="font-bold">{formatDate(job.startDate)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Last Date for Apply Online :</span>
                            <span className="text-[#AC1E23] dark:text-red-400 font-bold">{formatDate(job.endDate)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Pay Exam Fee Last Date :</span>
                            <span className="font-bold">{formatDate(job.feeDeadline)}</span>
                        </li>
                        {job.examDate && (
                            <li className="flex justify-between">
                                <span>Exam Date :</span>
                                <span className="text-[#AC1E23] dark:text-red-400 font-bold">{formatDate(job.examDate)}</span>
                            </li>
                        )}

                        {/* Critical: Custom Dates (Re-Open, Phases, etc) */}
                        {customDates?.map((d, i) => (
                            <li key={i} className="flex justify-between">
                                <span>{d.label} :</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">{d.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Application Fee */}
                <div>
                    <div className="bg-[#AC1E23] dark:bg-red-900 text-white text-center font-bold py-2 text-xl">
                        Application Fee
                    </div>
                    <div className="p-6 font-medium">
                        {fees && fees.length > 0 ? (
                            <ul className="space-y-3">
                                {fees.map((fee, i) => {
                                    // Dynamic Key-Value Rendering
                                    const keys = Object.keys(fee);
                                    // Assume first key is label, second is value (common pattern)
                                    // OR just render them all formatted
                                    return (
                                        <li key={i} className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 last:border-0">
                                            {keys.map((k, idx) => (
                                                <span key={idx} className={idx === keys.length - 1 ? "font-bold" : ""}>
                                                    {fee[k]}
                                                </span>
                                            ))}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-center italic text-slate-500">Check Notification for Details</p>
                        )}
                        <p className="mt-4 pt-2 border-t border-slate-300 dark:border-slate-700 text-xs leading-tight">
                            Pay the Exam Fee Through Debit Card, Credit Card, Net Banking Only.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Age Limit */}
            <div className="border-2 border-[#008000] dark:border-emerald-600 mb-6">
                <div className="bg-[#008000] dark:bg-emerald-800 text-white text-center font-bold py-2 text-xl">
                    {job.organization} Age Limit {ageCalculateDate ? `as on ${ageCalculateDate}` : ""}
                </div>
                <div className="p-6 text-center space-y-2 font-medium">
                    <div className="flex justify-center gap-8">
                        <p>Minimum Age : <span className="font-bold text-lg">{elg?.minAge || "NA"} Years</span></p>
                        <p>Maximum Age : <span className="font-bold text-lg">{elg?.maxAge || "NA"} Years</span></p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Age Relaxation : <span className="font-bold text-slate-900 dark:text-slate-200">{ageRelaxation || `Extra as per ${job.organization} Rules`}</span>.
                    </p>
                </div>
            </div>

            {/* 4. Selection Process & Education (New) */}
            {(selectionStages || educationDetails) && (
                <div className="grid md:grid-cols-2 border-2 border-blue-600 dark:border-blue-500 mb-6">
                    {/* Education */}
                    <div className="border-b-2 md:border-b-0 md:border-r-2 border-blue-600 dark:border-blue-500">
                        <div className="bg-blue-600 dark:bg-blue-800 text-white text-center font-bold py-2 text-xl">
                            Educational Qualification
                        </div>
                        <div className="p-6 text-justify text-sm font-medium leading-relaxed">
                            {educationDetails ? (
                                <p className="whitespace-pre-line">{formatText(educationDetails)}</p>
                            ) : (
                                <p className="text-center italic text-slate-500">See vacancy table below.</p>
                            )}
                        </div>
                    </div>

                    {/* Selection Process */}
                    <div>
                        <div className="bg-blue-600 dark:bg-blue-800 text-white text-center font-bold py-2 text-xl">
                            Mode of Selection
                        </div>
                        <ul className="p-6 list-decimal list-inside space-y-2 font-medium text-center md:text-left">
                            {selectionStages?.map((stage, i) => (
                                <li key={i}>{stage}</li>
                            ))}
                            {!selectionStages && <li className="italic text-slate-500 text-center list-none">As per Notification Rules</li>}
                        </ul>
                    </div>
                </div>
            )}

            {/* 5. Vacancy Details */}
            <div className="border-2 border-black dark:border-slate-600 mb-6">
                <div className="bg-black dark:bg-slate-800 text-white text-center font-bold py-2 text-xl">
                    Vacancy Details Total : {job.vacanciesCount} Post
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700">
                                {vacancies && vacancies.length > 0 ? (
                                    Object.keys(vacancies[0]).map((header, i) => (
                                        <th key={i} className="p-3 border-r border-slate-300 dark:border-slate-700 text-[#AC1E23] dark:text-red-400 uppercase text-sm">
                                            {header}
                                        </th>
                                    ))
                                ) : (
                                    <th className="p-3">Details</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {vacancies?.map((vac, i) => (
                                <tr key={i} className="border-b border-slate-300 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    {Object.values(vac).map((val, idx) => (
                                        <td key={idx} className="p-3 border-r border-slate-300 dark:border-slate-700">
                                            {String(val)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {!vacancies && (
                                <tr>
                                    <td className="p-4 text-slate-500 italic">No detailed vacancy info available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {educationShort && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-300 dark:border-slate-700 text-center text-sm">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Default Eligibility: </span>
                        {educationShort}
                    </div>
                )}
            </div>

            {/* 6. Application Process / How to Fill */}
            <div className="mb-6 p-6 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <h3 className="text-xl font-bold text-center text-[#008000] dark:text-emerald-400 mb-4 underline">
                    How to Fill {job.organization} Online Form {new Date().getFullYear()}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base font-medium text-slate-700 dark:text-slate-300">
                    <li>Candidate Read the Notification Before Apply the Recruitment Application Form in {job.organization}.</li>
                    <li>Kindly Check and Collect the All Document - Eligibility, ID Proof, Address Details, Basic Details.</li>
                    <li>Kindly Ready Scan Document Related to Recruitment Form - Photo, Sign, ID Proof, Etc.</li>
                    <li>Before Submit the Application Form Must Check the Preview and All Column Carefully.</li>
                    <li>If Candidate Required to Paying the Application Fee Must Submit. If You have Not the Required Application Fees Your Form is Not Completed.</li>
                    <li>Take A Print Out of Final Submitted Form.</li>
                </ul>
            </div>

            {/* 7. Extra Details (Dynamic) */}
            {extraDetails && extraDetails.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {extraDetails.map((detail, i) => (
                        <div key={i} className="border-2 border-purple-600 dark:border-purple-500">
                            <div className="bg-purple-600 dark:bg-purple-800 text-white text-center font-bold py-2 text-xl">
                                {formatText(detail.title)}
                            </div>
                            <div className="p-6">
                                <MarkdownText content={detail.content} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 8. Important Links */}
            <div className="border-2 border-[#FF00FF] dark:border-pink-600 mb-12">
                <div className="bg-[#FF00FF] dark:bg-pink-700 text-white text-center font-bold py-2 text-xl">
                    Useful Important Links
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse font-bold">
                        <tbody>
                            {/* Dynamic Links */}
                            {links?.map((link, i) => (
                                <tr key={i} className="border-b border-slate-300 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                    <td className="p-4 text-[#008000] dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 w-1/2 text-left pl-8 md:pl-16 border-r border-slate-300 dark:border-slate-700">
                                        {link.title}
                                    </td>
                                    <td className="p-4">
                                        <a href={link.url} target="_blank" className="font-extrabold text-[#AC1E23] dark:text-red-400 hover:underline">
                                            Click Here
                                        </a>
                                    </td>
                                </tr>
                            ))}

                            {/* Standard Fallbacks if no dynamic links */}
                            {/* Standard Fallbacks if specific links are missing */}
                            {(!links || !links.some(l => l.title.toLowerCase().includes("apply") || l.title.toLowerCase().includes("website"))) && job.officialUrl && (
                                <tr className="border-b border-slate-300 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                    <td className="p-4 text-[#008000] dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 w-1/2 text-left pl-8 md:pl-16 border-r border-slate-300 dark:border-slate-700">
                                        Apply Online / Website
                                    </td>
                                    <td className="p-4">
                                        <a href={job.officialUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#AC1E23] dark:text-red-400 hover:underline">
                                            Click Here
                                        </a>
                                    </td>
                                </tr>
                            )}

                            {(!links || !links.some(l => l.title.toLowerCase().includes("notification"))) && job.notificationPdf && (
                                <tr className="border-b border-slate-300 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                    <td className="p-4 text-[#008000] dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 w-1/2 text-left pl-8 md:pl-16 border-r border-slate-300 dark:border-slate-700">
                                        Download Notification
                                    </td>
                                    <td className="p-4">
                                        <a href={job.notificationPdf} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#AC1E23] dark:text-red-400 hover:underline">
                                            Click Here
                                        </a>
                                    </td>
                                </tr>
                            )}

                            {/* Telegram/WhatsApp Fixed Links */}
                            <tr className="border-b border-slate-300 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                <td className="p-4 text-[#008000] dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 w-1/2 text-left pl-8 md:pl-16 border-r border-slate-300 dark:border-slate-700">
                                    Join WhatsApp Channel
                                </td>
                                <td className="p-4">
                                    <a href="#" className="font-extrabold text-[#AC1E23] dark:text-red-400 hover:underline">
                                        Click Here
                                    </a>
                                </td>
                            </tr>
                            <tr className="hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                <td className="p-4 text-[#008000] dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 w-1/2 text-left pl-8 md:pl-16 border-r border-slate-300 dark:border-slate-700">
                                    Official Website
                                </td>
                                <td className="p-4">
                                    <a href={job.officialUrl || "#"} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#AC1E23] dark:text-red-400 hover:underline">
                                        Click Here
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Flow Assistant (Optional, can be toggleable) */}

        </main>
    );
}
