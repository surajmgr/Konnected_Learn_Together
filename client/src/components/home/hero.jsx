import React from "react";
import pencilIcon from '../../static/pencil-icon.svg';
import coursesIcon from '../../static/cources-icon.svg';
import certificateIcon from '../../static/certificate-icon.svg';
import graduateIcon from '../../static/gratuate-icon.svg';
import CountUp from 'react-countup';
import './hero.css';
import heroimg from "../../static/girlPaint.png";
import blurgrad from "../../static/blurGrad.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      <section
        className="bg-white"
        style={{
          background: "url(https://www.filemakr.com/design/img/banner.png)",
        }}
      >
        {/* <img src={blurgrad} className="-top-[100px] svg absolute hidden lg:block h-[1200px] w-full -z-10 overflow-hidden" /> */}
        <div className="grid max-w-screen-xl px-4 pt-4 mx-auto lg:gap-8 xl:gap-0 lg:pt-16 lg:pb-32 lg:grid-cols-12 fos-animate-me fadeIn delay-0_3">
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex h-[300px] ml-[55px] fos-animate-me fadeIn delat-0_3">
            <img src={heroimg} alt="mockup" />
          </div>
          <div className="mr-auto place-self-center lg:col-span-7 ml-[60px]">
            <h1 className="text-[35px] leading-[2.5rem] tracking-[1px]">
              HEY!<span className="font-semibold"> Join Us.</span>
              <br />
              <p className="text-[35px]">
                <span className="font-semibold">Learning </span> is better
                <br />
                done<span className="font-semibold"> Together.</span>
              </p>
            </h1>
            <p className="leading-[1.6rem] text-[#43495B] text-[18px] my-[8px]">
              Share your knowledges and questions with others to help them <br/>
              learn. Join in our mission of 'Education for All, by All'.
            </p>
            <h1 className=""></h1>
            <Link
              className="font-semibold inline-block px-7 py-3 mr-2 bg-[#4353FF] text-white font-medium text-sm leading-snug rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              to="/login"
              role="button"
            >
              Get started {"  "}
              <svg
                className="ml-[3px] inline"
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_204_5)">
                  <path
                    d="M13.0772 8.12201L8.22134 3.26611L9.35233 2.13512L16.1391 8.92186L15.5736 9.48736L9.35233 15.7086L8.22134 14.5776L13.0772 9.72172H0.142029V8.12201H13.0772Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_204_5">
                    <rect
                      width="16"
                      height="16.7969"
                      fill="white"
                      transform="translate(0.140564 0.92334)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Link
              className="font-semibold inline-block px-7 py-3 bg-transparent text-blue-600 font-medium text-sm leading-snug rounded-lg hover:text-blue-700 transition duration-150 ease-in-out"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              to="/books"
              role="button"
            >
              Explore more
            </Link>
          </div>
        </div>
      </section>
      <section className="section relative mt-[-60px]">
        <div className="max-w-[1320px] w-full mx-auto px-[0.75rem]">
          <div className="course-widget">
            <div className="row">
              <div className="col-lg-3 col-md-6 cursor-pointer fos-animate-me bounceInUp delay-0_5">
                <div className="course-full-width">
                  <div
                    className="blur-border course-radius items-center reveal fade-bottom aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <div className="online-course flex items-center">
                      <div className="course-img">
                        <img
                          src={pencilIcon}
                          alt=""
                        />
                      </div>
                      <div className="course-inner-content">
                        <h4>
                          <span><CountUp end={800} duration="4" /></span>+
                        </h4>
                        <p>Learning Materials</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 flex cursor-pointer fos-animate-me bounceInUp delay-0_6">
                <div className="course-full-width">
                  <div
                    className="blur-border course-radius aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <div className="online-course flex items-center">
                      <div className="course-img">
                        <img
                          src={coursesIcon}
                          alt=""
                        />
                      </div>
                      <div className="course-inner-content">
                        <h4>
                          <span><CountUp end={200} duration="4" /></span>+
                        </h4>
                        <p>Contributors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 flex cursor-pointer fos-animate-me bounceInUp delay-0_7">
                <div className="course-full-width">
                  <div
                    className="blur-border course-radius aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <div className="online-course flex items-center">
                      <div className="course-img">
                        <img
                          src={certificateIcon}
                          alt=""
                        />
                      </div>
                      <div className="course-inner-content">
                        <h4>
                          <span><CountUp end={10} duration="5" delay={1} suffix="K " /></span>+
                        </h4>
                        <p>Happy Users</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 flex cursor-pointer fos-animate-me bounceInUp delay-0_8">
                <div className="course-full-width">
                  <div
                    className="blur-border course-radius aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <div className="online-course flex items-center">
                      <div className="course-img">
                        <img
                          src={graduateIcon}
                          alt=""
                        />
                      </div>
                      <div className="course-inner-content">
                        <h4>
                          <span><CountUp end={30} duration="5" delay={1} suffix="K " /></span>+
                        </h4>
                        <p>Online Learners</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
