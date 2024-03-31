import React from 'react';
import Style from './Loader.module.css';

const Loader = () => {
  return (
    <div className={Style.loaderOverlay}>
      <div className={Style.loader}></div>
      <h2>Loading...</h2>
    </div>
  );
};

export default Loader;
