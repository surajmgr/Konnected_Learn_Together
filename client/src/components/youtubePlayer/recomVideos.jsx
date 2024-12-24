import React, { useEffect, useState } from "react";
import YoutubePlayer from "./youtubePlayer";
import Youtube from "./youtubeApi.js";
import parse from "html-react-parser";
import moment from "moment";
import LargeLoading from "../utils/largeLoading";
import axios from "axios";
import { Store } from "react-notifications-component";

function getUnique(array, key) {
  if (typeof key !== "function") {
    const property = key;
    key = function (item) {
      return item[property];
    };
  }
  return Array.from(
    array
      .reduce(function (map, item) {
        const k = key(item);
        if (!map.has(k)) map.set(k, item);
        return map;
      }, new Map())
      .values()
  );
}

function RecomVideos(props) {
  const [videoId, setVideoId] = useState("");
  const [videoInfo, setVideoInfo] = useState([]);

  useEffect(() => {
    if (props.term && props.term != "undefined - undefined") {
      onTermSubmit(props.term);
    }
  }, [props.term]);

  const removeVideo = () => {
    setVideoId("");
  };

  const onTermSubmit = async (term) => {
    try {
      const results = await Youtube.get("/search", {
        params: {
          q: term,
        },
      });
      results.data.items.map((item) => {
        setVideoInfo((prev) => [...prev, {
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          publishedAt: moment(item.snippet.publishedAt).fromNow()
        }]);
      });
    } catch (error) {
      try {
        console.log(error);
        const results = await axios.get(
          `${
            process.env.REACT_APP_API_BASE_URL
          }/yt?searchTerm=${encodeURIComponent(term)}`
        );
        results.data.map((item) => {
          setVideoInfo((prev) => [
            ...prev,
            {
              videoId: item.id,
              title: item.title,
              channelId: item.channel.id,
              channelTitle: item.channel.name,
              publishedAt: (item.uploaded == "" ? "recently published" : item.uploaded),
            },
          ]);
        });
      } catch (error) {
        Store.addNotification({
          title: "Error!",
          message: "Connection error... Try again later...",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: true,
            showIcon: true,
          },
        });
      }
    }
  };

  return (
    <>
      {
        <div className="recom-vid my-6">
          <div className="recom-vid-wrapper">
            <div className="top-bar w-full leading-[26px] font-[500] text-[20px]">
              Recommended Videos
            </div>
            <div className="carousel-vid pt-[1.5%] pb-[3%]">
              {videoInfo.length > 0 ? (
                getUnique(videoInfo, "videoId").map((video, index) => (
                  <div
                  key={index+1}
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
                        setVideoId(video.videoId);
                      }}
                      className="c-wrap inline font-[500] ml-[15px] outline-none cursor-pointer leading-[21px]"
                    >
                      <span
                        title={video.title}
                        className="RecomArtiTitle block font-[500] -ml-[5px] first-letter:uppercase truncate w-[545px]"
                      >
                        {parse(video.title)}
                      </span>
                      <div className="flex flex-start text-left text-[11px] text-[#999]">
                        <a
                          href={`https://www.youtube.com/channel/${video.channelId}`}
                          title={parse(video.channelTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="-ml-[5px]"
                        >
                          {parse(video.channelTitle)}
                        </a>
                        <div className="ch-l-point"></div>
                        <div className="duration-string">
                          {video.publishedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-[40px]">
                  <LargeLoading />
                </div>
              )}
            </div>
          </div>
        </div>
      }
      {videoId !== "" && (
        <YoutubePlayer videoId={videoId} removeVideo={removeVideo} />
      )}
    </>
  );
}

export default RecomVideos;
