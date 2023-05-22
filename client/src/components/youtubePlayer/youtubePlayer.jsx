import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { stopVideoPlayer } from "./layout.js";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const YoutubePlayer = () => {
  // const videoPlayer = useSelector(state => state.layout.videoPlayer);
  // const dispatch = useDispatch();

  // if (!videoPlayer.visible) {
  //     return null;
  // }

  return (
    <div
      class={
        //   popRes == 1
        "active popup-outer !pointer-events-none top-0 right-0 z-10"
        // : "popup-outer z-10"
      }
    >
      <Draggable handle=".handle" defaultPosition={{x: 642, y: -269}}>
          <div className="relative w-full max-h-[400px] max-w-[500px] pointer-events-auto top-0 right-0">
            <div className="custom-youtube-player">
            <ResizableBox width={325} height={182} lockAspectRatio='true'>
              <iframe
                id="player"
                type="text/html"
                className="w-full h-full rounded-[15px] border shadow"
                src={`https://www.youtube.com/embed/YEZv0oNetco`}
                frameborder="0"
              ></iframe>
              <div className="options absolute right-0 top-[30px] bg-black rounded border text-white p-[2px]">

              <div
                className="close flex justify-center my-1"
                // onClick={() => dispatch(stopVideoPlayer())}
              >
                <i className="fas fa-times text-[14px]"></i>
              </div>
              <div className="handle flex justify-center my-1">
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
