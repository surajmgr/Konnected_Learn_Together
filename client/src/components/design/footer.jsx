import React from "react";
import "./footer.css";
import icon19 from "../../static/icon-19.svg";
import icon20 from "../../static/icon-20.svg";
import logo from "../../static/logo.png";

function Footer() {
  return (
    <footer className="footer fos-animate-me fadeInUp delay-0_8">
      <div className="footer-top" data-aos="fade-up">
        <div className="max-w-[1320px] w-full mx-auto px-[2rem]">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget footer-about">
                <div className="footer-logo">
                  <img
                    src={logo}
                    alt="logo"
                  />
                </div>
                <div className="footer-about-content">
                  <p>
                    The #1 community based online learning where learners share their knowledge to empower and grow together, regardless of their educational background. 
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">Grade Levels</h2>
                <ul>
                  <li>
                    <a href="/books/bsc-csit-4">BSc. CSIT 4th</a>
                  </li>
                  <li>
                    <a href="/books/grade-10">Sec. School: Ten</a>
                  </li>
                  <li>
                    <a href="/books/grade-11-science">Science: XI</a>
                  </li>
                  <li>
                    <a href="/books/grade-12-management">Management: XII</a>
                  </li>
                  <li>
                    <a href="/books/bsc-csit-7">BSc. CSIT 7th Sem</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">Important Links</h2>
                <ul>
                  <li>
                    <a href="/books">Text Books</a>
                  </li>
                  <li>
                    <a href="/topics">Topics</a>
                  </li>
                  <li>
                    <a href="/">About Us</a>
                  </li>
                  <li>
                    <a href="mailto:surajpulami8@gmail.com">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget footer-contact">
                <h2 className="footer-title">Contact Details</h2>
                <div className="footer-contact-info">
                  <div className="footer-address">
                    <img src={icon20} alt="" className="img-fluid" />
                    <p> Kathmandu, Nepal </p>
                  </div>
                  <p className="flex">
                    <img src={icon19} alt="" className="img-fluid" />
                    <a href="mailto:surajpulami8@gmail.com">
                      surajpulami8@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="max-w-[1320px] w-full mx-auto px-[2rem]">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6">
                <div className="privacy-policy">
                  <ul>
                    <li>
                      <a href="/terms-and-conditions">Terms</a>
                    </li>
                    <li>
                      <a href="/privacy-policy">Privacy</a>
                    </li>
                    <li>
                      <a href="/refund-policy">About</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="copyright-text">
                  <p className="mb-0">© 2023 KonnectEd. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
