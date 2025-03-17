"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "@/components/VideoFeed";
import { IVideo } from "./models/Video";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      
      <VideoFeed videos={videos} />
    </main>
  );
}