import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/app/models/User";

export async function POST(request: NextRequest) {
    try{
        const { email, password } = await request.json();

        if(!email || !password){
            return NextResponse.json({ error: "Missing email or password" },
                {status: 400}
            );
        }


        await connectToDb();

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return NextResponse.json({ error: "User already exists" },
                {status: 400}
            );
        }

        await User.create({ email, password });

        return NextResponse.json(
            {message: "User Registered successfully"},
            {status: 201}
        );
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ error },{status:500});
    }
}