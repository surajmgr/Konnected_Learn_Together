import React from 'react';
import './largeLoading.css';

function LargeLoading() {
  return (
    <div className="loading-wrapper flex justify-around fos-animate-me fadeIn delay-0_1">
    <div id="loading"></div>
    </div>
  )
}

export default LargeLoading