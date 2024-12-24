import { useEffect, useState } from "react";

const TypingEffect = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      let index = 0;
  
      const intervalId = setInterval(() => {
        setDisplayedText((prevText) => {
          if (index === text.length) {
            clearInterval(intervalId);
            return prevText; // Stop typing when the whole text is displayed
          }
  
          index++;
          return text.substring(0, index);
        });
      }, 1); // Adjust the interval to control the typing speed
  
      return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [text]);
  
    return <div dangerouslySetInnerHTML={{ __html: displayedText }}></div>;
  };
  
  export default TypingEffect;