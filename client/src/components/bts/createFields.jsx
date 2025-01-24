import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import axios from "axios";

// Level
const LevelsFetch = (props) => {
  const [levels,setLevels] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/levels`);
        // console.log(res.data);
        setLevels(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const onChangeSelect = (e) => {
    setSelectValue(e.target.value);
  };

  const addSelectedValue = (value) => {
    if (value != "") {
      setSelectedValue([...selectedValue, value]);
      // console.log(selectValue);
      props.selectedLevel([...selectedValue, value]);
      setSelectValue("");
    }
  };

  const removeSelectedValue = (indexToRemove) => {
    setSelectedValue(selectedValue.filter((_, index) => index != indexToRemove));
  };

  return (
    
    <div>
      <div className="tags-input">
        <input type="text" name="btopic" placeholder="Associated books"
          onChange={onChangeSelect} value={selectValue}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <ul className="my-2">
          {selectedValue.map((value, index) => (
            <li className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2.5 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
              <span>{value.name}</span>
              <span className="sr-only">Close</span>
              <svg
                aria-hidden="true"
                onClick={() => removeSelectedValue(index)}
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
        <div id="dropdown" className={"z-10 bg-gray-50 rounded-lg border border-gray-300 text-gray-900 text-sm divide-y divide-gray-100 shadow w-44"}>
          <ul className="my-2 text-sm" aria-labelledby="dropdownDefaultButton">
            {levels
              .filter((data) => {
                const searchTerm = selectValue.toString().toLowerCase();
                const tname = data.name.toString().toLowerCase();
                const alreadyIncluded = selectedValue.some(value => {
                  if(value.id == data.id)  return true;
                })
                return (
                  searchTerm &&
                  tname.includes(searchTerm) &&
                  !alreadyIncluded
                );
              })
              .map((data) => (
                <li onClick={() => addSelectedValue({name: data.name, id: data.id})}
                  className="block px-4 py-2 rounded-lg hover:bg-white" style={{ cursor: "pointer" }} >
                  {data.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Book
const BooksFetch = (props) => {
  const [books,setBooks] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/books`);
        console.log(res.data);
        setBooks(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const onChangeSelect = (e) => {
    setSelectValue(e.target.value);
  };

  const addSelectedValue = (value) => {
    if (value != "") {
      setSelectedValue([...selectedValue, value]);
      console.log(selectedValue);
      props.selectedBook([...selectedValue, value]);
      setSelectValue("");
    }
  };

  const removeSelectedValue = (indexToRemove) => {
    setSelectedValue(selectedValue.filter((_, index) => index != indexToRemove));
  };

  return (
    <div>
      <div className="tags-input">
        <input type="text" name="btopic" placeholder="Associated books"
          onChange={onChangeSelect} value={selectValue}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <ul className="my-2">
          {selectedValue.map((value, index) => (
            <li className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2.5 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
              <span>{value.name}</span>
              <span className="sr-only">Close</span>
              <svg
                aria-hidden="true"
                onClick={() => removeSelectedValue(index)}
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
        <div id="dropdown" className={"z-10 bg-gray-50 rounded-lg border border-gray-300 text-gray-900 text-sm divide-y divide-gray-100 shadow w-44"}>
          <ul className="my-2 text-sm" aria-labelledby="dropdownDefaultButton">
            {books
              .filter((data) => {
                const searchTerm = selectValue.toString().toLowerCase();
                const tname = data.bname.toString().toLowerCase();
                const alreadyIncluded = selectedValue.some(value => {
                  if(value.id == data.id)  return true;
                })
                return (
                  searchTerm &&
                  tname.includes(searchTerm) &&
                  !alreadyIncluded
                );
              })
              .map((data) => (
                <li onClick={() => addSelectedValue({name: data.bname, id: data.bid})}
                  className="block px-4 py-2 rounded-lg hover:bg-white" style={{ cursor: "pointer" }} >
                  {data.bname + ': '}
                  {books.map((book) => ((book.bid===data.bid) ?
                  book.lname + ', '
                :
                null))}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const SetSubTopics = (props) => {
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

  console.log(subtopics)
  // const enterInput = (e) => {
  //   if(e.name)
  // }

  const removeSubTopics = (indexToRemove) => {
    setSubTopics(subtopics.filter((_, index) => index != indexToRemove));
  };

  return (
    <div>
      <div className="tags-input">
        <input type="text" name="btopic" placeholder="Associated Topics"
          onChange={onChangeBook} value={topicValue} onKeyUp={addSubTopic}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <ul className="my-2">
          {subtopics.map((subtopic, index) => (
            <li className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2.5 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
              <span>{subtopic}</span>
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
      </div>
    </div>
  );
}

function CreateFields() {
  const [openTab, setOpenTab] = React.useState(1);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [sendingLevel,setSendingLevel] = useState({});

  const [sendingBook,setSendingBook] = useState({});

  // Initialize Inputs of the Form Inputs
  const [bookInputs, setBookInputs] = useState({
    bname: "",
    bdescription: "",
    bauthor: "",
  });

  // Set error from response
  const [err, setError] = useState(null);

  const [suc, setSuc] = useState(null);

  // const selected = tags => console.log(tags);

  // Handle Changes in the form inputs
  const handleChange = (e) => {
    // selectedLevel();
    setBookInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // console.log(bookInputs)
  };
  
  const addBook = async (e) => {
    e.preventDefault();
    try {
      console.log(sendingLevel)
      console.log(bookInputs)
      // setBookInputs((prev) => ({ ...prev, blevel:sendingLevel }));
      const res = await axios.post("/books/add-book", {objects:[bookInputs, sendingLevel]}, {
        withCredentials: true,
      });
      setSuc(res.data);
    } catch (error) {
      setError(error.response.data);
    }
  };

  // Topic Section

  const [topicInputs, setTopicInputs] = useState({
    tname: "",
    tdescription: ""
  });

  const [subTopicInputs, setSubTopicInputs] = useState({})

  const topicHandleChange = (e) => {
    // selectedLevel();
    setTopicInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.name);
    console.log(topicInputs)
  };

  const addTopic = async (e) => {
    e.preventDefault();
    try {
      console.log(sendingBook)
      console.log(subTopicInputs)
      // setBookInputs((prev) => ({ ...prev, blevel:sendingLevel }));
      const res = await axios.post("/topics/add-topic", {objects:[topicInputs, sendingBook, subTopicInputs]}, {
        withCredentials: true,
      });
      setSuc(res.data);
    } catch (error) {
      setError(error.response.data);
    }
  };

  const selectedLevel = (selectedValue) => {
    // setBookInputs((prev) => ({ ...prev, blevel:selectedValue }))
    setSendingLevel(selectedValue);
  }

  const selectedBook = (selectedValue) => {
    // setBookInputs((prev) => ({ ...prev, blevel:selectedValue }))
    setSendingBook(selectedValue);
  }

  const selectedSubTopic = (subtopics) => {
    // setBookInputs((prev) => ({ ...prev, blevel:selectedValue }))
    setSubTopicInputs(subtopics);
  }

  // console.log(sendingLevel);

  // console.log(selectedLevel);

  return (
    <>
    {currentUser
      ?
      (
        <div className="flex flex-wrap">
          <div className="w-full">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
              role="tablist"
            >
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 1
                      ? "text-white bg-blue-600"
                      : "text-blue-600 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  Add Book
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 2
                      ? "text-white bg-blue-600"
                      : "text-blue-600 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  Add Topic
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 3
                      ? "text-white bg-blue-600"
                      : "text-blue-600 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(3);
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  Add Notes
                </a>
              </li>
            </ul>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  {(err && <span className="text-red-700">{err}</span>) ||
                  (suc && <span className="text-blue-700">{suc}</span>)}
                  <div className={openTab === 2 ? "block" : "hidden"} id="link1">
                    {/* Add Book */}
                    <div>
                      <label
                        htmlFor="book_name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Book Title
                      </label>
                      <input
                        type="text"
                        id="book_name"
                        onChange={handleChange}
                        name="bname"
                        placeholder="Title of the book"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book_desc"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Book Description
                      </label>
                      <input
                        type="text"
                        id="book_desc"
                        name="bdescription"
                        placeholder="Short description of the book"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Recommended for
                      </label>
                      {/* <LevelsFetch selectedLevel={selectedLevel} /> */}
                    </div>
                    <div>
                      <label
                        htmlFor="book_author"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Author
                      </label>
                      <input
                        type="text"
                        id="book_author"
                        name="bauthor"
                        placeholder="Author of the book"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addBook}
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                    >
                      Add Book
                    </button>
                  </div>
                  <div className={openTab === 1 ? "block" : "hidden"} id="link2">
                    {/* Add Topic */}
                    <div>
                      <label
                        htmlFor="book_name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Topic Title
                      </label>
                      <input
                        type="text"
                        id="book_name"
                        onChange={topicHandleChange}
                        name="tname"
                        placeholder="Title of the topic"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book_desc"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Topic Description
                      </label>
                      <input
                        type="text"
                        id="book_desc"
                        name="tdescription"
                        placeholder="Short description of the topic"
                        onChange={topicHandleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Associated with
                      </label>
                      <BooksFetch selectedBook={selectedBook} />
                    </div>
                    <div>
                      <label
                        htmlFor="book_author"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Add Subtopics (Press enter after each sub-topic):
                      </label>
                      <SetSubTopics selectedSubTopic={selectedSubTopic} />
                    </div>
                    <button
                      type="button"
                      onClick={addTopic}
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                    >
                      Add Topic
                    </button>
                  </div>
                  <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                    {/* Add Notes */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)
      :
      (<>{window.location.href= "/"}</>)
}
    </>
  );
}

export default CreateFields;
