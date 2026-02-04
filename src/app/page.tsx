import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 60; // Revalidate every minute

async function getLatestJobs() {
  try {
    return await prisma.job.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

async function getLatestResults() {
  try {
    return await prisma.result.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
}

async function getLatestAdmitCards() {
  try {
    return await prisma.admitCard.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching admit cards:", error);
    return [];
  }
}

async function getLatestAnswerKeys() {
  try {
    return await prisma.answerKey.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching answer keys:", error);
    return [];
  }
}

async function getLatestSyllabus() {
  try {
    return await prisma.syllabus.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    return [];
  }
}

async function getLatestAdmissions() {
  try {
    return await prisma.admission.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return [];
  }
}


export default async function Home() {
  const [
    latestJobs,
    latestResults,
    latestAdmitCards,
    latestAnswerKeys,
    latestSyllabus,
    latestAdmissions
  ] = await Promise.all([
    getLatestJobs(),
    getLatestResults(),
    getLatestAdmitCards(),
    getLatestAnswerKeys(),
    getLatestSyllabus(),
    getLatestAdmissions()
  ]);

  return (
    <main>
      <HomeClient
        latestJobs={latestJobs}
        latestResults={latestResults}
        latestAdmitCards={latestAdmitCards}
        latestAnswerKeys={latestAnswerKeys}
        latestSyllabus={latestSyllabus}
        latestAdmissions={latestAdmissions}
      />
    </main>
  );
}

