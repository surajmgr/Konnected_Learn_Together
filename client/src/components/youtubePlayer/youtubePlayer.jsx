import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { stopVideoPlayer } from "./layout.js";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import LargeLoading from "../utils/largeLoading.jsx";

const YoutubePlayer = (props) => {
  const [loading, setLoading] = useState(true);
  const videoId = props.videoId;
  useEffect(() => {
    setLoading(true);
  }, [videoId]);

  return (
    <div
      class={
        //   popRes == 1
        "active popup-outer !pointer-events-none top-0 right-0 z-10"
        // : "popup-outer z-10"
      }
    >
      <Draggable handle=".handle" defaultPosition={{ x: 525, y: 280 }}>
        <div className="relative w-full max-h-[400px] max-w-[500px] pointer-events-auto top-0 right-0 fos-animate-me fadeIn delay-0_1">
          <div className="custom-youtube-player">
            <ResizableBox min-constrainst="[100,100]" width={432} height={243}>
              {loading &&
            <div className="w-full h-full rounded-[15px] border shadow bg-black">
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <LargeLoading />
                </div>              
              </div>}
              <iframe
                id="player"
                type="text/html"
                className={loading ? "hidden " : "" + "w-full h-full rounded-[15px] border shadow fos-animate-me"}
                src={`https://www.youtube.com/embed/${videoId}`}
                onLoad={()=>setLoading(false)}
                frameborder="0"
                allowFullScreen="true"
              ></iframe>
              <div className="handle options absolute right-0 top-[30px] bg-black rounded border text-white p-[2px] opacity-[0.3] hover:opacity-[1]">
                <div
                  className="close flex justify-center my-1 cursor-pointer"
                  onClick={() => props.removeVideo()}
                >
                  <i className="fas fa-times text-[14px]"></i>
                </div>
                <div className="handle flex justify-center my-1 cursor-pointer">
                  <i className="fas fa-arrows-alt text-[14px]"></i>
                </div>
              </div>
            </ResizableBox>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default YoutubePlayer;
