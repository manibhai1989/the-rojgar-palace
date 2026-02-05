import { Metadata } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    Lightbulb,
    BookOpen,
    Users,
    Briefcase,
    ShieldCheck,
    MapPin,
    Mail,
    Phone,
    Linkedin,
    Globe,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'About Us | The Job Palace',
    description: 'Welcome to The Job Palace — your trusted gateway to meaningful career opportunities in the education and technology sectors.',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-6xl font-sans">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-16">
                <Badge variant="outline" className="px-4 py-1 text-sm border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                    About The Job Palace
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Your Trusted Gateway to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Meaningful Career Opportunities</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                    Welcome to The Job Palace. Founded with a vision to bridge the gap between talented professionals and reputable institutions, we are more than just a job portal. We are a platform built by educators, for educators, and tech enthusiasts who are passionate about shaping the future through knowledge, skill, and innovation.
                </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
                <Card className="bg-slate-50 dark:bg-slate-900/50 border-none shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Target className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 space-y-4 relative z-10">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            To empower job seekers with tailored opportunities that match their skills, aspirations, and potential, while enabling educational and tech organizations to find dedicated, qualified professionals who can contribute to their growth and excellence.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-900/50 border-none shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Lightbulb className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 space-y-4 relative z-10">
                        <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            To become India’s most reliable and comprehensive job portal for the education and IT sectors, known for integrity, relevance, and personalized career support.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* What We Offer */}
            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Curated Job Listings",
                            desc: "Handpicked opportunities in teaching, computer science, cyber security, IT training, and educational administration.",
                            icon: Briefcase,
                            color: "text-purple-600",
                            bg: "bg-purple-100 dark:bg-purple-900/20"
                        },
                        {
                            title: "Career Guidance",
                            desc: "Resources, resume tips, and interview preparation tailored for educators and tech professionals.",
                            icon: BookOpen,
                            color: "text-emerald-600",
                            bg: "bg-emerald-100 dark:bg-emerald-900/20"
                        },
                        {
                            title: "Employer Connect",
                            desc: "A streamlined hiring platform for schools, colleges, training centers, and tech firms.",
                            icon: Users,
                            color: "text-blue-600",
                            bg: "bg-blue-100 dark:bg-blue-900/20"
                        },
                        {
                            title: "Skill Development Insights",
                            desc: "Stay updated with certifications, courses, and industry trends in education and technology.",
                            icon: ShieldCheck,
                            color: "text-orange-600",
                            bg: "bg-orange-100 dark:bg-orange-900/20"
                        }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-colors bg-white dark:bg-slate-950">
                            <div className={`shrink-0 p-3 rounded-lg ${item.bg}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">Why Choose The Job Palace?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mx-auto md:mx-0">
                            <Users className="h-6 w-6 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-amber-400">Founded & Developed by</h3>
                        <p className="text-slate-300 leading-relaxed">
                            <span className="text-white font-bold block text-lg mb-1">Manish Singh Chauhan</span>
                            Teacher, Web Developer, and Cyber Security Enthusiast. This platform is a result of his vision to merge education with technology.
                        </p>
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mx-auto md:mx-0">
                            <Target className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-blue-400">Sector-Specific Focus</h3>
                        <p className="text-slate-300 leading-relaxed">
                            We specialize in education and technology roles, ensuring relevant and high-quality listings.
                        </p>
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mx-auto md:mx-0">
                            <Briefcase className="h-6 w-6 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-pink-400">User-Centric Approach</h3>
                        <p className="text-slate-300 leading-relaxed">
                            Simple, transparent, and supportive—every step of the way.
                        </p>
                    </div>
                </div>
            </div>

            {/* Join Our Community */}
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Join Our Community</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    Whether you are a teacher, a computer instructor, a cyber security aspirant, or an institution looking for the right talent—The Job Palace is here to help you build, grow, and succeed.
                </p>
            </div>

            {/* Contact Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase">Email</p>
                                    <a href="mailto:manish.icst@gmail.com" className="text-slate-900 dark:text-white font-medium hover:text-amber-600">
                                        manish.icst@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase">Phone</p>
                                    <p className="text-slate-900 dark:text-white font-medium">+91 7000120479</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase">Address</p>
                                    <p className="text-slate-900 dark:text-white font-medium">Ekta Colony Rajiv Gandhi Ward Bina District Sagar M.P 470113</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Online Presence</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Globe className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase">Website</p>
                                    <Link href="/" className="text-slate-900 dark:text-white font-medium hover:text-purple-600">
                                        www.thejobpalace.in
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Linkedin className="h-5 w-5 text-blue-700 dark:text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase">LinkedIn</p>
                                    <a href="https://www.linkedin.com/in/manish-singh-13923610" target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white font-medium hover:text-blue-700">
                                        manish-singh-13923610
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
