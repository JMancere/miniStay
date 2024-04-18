import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  //https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png
  //<img src="https://www.pinclipart.com/picdir/big/577-5770021_clip-art-brick-house-png-download.png" alt="Home" height='30px'/>
  return (
    <div className='navigator'>
      <NavLink className='redBox bnb' to="/" >
            <img src="https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png" alt="Home" height='30px'/>
            miniStay
      </NavLink>
      <ul className="redBox menu" >
        <li className="redBox menu" >
            <NavLink exact to="/">Home</NavLink>
        </li>
        {isLoaded && (
            <ProfileButton  className="profilelogo one"user={sessionUser} />
        )}
      </ul>
    </div>
  );
}

export default Navigation;
