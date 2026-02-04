import { NextResponse } from "next/server";

export async function POST(req: Request) {
    return new NextResponse("2FA Verification Temporarily Disabled due to missing dependencies", { status: 501 });
}
