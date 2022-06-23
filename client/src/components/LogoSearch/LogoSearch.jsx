import React from 'react';
import './LogoSearch.css';
import Logo from "../../img/Logo.png";
import {UilSearch} from '@iconscout/react-unicons';

function LogoSearch() {
  return (
    <div className="LogoSearch">
      <img src={Logo} alt="Logo search"/>
      <div className="Search">
        <input type="text" placeholder='#Explore' />
        <div className="s-icon">
          <UilSearch />
        </div>
      </div>
    </div>
  );
}

export default LogoSearch;