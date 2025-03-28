"use client"
import { IVideo } from "@/app/models/Video";
import VideoComponent from "./VideoComponent";
import VideoPlayer from "./VideoPlayer";
import { useEffect, useState } from "react";
interface VideoFeedProps {
    videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
    const [selectedVideo,setSelectedVideo] = useState<IVideo>(videos[0])

    const [showVideo, setShowVideo] = useState(false);
    const [nextButtonDisable, setNextButtonDisable] = useState(false)
    const [prevButtonDisable, setPrevButtonDisable] = useState(false)

    const PlayNextVideo = () => {
      const currentIndex = videos.indexOf(selectedVideo)
      if (currentIndex < videos.length - 1) {
        setSelectedVideo(videos[currentIndex + 1])
      }
    }

    const PlayPrevVideo = () => {
      const currentIndex = videos.indexOf(selectedVideo)
      if (currentIndex > 0) {
        setSelectedVideo(videos[currentIndex - 1])
      }
    }

    useEffect(() => {
      if (videos.length <= 1) {
        setPrevButtonDisable(true)
        setNextButtonDisable(true)
      } else {
        const currentIndex = videos.indexOf(selectedVideo)
        setPrevButtonDisable(currentIndex === 0)
        setNextButtonDisable(currentIndex === videos.length - 1)
      }
    }, [videos, selectedVideo])

    useEffect(() => {
      if (videos.length > 0) {
        setSelectedVideo(videos[0])
      }
    }, [videos])

    const showVideoFalse = () => {
        setShowVideo(false)
    }

    const handleVideoClick = (video: IVideo) => {
        setSelectedVideo(video);
        setShowVideo(true);
    };

    return (
        <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {videos.map((video) => (
                    <div className="cursor-pointer"
                        key={video._id?.toString()}
                        onClick={() => handleVideoClick(video)}>
                        <VideoComponent video={video} />
                    </div>
                ))}

                
                

                {videos.length === 0 && (
                    <div className="col-span-full flex justify-center items-center text-center py-12">
              <span className="loading loading-ring loading-xl"></span>
                    </div>
                )}
            </div>
            
            {showVideo && (
                <div className="fixed inset-0 z-50 bg-black/70 overflow-hidden">
                    <div className="h-[90vh] mt-[5vh] w-screen flex items-center justify-center py-4">
                        <VideoPlayer 
                            video={selectedVideo} 
                            showVideoFalse={showVideoFalse}
                            PlayNextVideo={PlayNextVideo}
                            PlayPrevVideo={PlayPrevVideo}
                            nextButtonDisable={nextButtonDisable}
                            prevButtonDisable={prevButtonDisable}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}