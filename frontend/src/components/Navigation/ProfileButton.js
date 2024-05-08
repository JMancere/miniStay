import React, { useState, useEffect, useRef } from "react";
import { useDispatch} from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import { NavLink } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // const user = useSelector(state => state.session.user);


  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true);
  // };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {

      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  //<i class="fa-sharp fa-solid fa-m" color="#ea3434"></i>
  // {/* <i className="fa-sharp fa-solid fa-m"></i> */}
  function getLink(){
      return ( user &&
        <NavLink className='middle' to="/spots/new" >
        Create a new spot
        </NavLink>
      )
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  return (
    <>
      <p>{getLink()}</p>
      <div className="hamburger-container" onClick={toggleMenu}>
      <div className="hamburger-wrapper">
          {/* Hamburger Icon */}
          <div className="hamburger-icon">
            <i className="fa-solid fa-bars"></i>
          </div>
          {/* User Icon */}
          <div className="user-logo">
            <i className="fa-solid fa-circle-user"></i>
          </div>
        </div>
      </div>

      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>

            <NavLink to="/spots/current" >Manage Spots</NavLink>

            <li>
              <Link to="/" onClick={logout}>Log Out</Link>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal className='login'/>}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
