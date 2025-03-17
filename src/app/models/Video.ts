import mongoose from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1280,
    height: 720
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}


const videoSchema = new mongoose.Schema<IVideo>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        default: true
    },
    transformation: {
        type: {
            height: Number,
            width: Number,
            quality: {
                type: Number,
                min: 1,
                max: 100
            }
        },
        default: {
            height: VIDEO_DIMENSIONS.height,
            width: VIDEO_DIMENSIONS.width,
            quality: 80
        }
    }
    },
    {
        timestamps: true,
    }
);

const Video = mongoose.models?.Video || mongoose.model<IVideo>("Video", videoSchema)

export default Video