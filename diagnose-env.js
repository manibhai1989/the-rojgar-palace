
console.log('=== Runtime Environment Diagnostics ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ':****@') : 'NOT SET');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? process.env.DIRECT_URL.replace(/:([^@]+)@/, ':****@') : 'NOT SET');

// Check for other common DB env vars
const patterns = ['DB', 'POSTGRES', 'SQL', 'PRISMA'];
const envKeys = Object.keys(process.env);

console.log('\nRelevant Env Vars:');
envKeys.filter(key => patterns.some(p => key.includes(p))).forEach(key => {
    let val = process.env[key];
    if (val && (val.includes('://') || key.includes('PASS') || key.includes('KEY') || key.includes('SECRET'))) {
        val = val.replace(/:([^@]+)@/, ':****@').substring(0, 20) + '...';
    }
    console.log(`${key}: ${val}`);
});

console.log('\n=== File System Check ===');
const fs = require('fs');
['.env', '.env.local', '.env.production', '.env.development', 'prisma/.env'].forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`[FOUND] ${file}`);
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('localhost') || content.includes('sarkari_hub')) {
            console.log(`  WARNING: ${file} contains "localhost" or "sarkari_hub"!`);
        }
    } else {
        console.log(`[MISSING] ${file}`);
    }
});
