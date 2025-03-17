"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface VideoFormData {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
}

export default function VideoUploadForm() {
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { showNotification } = useNotification();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VideoFormData>({
        defaultValues: {
            title: "",
            description: "",
            videoUrl: "",
            thumbnailUrl: "",
        },
    });

    const handleUploadSuccess = (response: IKUploadResponse) => {
        setValue("videoUrl", response.filePath);
        console.log("response in videouploadform is ",response)
        setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
        showNotification("Video uploaded successfully!", "success");
    };

    const handleUploadProgress = (progress: number) => {
        setUploadProgress(progress);
    };

    const onSubmit = async (data: VideoFormData) => {
        if (!data.videoUrl) {
            showNotification("Please upload a video first", "error");
            return;
        }

        setLoading(true);
        try {
            await apiClient.createVideo(data);
            showNotification("Video published successfully!", "success");

            // Reset form after successful submission
            setValue("title", "");
            setValue("description", "");
            setValue("videoUrl", "");
            setValue("thumbnailUrl", "");
            setUploadProgress(0);
        } catch (error) {
            showNotification(
                error instanceof Error ? error.message : "Failed to publish video",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-5 shadow-2xl rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Upload New Video</h2>
            
            <div className="form-control">
                <label className="label font-medium">
                    <span className="label-text">Video Title</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter a catchy title for your video"
                    className={`input input-bordered rounded-xl w-full focus:outline-primary ${errors.title ? "input-error" : ""}`}
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <span className="text-error text-sm mt-1">
                        {errors.title.message}
                    </span>
                )}
            </div>

            <div className="form-control">
                <label className="label font-medium">
                    <span className="label-text">Video Description</span>
                </label>
                <textarea
                    placeholder="Describe what your video is about"
                    className={`textarea textarea-bordered rounded-2xl h-24 w-full focus:outline-primary ${errors.description ? "textarea-error" : ""}`}
                    {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                    <span className="text-error text-sm mt-1">
                        {errors.description.message}
                    </span>
                )}
            </div>

            <div className="form-control">
                <label className="label font-medium">
                    <span className="label-text">Upload Video</span>
                </label>
                <FileUpload
                    fileType="video"
                    onSuccess={handleUploadSuccess}
                    onProgress={handleUploadProgress}
                />
                {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="btn btn-primary btn-block mt-8"
                disabled={loading || !uploadProgress}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing Video...
                    </>
                ) : (
                    "Publish Video"
                )}
            </button>
        </form>
    );
}