import React, { useRef } from "react";
import './latest.css'
import { useIntersection } from "../utils/onScreen";

function Latest() {
  const ref1 = useRef();
  const isInViewport1 = useIntersection(ref1, '0px');

  return (
    <section ref={ref1} className={"section latest-blog" + ((isInViewport1) ? " fos-animate-me fadeIn delay-0_2" : "")}>
      <div className="max-w-[1320px] w-full mx-auto px-[0.75rem]">
        <div className="lab-course">
          <div
            className="section-header"
            data-aos="fade-up"
          >
            <div className="section-sub-head feature-head text-center">
              <h2>
                Unlimited access to 800+ lessons & solutions <br />
                provided by 200+ learners.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Latest;
