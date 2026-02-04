import { ResumeData } from "../context/ResumeContext";

export class ATSScanner {
    private requiredSections = ['personal', 'education', 'experience', 'skills'];

    // Action verbs to look for in experience
    private actionVerbs = new Set([
        'developed', 'managed', 'led', 'created', 'designed', 'implemented', 'optimized',
        'increased', 'reduced', 'saved', 'achieved', 'launched', 'mentored', 'analyzed',
        'collaborated', 'engineered', 'architected', 'spearheaded', 'orchestrated'
    ]);

    // Words that imply quantification
    private quantifiers = new Set([
        '%', '$', 'percent', 'dollar', 'budget', 'revenue', 'users', 'clients', 'customers',
        'efficiency', 'growth', 'reduction'
    ]);

    calculateScore(resume: ResumeData, jobDescription: string = ""): { score: number, suggestions: string[] } {
        let score = 0;
        const suggestions: string[] = [];

        // 1. Completeness (Max 40 points)
        let completenessScore = 0;
        if (resume.personal.fullName && resume.personal.email && resume.personal.phone) completenessScore += 10;
        else suggestions.push("Missing basic contact information.");

        if (resume.education.length > 0) completenessScore += 10;
        else suggestions.push("Add at least one education entry.");

        if (resume.experience.length > 0) completenessScore += 10;
        else suggestions.push("Add at least one work experience.");

        if (resume.skills.length >= 5) completenessScore += 10;
        else suggestions.push("Add at least 5 key skills.");

        score += completenessScore;

        // 2. Content Quality (Max 30 points)
        let qualityScore = 0;
        let actionVerbCount = 0;
        let quantifierCount = 0;
        let totalBullets = 0;

        resume.experience.forEach(exp => {
            const descLower = exp.description.toLowerCase();
            totalBullets++;

            // Check for action verbs
            let hasVerb = false;
            this.actionVerbs.forEach(verb => {
                if (descLower.includes(verb)) hasVerb = true;
            });
            if (hasVerb) actionVerbCount++;

            // Check for quantification (numbers, %, $)
            let hasQuantifier = false;
            if (/\d+/.test(descLower) || [...this.quantifiers].some(q => descLower.includes(q))) {
                hasQuantifier = true;
            }
            if (hasQuantifier) quantifierCount++;
        });

        if (totalBullets > 0) {
            // Up to 15 points for Action Verbs
            const verbRatio = actionVerbCount / totalBullets;
            if (verbRatio > 0.7) qualityScore += 15;
            else if (verbRatio > 0.4) qualityScore += 10;
            else {
                qualityScore += 5;
                suggestions.push("Use more strong action verbs (e.g., 'Developed', 'Led') in your experience.");
            }

            // Up to 15 points for Quantification
            const quantRatio = quantifierCount / totalBullets;
            if (quantRatio > 0.5) qualityScore += 15;
            else if (quantRatio > 0.2) qualityScore += 10;
            else {
                qualityScore += 5;
                suggestions.push("Quantify your achievements (e.g., 'Increased revenue by 20%').");
            }
        }
        score += qualityScore;

        // 3. Keyword Matching (Max 30 points if JD provided, else bonus)
        if (jobDescription.trim().length > 50) {
            const jdKeywords = this.extractKeywords(jobDescription);
            if (jdKeywords.length > 0) {
                const resumeText = JSON.stringify(resume).toLowerCase();
                let matchCount = 0;

                jdKeywords.forEach(keyword => {
                    if (resumeText.includes(keyword)) matchCount++;
                });

                const matchRatio = matchCount / jdKeywords.length;
                const keywordPoints = Math.min(30, Math.round(matchRatio * 50)); // Scaling factor
                score += keywordPoints;

                if (matchRatio < 0.5) {
                    suggestions.push(`Low keyword match with Job Description. Try adding: ${jdKeywords.slice(0, 3).join(", ")}`);
                }
            } else {
                score += 30; // Default full points if JD is too generic/short but exists
            }
        } else {
            // If no JD, we distribute the remaining 30 points based on general best practices
            score += 0;
            suggestions.push("Add a Job Description to check keyword matching score.");
            // Normalize score to look good without JD (base out of 70) -> scale to 100
            if (score > 0) {
                score = Math.round((score / 70) * 100);
            }
        }

        return {
            score: Math.min(100, score),
            suggestions: suggestions.slice(0, 5) // Top 5 suggestions
        };
    }

    private extractKeywords(text: string): string[] {
        // Simple stop-word filtering
        const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among']);

        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopWords.has(w))
            .filter((v, i, a) => a.indexOf(v) === i); // Unique
    }
}
