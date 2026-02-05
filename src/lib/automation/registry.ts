
export interface SourceConfig {
    id: string;
    name: string;
    url: string;
    selector: string; // CSS selector to find the link
    keywords: string[]; // Keywords to filter relevant links
    logo?: string;
}

export const SOURCES: SourceConfig[] = [
    {
        id: "upsc-official",
        name: "UPSC Official",
        url: "https://upsc.gov.in/whats-new",
        selector: ".views-row a",
        keywords: ["Examination", "Notification", "Recruitment"],
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Union_Public_Service_Commission_Logo.svg/100px-Union_Public_Service_Commission_Logo.svg.png"
    },
    {
        id: "ssc-hq",
        name: "SSC Headquaters",
        url: "https://ssc.nic.in/",
        selector: ".latest_new_box ul li a",
        keywords: ["Notice", "Examination", "Constable", "CGL", "CHSL"],
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Staff_Selection_Commission_Logo.svg/100px-Staff_Selection_Commission_Logo.svg.png"
    },
    {
        id: "rrb-cdg",
        name: "RRB Chandigarh",
        url: "https://www.rrbcdg.gov.in/",
        selector: ".news_links a",
        keywords: ["CEN", "Recruitment", "Technician", "NTPC"],
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Indian_Railways_Logo.svg/100px-Indian_Railways_Logo.svg.png"
    }
];
