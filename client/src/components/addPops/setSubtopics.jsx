import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import axios from "axios";

function SetSubTopics(props) {
  const [subtopics, setSubTopics] = useState([]);
  const [topicValue, setTopicValue] = useState([]);

  const onChangeBook = (e) => {
    setTopicValue(e.target.value);
  };

  const addSubTopic = (e) => {
    if (e.key == "Enter" && e.target.value != "") {
      setSubTopics([...subtopics, e.target.value]);
      props.selectedSubTopic([...subtopics, e.target.value]);
      setTopicValue("");
    }
  };

  console.log(subtopics);

  const removeSubTopics = (indexToRemove) => {
    setSubTopics(subtopics.filter((_, index) => index != indexToRemove));
  };

  return (
    <>
      <div>
        <div className="tags-input">
          <ul className="my-1">
            {subtopics.map((subtopic, index) => (
              <li className="mb-[4px] cursor-pointer text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 font-medium rounded-lg text-sm px-2.5 py-1 text-center inline-flex items-center mr-2">
                <span className="select-value-name">{subtopic}</span>
                <span className="sr-only">Close</span>
                <svg
                  aria-hidden="true"
                  onClick={() => removeSubTopics(index)}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </li>
            ))}
          </ul>
          <input
            type="text"
            name="btopic"
            onChange={onChangeBook}
            value={topicValue}
            onKeyUp={addSubTopic}
            placeholder="Associated lessons (Press enter to add, not comma)"
            className="text-sm block px-4 py-2 mb-3 w-full bg-[#f3f3f3] border rounded-md focus:border-blue-500"
          />
        </div>
      </div>
    </>
  );
}

export default SetSubTopics;
