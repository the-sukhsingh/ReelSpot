import { IKVideo } from "imagekitio-next";
import { IVideo } from "@/app/models/Video";


export default function VideoComponent({ video}: { video: IVideo}) {
    return <div className="card outline-0 outline-offset-0 bg-base-100 hover:shadow-lg transition-all duration-300 shadow-md">
            <figure className="relative md:px-4 md:pt-4">
                    <div
                        className="md:rounded-xl overflow-hidden relative w-full"
                        style={{ aspectRatio: "9/16" }}
                    >
                        <IKVideo
                            path={video.videoUrl}
                            transformation={[
                                {
                                    height: "1280",
                                    width: "720",
                                },
                            ]}
                            className="w-full h-full object-contain"
                        />
                    </div>
            </figure>

            <div className="card-body p-2 md:p-4">
                <div
                    className="hover:opacity-80 transition-opacity"
                >
                    <h2 className="card-title text-sm md:text-lg">{video.title}</h2>
                </div>

            </div>
        </div>
    
}