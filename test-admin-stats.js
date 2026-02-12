const API_URL = 'http://localhost:3000';

async function testAdminStats() {
    try {
        console.log('Testing admin stats endpoint...');

        // This won't work directly due to auth, but we can test the server action
        const { getDashboardStats } = require('./src/actions/admin/get-stats.ts');

        console.log('Calling getDashboardStats...');
        const stats = await getDashboardStats();

        console.log('\n✅ Stats retrieved successfully!');
        console.log('System Health:', stats.systemHealth);
        console.log('Total Seekers:', stats.totalSeekers);
        console.log('Active Jobs:', stats.activeJobs);
        console.log('Applications:', stats.applications);
        console.log('Recent Activities:', stats.recentActivities.length);

        if (!stats.systemHealth) {
            console.error('\n❌ System health is FALSE!');
        }

        process.exit(stats.systemHealth ? 0 : 1);
    } catch (error) {
        console.error('\n❌ Error testing stats:');
        console.error(error);
        process.exit(1);
    }
}

testAdminStats();
