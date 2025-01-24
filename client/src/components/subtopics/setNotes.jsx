import React, { useState } from "react";
import "./writeCSS.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

function Write() {
  const state = useLocation().state;

  const [value, setValue] = useState(state?.description || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload`, formData);
      const path = res.data;
      return path;
    } catch (error) {
      console.log(error.message);
    }
  };

  const addNotifications = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/profile/notifications/add`,
      {
        uid: currentUser.id,
        message:`You have contributed a new note.`,
        link:`/user/${currentUser.username}`,
        read:"0",
      },
      {
        withCredentials: true,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileUrl = async (imgUrl) => {
      state
        ? await axios.put(`${process.env.REACT_APP_API_BASE_URL}/posts/${state.id}`, {
            title,
            description: value,
            cat,
            img: file ? imgUrl : "",
          })
        : await axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts/`, {
            title,
            description: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
          });
    }

    try {
      upload().then(data=>{
        console.log(data);
        fileUrl(data)
      });

      
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(value);
  console.log(cat);
  return (
    <div className="add">
      <div className="h-cont">
        <div className="item">
          <span>Status - Draft</span>
          <span>Visibility - Public</span>
          <span>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              name=""
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label style={{ cursor: "pointer" }} htmlFor="file">
              Upload Image
            </label>
          </span>
          <div className="action-item">
            <a onClick={handleSubmit}>
              <span>Post</span>
            </a>
            <a>
              <span>Draft</span>
            </a>
          </div>
        </div>
        <input
          className="npt npt-header"
          placeholder="Title of the Post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <div className="editorContainer">
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>
        <div className="item">
          <span>
            <input
              type="radio"
              checked={cat === "art"}
              value="art"
              name="cat"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </span>
          <span>
            <input
              type="radio"
              checked={cat === "science"}
              value="science"
              name="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </span>
          <span>
            <input
              type="radio"
              checked={cat === "tech"}
              value="tech"
              name="tech"
              id="tech"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="tech">Tech</label>
          </span>
          <span>
            <input
              type="radio"
              checked={cat === "color"}
              value="color"
              name="color"
              id="color"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="color">Color</label>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Write;
