"use client"
import { IVideo } from '@/app/models/Video';
import { IKVideo } from 'imagekitio-next';
import { ArrowDownToLine, ArrowLeft, ArrowRight, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'



const VideoPlayer = ({ video, showVideoFalse, PlayNextVideo, PlayPrevVideo, nextButtonDisable, prevButtonDisable }: { 
    video: IVideo,
    showVideoFalse: () => void,
    PlayNextVideo: () => void, 
    PlayPrevVideo: () => void,
    nextButtonDisable: boolean,
    prevButtonDisable: boolean
},) => {
    const [downloadLoading, setDownloadLoading] = React.useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [videoEnd, setVideoEnd] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [videoBlob, setVideoBlob] = useState<string>('')


    // Find the video element within the container
    const getVideoElement = (): HTMLVideoElement | null => {
        if (!containerRef.current) return null;
        return containerRef.current.querySelector('video');
    };

    // This effect runs once the component mounts to set up the videoRef
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const videoEl = containerRef.current.querySelector('video');
                if (videoEl && videoRef.current !== videoEl) {
                    videoRef.current = videoEl;
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [video]);

    const togglePlayPause = () => {
        const videoElement = getVideoElement();
        if (!videoElement) return;

        if (isPlaying) {
            videoElement.pause();
        } else {
            videoElement.play().catch(err => console.error("Error playing video:", err));
        }

        setIsPlaying(!isPlaying);
        setShowControls(true);

        // Clear any existing timer
        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
        }

        // Keep the play button when the video is paused and hide the pause button when the video is played after 1.2s

        if (!isPlaying) {
            controlsTimerRef.current = setTimeout(() => {
                setShowControls(false);
            }, 1200);
        }

    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering play/pause

        const videoElement = getVideoElement();
        if (!videoElement) return;

        videoElement.muted = !isMuted;
        setIsMuted(!isMuted);
    };


    // Function to replay the video
    const handleReplay = (e: React.MouseEvent) => {
        e.stopPropagation();
        const videoElement = getVideoElement();
        if (videoElement) {
            videoElement.currentTime = 0;
            setIsPlaying(true);
            setVideoEnd(false);
            // Force play state update before playing
            togglePlayPause();
            Promise.resolve().then(() => {
                videoElement.play().catch(err => {
                    console.error("Failed to replay video:", err);
                    setIsPlaying(false);
                });
            });
        }
    };


    const onVideoEnded = () => {
        setVideoEnd(true);
        setIsPlaying(false);
        setShowControls(true);
    };

    useEffect(() => {
        const videoElement = getVideoElement();
        if (videoElement) {
            videoElement.addEventListener('ended', onVideoEnded);
            return () => videoElement.removeEventListener('ended', onVideoEnded);
        }
    }, [video]);

    // Let IKVideo render first before trying to access the video element
    useEffect(() => {
        if (video?.videoUrl) {
            // Short delay to ensure the IKVideo has rendered
            setIsPlaying(false);
            setShowControls(true)
            const timer = setTimeout(async () => {
                console.log("Checking for video element after render");
                const videoEl = containerRef.current?.querySelector('video');
                if (videoEl) {
                    console.log("Video element found");
                    const videoLink = process.env.NEXT_PUBLIC_URL_ENDPOINT + video.videoUrl
                    const response = await fetch(videoLink); // Fetch the video
                    const blob = await response.blob();
                    setVideoBlob(URL.createObjectURL(blob));
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [video]);

    const handleDownload = async () => {
        if (!video?.videoUrl) {
            console.error("Video URL not available");
            return;
        }

        try {
            setDownloadLoading(true);
            const link = document.createElement("a");
            link.href = videoBlob;
            link.download = video.title ? `${video.title.split(" ").join("_")}.mp4` : 'video.mp4';
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading video:", error);
        } finally {
            setDownloadLoading(false);
        }
    };

    return (
        <div className="bg-base-100 shadow hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row justify-between gap-4 p-2 md:p-4 max-h-[90vh] max-w-7xl mx-auto overflow-y-auto rounded-xl">

            <figure className='w-full lg:w-1/2 flex justify-center items-center p-1 md:p-2'>

                <div
                    className="rounded-xl w-fit overflow-hidden relative h-[60vh] lg:h-full border-2"
                    style={{ maxWidth: '720px', aspectRatio: "9/16" }}
                >
                    <div
                        className="relative w-full h-full"
                        ref={containerRef}
                        onClick={togglePlayPause}
                    >

                        <div className={`w-full h-full transition-all duration-300 ${videoEnd ? 'brightness-50' : ''}`}>
                            <IKVideo
                                path={video?.videoUrl}
                                transformation={[
                                    {
                                        height: "1280",
                                        width: "720",
                                    },
                                ]}
                                className="w-full h-full object-contain cursor-pointer"
                                controls={false}
                                onEnded={onVideoEnded}
                            />
                        </div>

                        {/* Play/Pause overlay indicator */}
                        {showControls && !videoEnd && (
                            <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-4 transition-opacity delay-75 duration-300 opacity-100"
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                                    </svg>
                                )}
                            </div>
                        )}

                        {/* Replay button for video end - IMPROVED */}
                        {videoEnd && (
                            <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 rounded-full p-6 cursor-pointer hover:bg-opacity-90 transition-all z-20 animate-pulse"
                                onClick={handleReplay}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 16 16">
                                    <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                                </svg>
                            </div>
                        )}

                        {/* Mute/Unmute button */}
                        <button
                            className="absolute bottom-3 right-3 cursor-pointer bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
                            onClick={toggleMute}
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                                    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </figure>

            <figure className='w-full lg:w-1/2 p-2 space-y-3'>
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-mono'>
                    {video?.title}
                </h1>
                <h2 className='text-lg md:text-xl lg:text-2xl font-sans'>
                    {video?.description}
                </h2>

                <button
                    className='btn btn-dash w-full md:w-auto'
                    type='button'
                    onClick={handleDownload}
                    disabled={!video?.videoUrl || downloadLoading}
                >
                    <ArrowDownToLine />
                    {downloadLoading ? 'Downloading...' : 'Download Video'}
                </button>
            </figure>
            <button
                className='z-50 fixed top-4 right-4 btn btn-circle'
                onClick={showVideoFalse}
            >
                <X />
            </button>

            <button
                className="z-50 fixed top-1/2 left-4 btn btn-circle disabled:cursor-not-allowed"
                onClick={PlayPrevVideo}
                disabled={prevButtonDisable}
            >
                <ArrowLeft />
            </button>

            <button
                className="z-50 fixed top-1/2 right-4 btn btn-circle disabled:cursor-not-allowed"
                onClick={PlayNextVideo}
                disabled={nextButtonDisable}
            >
                <ArrowRight />
            </button>

        </div>
)}

export default VideoPlayer