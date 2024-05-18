import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useRef } from "react";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();
  const formRef = useRef(null)

  function handleSubmitDemo(e){
    setCredential('Demo-lition');
    setPassword("password");
    setErrors("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        //console.log(res)
        const data = await res.json();
        //console.log(data.message)

        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };
  function loginDisabled(){
    return credential.length < 4 || password.length < 6;;
  }
  return (
    <>
      <div className="loginWrapper ">
      <h1>Log In</h1>
      <form ref={formRef} className="loginWrapper" onSubmit={handleSubmit}>
        <label>
          <input
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors && (
          <p className="error">{errors}</p>
        )}
        <button disabled={loginDisabled()} type="submit">Log In</button>
      </form>
      <button className='noBtn' onClick={handleSubmitDemo}> Demo User </button>
      </div>
    </>
  );
}

export default LoginFormModal;
