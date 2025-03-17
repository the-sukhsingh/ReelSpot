
import { connectToDb } from "@/lib/db";
import Video from "@/app/models/Video";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }>}) {
    try {
        const id = (await params).id;
        await connectToDb();
        const videos = await Video.findById(id);
        if (!videos || videos.length === 0) {
            return NextResponse.json({ error: "No videos found" }, { status: 404 });
        }
        return NextResponse.json(videos);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
