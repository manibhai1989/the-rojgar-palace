import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@") : "NOT SET",
        DIRECT_URL: process.env.DIRECT_URL ? process.env.DIRECT_URL.replace(/:([^@]+)@/, ":****@") : "NOT SET",
        NODE_ENV: process.env.NODE_ENV,
        cwd: process.cwd(),
    });
}
