import React, { useRef } from "react";
import "./slider.css";
import kripesh from "../../static/avatar/kripesh.jpeg";
import manish from "../../static/avatar/manish.jpeg";
import suraj from "../../static/avatar/suraj.jpg";
import avt1 from "../../static/avatar/avt-1.webp";
import avt2 from "../../static/avatar/avt-2.webp";
import avt3 from "../../static/avatar/avt-3.webp";
import avt5 from "../../static/avatar/avt-5.webp";
import avt6 from "../../static/avatar/avt-6.webp";
import { useIntersection } from "../utils/onScreen";
import { useNavigate } from "react-router-dom";

function Slider() {
  const ref1 = useRef();
  const isInViewport1 = useIntersection(ref1, '100px');
  const ref2 = useRef();
  const isInViewport2 = useIntersection(ref2, '30px');
  const navigate = useNavigate();
  return (
    <>
      <section ref={ref1} className={"section developers-section" + ((isInViewport1) ? " fos-animate-me fadeInLeft delay-0_2" : "hidden")}>
        <div className="section-header">
          <div className="pt-[80px] max-w-[1320px] w-full mx-auto px-[2rem] section-sub-head">
            <span>Developer & Contributors</span>
            <h2>
              Journey to advance education supporting eachother through
              knowledge.
            </h2>
          </div>
          <div className="max-w-[1320px] w-full mx-auto px-[2rem] section-text">
            <p>
              As a contributor, you'll have the opportunity to make a difference
              in the lives of learners around the world. Join us today and be a
              part of something greater than yourself.
            </p>
          </div>
        </div>
      </section>
      <section className="slider">
        <div className="container">
          <input type="radio" name="dot" id="one" />
          <input type="radio" name="dot" id="two" />
          <div className="main-card">
            <div className="cards">
              <div ref={ref2} onClick={() => navigate("/user/kripesh")} className={"card cursor-pointer" + ((isInViewport2) ? " fos-animate-me bounceInUp delay-0_3" : "hidden")}>
                <div className="content">
                  <div className="img img-1">
                    <img src={kripesh} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Kripesh Neupane</div>
                    <div className="job job-1">Asst. Developer</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    Junior front-end dev, moving to create engaging user interface.
                    </p>
                  </div>
                </div>
              </div>
              <div onClick={() => navigate("/user/surajmgr")} className={"card cursor-pointer" + ((isInViewport2) ? " fos-animate-me bounceInUp delay-0_4" : "hidden")}>
                <div className="content">
                  <div className="img img-2">
                    <img src={suraj} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Suraj Pulami</div>
                    <div className="job job-2">Web Developer</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    Versatile Full-Stack dev with a passion to create smooth web experiences.
                    </p>
                  </div>
                </div>
              </div>
              <div onClick={() => navigate("/user/manish")} className={"card cursor-pointer" + ((isInViewport2) ? " fos-animate-me bounceInUp delay-0_5" : "hidden")}>
                <div className="content">
                  <div className="img img-3">
                    <img src={manish} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Manish Timilsina</div>
                    <div className="job job-3">UI/UX Contributor</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    An Enthusiast for web designing with an intuitive user experience.
                    </p>
                  </div>
                </div>
              </div>
              <div className={"card cursor-pointer" + ((isInViewport2) ? " fos-animate-me bounceInUp delay-0_6" : "hidden")}>
                <div className="content">
                  <div className="img img-4">
                    <img src={avt1} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Justin Stha</div>
                    <div className="job job-4">Top Contributor</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    A computer science graduate with expertise in ML & AI. <span className="text-[#999] text-sm">Test Data</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="cards">
              <div className="card cursor-pointer">
                <div className="content">
                  <div className="img img-1">
                    <img src={avt5} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Surya Adhikari</div>
                    <div className="job job-1">Top Contributor</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    Mathematics educator with experience teaching up to Master's level. <span className="text-[#999] text-sm">Test Data</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card cursor-pointer">
                <div className="content">
                  <div className="img img-2">
                    <img src={avt3} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Nabin Gurung</div>
                    <div className="job job-2">Top Contributor</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    Studying for a Master's degree in Computer Science at TU. <span className="text-[#999] text-sm">Test Data</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card cursor-pointer">
                <div className="content">
                  <div className="img img-3">
                    <img src={avt2} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Sabina Rai</div>
                    <div className="job job-3">Top Contributor</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    A financial analyst specialized in corporate finance. <span className="text-[#999] text-sm">Test Data</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card cursor-pointer">
                <div className="content">
                  <div className="img img-4">
                    <img src={avt6} alt="" />
                  </div>
                  <div className="details">
                    <div className="name">Bijay Thapa</div>
                    <div className="job job-4">Top Contributor</div>
                  </div>
                  <div className="media-icons">
                    <p>
                    A specialist in infectious diseases, working towards improving PH. <span className="text-[#999] text-sm">Test Data</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button">
            <label htmlFor="one" className=" active one"></label>
            <label htmlFor="two" className="two"></label>
          </div>
        </div>
      </section>
    </>
  );
}

export default Slider;
