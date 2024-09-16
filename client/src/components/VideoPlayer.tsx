import { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{ stream?: MediaStream; userName: string }> = ({
  stream,
  userName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className=" rounded-md overflow-hidden">
      <div className=" w-full h-10 flex items-center px-5 bg-slate-100">
        <span>{userName}</span>
      </div>
      <video
        data-testid="peer-video"
        className=" w-full h-full"
        ref={videoRef}
        autoPlay
        muted={true}
      />
    </div>
  );
};

export default VideoPlayer;
