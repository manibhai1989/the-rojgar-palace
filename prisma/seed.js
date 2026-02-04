const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create sample jobs
    const jobs = await Promise.all([
        prisma.job.create({
            data: {
                title: 'UPSC Civil Services Examination 2024',
                slug: 'upsc-cse-2024',
                organization: 'Union Public Service Commission',
                category: 'UPSC',
                shortInfo: 'Civil Services Examination for IAS, IPS, IFS and other services',
                vacanciesCount: 1000,
                salaryRange: '₹56,100 - ₹2,50,000',
                location: 'All India',
                endDate: new Date('2024-03-31'),
                examDate: new Date('2024-06-15'),
                officialUrl: 'https://upsc.gov.in',
                isNew: true,
            },
        }),
        prisma.job.create({
            data: {
                title: 'SSC CGL 2024 - Combined Graduate Level',
                slug: 'ssc-cgl-2024',
                organization: 'Staff Selection Commission',
                category: 'SSC',
                shortInfo: 'Combined Graduate Level Examination for various Group B and C posts',
                vacanciesCount: 5000,
                salaryRange: '₹25,500 - ₹81,100',
                location: 'All India',
                endDate: new Date('2024-02-28'),
                examDate: new Date('2024-05-20'),
                officialUrl: 'https://ssc.nic.in',
                isNew: true,
            },
        }),
        prisma.job.create({
            data: {
                title: 'Railway Recruitment 2024 - Group D',
                slug: 'rrb-group-d-2024',
                organization: 'Railway Recruitment Board',
                category: 'Railway',
                shortInfo: 'Recruitment for various Group D posts in Indian Railways',
                vacanciesCount: 10000,
                salaryRange: '₹18,000 - ₹56,900',
                location: 'All India',
                endDate: new Date('2024-03-15'),
                examDate: new Date('2024-06-01'),
                officialUrl: 'https://rrbcdg.gov.in',
                isUrgent: true,
                isNew: true,
            },
        }),
    ]);

    console.log(`✅ Created ${jobs.length} sample jobs`);

    // Create sample results
    const results = await Promise.all([
        prisma.result.create({
            data: {
                title: 'UPSC CSE 2023 Final Result',
                organization: 'UPSC',
                category: 'UPSC',
                link: 'https://upsc.gov.in/results',
            },
        }),
        prisma.result.create({
            data: {
                title: 'SSC CGL 2023 Tier-II Result',
                organization: 'SSC',
                category: 'SSC',
                link: 'https://ssc.nic.in/results',
            },
        }),
    ]);

    console.log(`✅ Created ${results.length} sample results`);

    // Create sample admit cards
    const admitCards = await Promise.all([
        prisma.admitCard.create({
            data: {
                title: 'UPSC CSE 2024 Prelims Admit Card',
                organization: 'UPSC',
                category: 'UPSC',
                examDate: new Date('2024-06-15'),
                link: 'https://upsc.gov.in/admit-card',
            },
        }),
        prisma.admitCard.create({
            data: {
                title: 'SSC CGL 2024 Tier-I Admit Card',
                organization: 'SSC',
                category: 'SSC',
                examDate: new Date('2024-05-20'),
                link: 'https://ssc.nic.in/admit-card',
            },
        }),
    ]);

    console.log(`✅ Created ${admitCards.length} sample admit cards`);

    // Create sample answer keys
    const answerKeys = await Promise.all([
        prisma.answerKey.create({
            data: {
                title: 'UPSC CSE 2023 Prelims Answer Key',
                organization: 'UPSC',
                category: 'UPSC',
                link: 'https://upsc.gov.in/answer-key',
            },
        }),
        prisma.answerKey.create({
            data: {
                title: 'SSC CGL 2023 Answer Key',
                organization: 'SSC',
                category: 'SSC',
                link: 'https://ssc.nic.in/answer-key',
            },
        }),
    ]);

    console.log(`✅ Created ${answerKeys.length} sample answer keys`);

    // Create sample syllabus
    const syllabus = await Promise.all([
        prisma.syllabus.create({
            data: {
                title: 'UPSC CSE 2024 Detailed Syllabus',
                organization: 'UPSC',
                category: 'UPSC',
                link: 'https://upsc.gov.in/syllabus',
            },
        }),
        prisma.syllabus.create({
            data: {
                title: 'SSC CGL 2024 Exam Pattern & Syllabus',
                organization: 'SSC',
                category: 'SSC',
                link: 'https://ssc.nic.in/syllabus',
            },
        }),
    ]);

    console.log(`✅ Created ${syllabus.length} sample syllabus`);

    // Create sample admissions
    const admissions = await Promise.all([
        prisma.admission.create({
            data: {
                title: 'IIT JEE Advanced 2024 Admission',
                organization: 'IIT',
                category: 'Engineering',
                link: 'https://jeeadv.ac.in',
            },
        }),
        prisma.admission.create({
            data: {
                title: 'NEET UG 2024 Medical Admission',
                organization: 'NTA',
                category: 'Medical',
                link: 'https://nta.ac.in/neet',
            },
        }),
    ]);

    console.log(`✅ Created ${admissions.length} sample admissions`);

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
