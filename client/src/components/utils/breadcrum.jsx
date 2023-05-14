import React from "react";
import "./breadcrum.css";
import { Link } from "react-router-dom";

function Breadcrum(props) {
  console.log(props.path);
  return (
    <>
      {props.path ? (
        <div class="breadcrumb-bar">
          <div class="max-w-[986px] w-full mx-auto px-[0.75rem]">
            <div class="row">
              <div class="col-md-12 col-12">
                <div class="breadcrumb-list">
                  <nav aria-label="breadcrumb" class="page-breadcrumb">
                    <ol class={(props.pred_path == "Book") ? "breadcrumb ml-[20px]" : "breadcrumb"}>
                      <li class="breadcrumb-item">
                        <Link to={(props.pred_path_link) ? props.pred_path_link : "/"}>
                          {props.pred_path ? props.pred_path : "Home"}
                        </Link>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">
                        {props.path}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="breadcrumb-bar">
          <div class="max-w-[986px] w-full mx-auto px-[0.75rem]">
            <div class="row">
              <div class="col-md-12 col-12">
                <div class="breadcrumb-list">
                  <nav aria-label="breadcrumb" class="page-breadcrumb">
                    <ol class="ml-[15px] breadcrumb min-h-[24px] min-w-[405px]">
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
