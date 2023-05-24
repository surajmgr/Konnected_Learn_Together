import React, { useEffect, useState } from "react";
import YoutubePlayer from "./youtubePlayer";
import Youtube from "./youtubeApi.js";
import parse from "html-react-parser";
import moment from "moment";
import LargeLoading from "../utils/largeLoading";

function RecomVideos(props) {
  const [videoId, setVideoId] = useState("");
  const [videoInfo, setVideoInfo] = useState({});

  useEffect(() => {
    if (props.term && props.term != "undefined") {
      onTermSubmit(props.term);
    }
  }, [props.term]);

  const removeVideo = () => {
    setVideoId("");
  };

  const onTermSubmit = async (term) => {
    const results = await Youtube.get("/search", {
      params: {
        q: term,
      },
    });
    setVideoInfo(results.data.items);
  };

  return (
    <>
      {(
        <div className="recom-vid my-6">
          <div className="recom-vid-wrapper">
            <div className="top-bar w-full leading-[26px] font-[500] text-[20px]">
              Recommended Videos
            </div>
            <div className="carousel-vid pt-[1.5%] pb-[3%]">
              {videoInfo.length > 0 ?
                videoInfo.map((video, index) => (
                  <div
                    className={
                      "carousel-wrap border-b flex items-baseline py-[14px] mx-[13px] transform transition duration-500 hover:scale-[1.01] fos-animate-me fadeIn delay-0_" +
                      (index + 3)
                    }
                  >
                    <span
                      className="index min-w-[25px] font-[700] text-[#888]"
                      key={index + 1}
                    >
                      {index + 1}.
                    </span>
                    <div
                      id="quantifier"
                      onClick={(e) => {
                        e.preventDefault();
                        setVideoId(video.id.videoId);
                      }}
                      class="c-wrap inline font-[500] ml-[15px] outline-none cursor-pointer leading-[21px]"
                    >
                      <span
                        title={video.snippet.title}
                        class="RecomArtiTitle block font-[500] -ml-[5px] first-letter:uppercase truncate w-[545px]"
                      >
                        {parse(video.snippet.title)}
                      </span>
                      <div className="flex flex-start text-left text-[11px] text-[#999]">
                        <a
                          href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
                          title={parse(video.snippet.channelTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="-ml-[5px]"
                        >
                          {parse(video.snippet.channelTitle)}
                        </a>
                        <div class="ch-l-point"></div>
                        <div className="published-date">
                          {moment(video.snippet.publishedAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              :
              <div className="mt-[40px]">
              <LargeLoading />
              </div>
              }
            </div>
          </div>
        </div>
      )}
      {videoId !== "" && (
        <YoutubePlayer videoId={videoId} removeVideo={removeVideo} />
      )}
    </>
  );
}

export default RecomVideos;
