import './NewReviewModal.css';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useRef } from "react";
import PawsRatingInput from './PawsRatingInput';
import { createReviewThunk } from '../../store/spots';

function NewReviewModal({spot}) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");
    let rev = {stars, review}
    //console.log('spot rev is ', spot, rev)
    return dispatch(createReviewThunk(spot, rev))
      .then(closeModal)
      .catch(async (res) => {
        //console.log(res)
        const data = await res.json();
        //console.log('errors add review',data.message)

        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };
  const isDisabled = () =>{
    return (review.length < 10) || stars < 1;
  }

  const onChange = (n) => {
    setStars(parseInt(n));
  }

  return (
    <>
      <div className="loginWrapper ">
      <h1>How was you stay?</h1>
      <form ref={formRef} className="loginWrapper" onSubmit={handleSubmit}>
          {errors && (
              <p className="error">{errors}</p>
          )}

          {errors.description && (<p className="error">{errors.description}</p>)}
          <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              name='description'
              placeholder='Leave your review here...'
              rows='10'
              required
          />
          <PawsRatingInput
            disabled={false}
            onChange={onChange}
            rating={stars}
          />
        <button disabled={isDisabled()} type="submit">Submit Your Review</button>
      </form>
      </div>
    </>
  );

  }

  export default NewReviewModal;
