import React, { useEffect, useState } from "react";
import "./popup.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function strUrl(str) {
  const resStr =
    str.replaceAll("-", " ").charAt(0).toUpperCase() +
    str.replaceAll("-", " ").slice(1);
  console.log(resStr);
  return resStr;
}

function BooksFetch(props) {
  const [books, setBooks] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const book_id = location.pathname.split("/")[3];
  const s_name = location.pathname.split("/")[2];

  useEffect(() => {
    addSelectedValue({ name: strUrl(s_name), id: book_id });
    getBooks();
  }, []);

  async function getBooks() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/books/getall/1/2`);
      console.log("Get Data!");
      console.log(res.data);
      setBooks(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const onChangeSelect = (e) => {
    setSelectValue(e.target.value);
  };

  const addSelectedValue = (value) => {
    if (value != "") {
      setSelectedValue([...selectedValue, value]);
      props.selectedBook([...selectedValue, value]);
      setSelectValue("");
    }
  };

  const removeSelectedValue = (indexToRemove) => {
    setSelectedValue(
      selectedValue.filter((_, index) => index != indexToRemove)
    );
    props.selectedBook(selectedValue.filter((_, index) => index != indexToRemove));
  };

  return (
    <>
      <div>
        <div className="tags-input">
          <ul className="my-1">
            {selectedValue.map((value, index) => (
              <li className="mb-[4px] cursor-pointer text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 font-medium rounded-lg text-sm px-2.5 py-1 text-center inline-flex items-center mr-2">
                <span className="select-value-name">{value.name}</span>
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
          <input
            type="text"
            name="btopic"
            onChange={onChangeSelect}
            value={selectValue}
            placeholder="Associated books (Search name of books)"
            className="text-sm block px-4 py-2 mb-3 w-full bg-[#f3f3f3] border rounded-md focus:border-blue-500"
          />
          {selectValue !== "" && selectValue.length !== 0 && (
            <div
              id="dropdown"
              className={
                "!absolute w-[84%] -mt-3 z-10 rounded-lg bg-gray-50 border-b border-l border-r border-gray-300 text-gray-900 text-sm divide-y divide-gray-100 shadow w-44"
              }
            >
              <ul
                className="my-2 text-sm overflow-scroll max-h-[108px]"
                aria-labelledby="dropdownDefaultButton"
              >
                {books
                  .filter((data) => {
                    const searchTerm = selectValue.toString().toLowerCase();
                    const tname = data.bname.toString().toLowerCase();
                    const alreadyIncluded = selectedValue.some((value) => {
                      if (value.id == data.bid) return true;
                    });
                    return (
                      searchTerm &&
                      tname.includes(searchTerm) &&
                      !alreadyIncluded
                    );
                  })
                  .map((data) => (
                    <li
                      onClick={() =>
                        addSelectedValue({ name: data.bname, id: data.bid })
                      }
                      className="block px-4 py-2 hover:bg-white border-b cursor-pointer"
                    >
                      {data.bname}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BooksFetch;
