import './NewReviewModal.css';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useRef } from "react";

function NewReviewModal(spot) {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");

    // return dispatch(sessionActions.login({ credential, password }))
    //   .then(closeModal)
    //   .catch(async (res) => {
    //     console.log(res)
    //     const data = await res.json();
    //     console.log(data.message)

    //     if (data && data.message) {
    //       setErrors(data.message);
    //     }
    //   });
  };

  return (
    <>
      <div className="loginWrapper ">
      <h1>How was you stay?</h1>
      <form ref={formRef} className="loginWrapper" onSubmit={handleSubmit}>
          {errors.description && (<p className="error">{errors.description}</p>)}
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name='description'
              placeholder='Leave your review here...'
              rows='10'
              required
          />
        <label>
          <input
            placeholder="Stars"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        {errors && (
          <p className="error">{errors}</p>
        )}
        <button type="submit">Submit Your Review</button>
      </form>
      </div>
    </>
  );

  }

  export default NewReviewModal;
