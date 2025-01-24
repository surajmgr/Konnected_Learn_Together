import React from "react";
import "./breadcrum.css";
import { Link } from "react-router-dom";

function Breadcrum(props) {
  console.log(props.path);
  return (
    <>
      {props.path ? (
        <div className="breadcrumb-bar">
          <div className="max-w-[986px] w-full mx-auto px-[0.75rem]">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="breadcrumb-list">
                  <nav aria-label="breadcrumb" className="page-breadcrumb">
                    <ol class={(props.pred_path == "Book") ? "breadcrumb ml-[20px]" : "breadcrumb"}>
                      <li className="breadcrumb-item">
                        <Link to={(props.pred_path_link) ? props.pred_path_link : "/"}>
                          {props.pred_path ? props.pred_path : "Home"}
                        </Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {props.path.slice(0,90)}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="breadcrumb-bar">
          <div className="max-w-[986px] w-full mx-auto px-[0.75rem]">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="breadcrumb-list">
                  <nav aria-label="breadcrumb" className="page-breadcrumb">
                    <ol className="ml-[15px] breadcrumb min-h-[24px] min-w-[405px]">
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Breadcrum;
