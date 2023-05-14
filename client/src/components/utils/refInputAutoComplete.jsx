const TagsInput = props => {
    // Topics Options
    const dummyDatas = [
      { name: "Afghanistan", id: "A1" },
      { name: "Åland Islands", id: "A12" },
      { name: "Albania", id: "A13" },
      { name: "Algeria", id: "D1" },
      { name: "American Samoa", id: "A14" },
      { name: "AndorrA", id: "A15" },
      { name: "Angola", id: "A16" },
      { name: "Anguilla", id: "A17" },
      { name: "Antarctica", id: "A18" },
      { name: "Antigua and Barbuda", id: "A19" },
      { name: "Argentina", id: "A20" },
      { name: "Armenia", id: "A21" },
      { name: "Aruba", id: "A22" },
      { name: "Australia", id: "A23" },
      { name: "Austria", id: "A34" },
      { name: "Azerbaijan", id: "A45" },
      { name: "Bahamas", id: "B5" },
      { name: "Bahrain", id: "B1" },
      { name: "Bangladesh", id: "B66" },
      { name: "Barbados", id: "B24" },
    ];
  
    const [topicValue, setTopicValue] = useState([]);
  
    const onChangeBook = (e) => {
      setTopicValue(e.target.value);
    };
  
    const [tags, setTags] = useState([]);
  
    const addTags = (e) => {
      // const newTag = {
      //   name: e.target.value,
      //   id: e.target.id,
      // };
      if (e != "") {
        setTags([...tags, e]);
        props.selected([...tags, e]);
        setTopicValue("");
      }
      // console.log(e);
    };
  
    // const enterInput = (e) => {
    //   if(e.name)
    // }
  
    const removeTags = (indexToRemove) => {
      setTags(tags.filter((_, index) => index != indexToRemove));
    };
  
    // console.log(tags);
  
    return (
      <div>
        <div className="tags-input">
          <input type="text" name="btopic" placeholder="Associated books"
            onChange={onChangeBook} value={topicValue}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <ul className="my-2">
            {tags.map((tag, index) => (
              <li className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2.5 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
                <span>{tag.name}</span>
                <span class="sr-only">Close</span>
                <svg
                  aria-hidden="true"
                  onClick={() => removeTags(index)}
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </li>
            ))}
          </ul>
          <div id="dropdown" className="z-10 bg-gray-50 rounded-lg border border-gray-300 text-gray-900 text-sm divide-y divide-gray-100 shadow w-44">
            <ul className="my-2 text-sm" aria-labelledby="dropdownDefaultButton">
              {dummyDatas
                .filter((data) => {
                  const searchTerm = topicValue.toString().toLowerCase();
                  const tname = data.name.toString().toLowerCase();
                  const alreadyIncluded = tags.some(tag => {
                    if(tag.id == data.id)  return true;
                  })
                  return (
                    searchTerm &&
                    tname.startsWith(searchTerm) &&
                    !alreadyIncluded
                  );
                })
                .map((data) => (
                  <li onClick={() => addTags({name: data.name, id: data.id})}
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
  