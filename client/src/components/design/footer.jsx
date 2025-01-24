import React from "react";
import "./footer.css";
import icon19 from "../../static/icon-19.svg";
import icon20 from "../../static/icon-20.svg";
import logo from "../../static/logo.png";
import { Link } from "react-router-dom";

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
                <h2 className="footer-title"><Link to="/levels">Grade Levels</Link></h2>
                <ul>
                  <li>
                    <Link to="/books/bsc-csit-4">BSc. CSIT 4th</Link>
                  </li>
                  <li>
                    <Link to="/books/grade-10">Sec. School: Ten</Link>
                  </li>
                  <li>
                    <Link to="/books/grade-11-science">Science: XI</Link>
                  </li>
                  <li>
                    <Link to="/books/grade-12-management">Management: XII</Link>
                  </li>
                  <li>
                    <Link to="/books/bsc-csit-7">BSc. CSIT 7th Sem</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">Important Links</h2>
                <ul>
                  <li>
                    <Link to="/books">Text Books</Link>
                  </li>
                  <li>
                    <Link to="/topics">Topics</Link>
                  </li>
                  <li>
                    <Link to="/levels">All Levels</Link>
                  </li>
                  <li>
                    <Link to="mailto:surajpulami8@gmail.com">Contact Us</Link>
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
                    <Link to="mailto:surajpulami8@gmail.com">
                      surajpulami8@gmail.com
                    </Link>
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
                      <Link to="/terms-and-conditions">Terms</Link>
                    </li>
                    <li>
                      <Link to="/privacy-policy">Privacy</Link>
                    </li>
                    <li>
                      <Link to="/refund-policy">About</Link>
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
