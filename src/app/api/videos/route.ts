import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/app/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const videos = await Video.find().sort({ createdAt: -1 })
    if(!videos || videos.length === 0){
        return NextResponse.json({error: "No videos found"}, {status: 404});
    }
    return NextResponse.json(videos);
  } catch (error) {
    console.log("Error is ",error)
    return NextResponse.json({ error: "Internal Server Error" },{status:500});
  }
}


export async function POST(req: Request){

    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        await connectToDb();

        const body:IVideo = await req.json();


        if(!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl){
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const videoData = {
            ...body,
            controls: body.controls || true,
            transformation: {
                height: 1280,
                width: 720,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo, {status: 201});


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to store the video data." }, { status: 500 });

    }

}