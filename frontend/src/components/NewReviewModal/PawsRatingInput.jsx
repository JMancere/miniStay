import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import './NewReviewModal.css';

const PawsRatingInput = ({ rating, disabled, onChange }) => {

  const [activeRating, setActiveRating] = useState(rating)

  useEffect(() =>{
    setActiveRating(rating);
  }, [rating])

  const doMouseEnter1 = () => {
    if (disabled) return;
    setActiveRating(1);
  }
  const doMouseEnter2 = () => {
    if (disabled) return;
    setActiveRating(2);
  }
  const doMouseEnter3 = () => {
    if (disabled) return;
    setActiveRating(3);
  }
  const doMouseEnter4 = () => {
    if (disabled) return;
    setActiveRating(4);
  }
  const doMouseEnter5 = () => {
    if (disabled) return;
    setActiveRating(5);
  }

  const doMouseLeave = () => {
    if (disabled) return;
    setActiveRating(rating)
  }

  const doClick1 = () => {
    if (disabled) return;
    onChange(1)
  }
  const doClick2 = () => {
    if (disabled) return;
    onChange(2)
  }
  const doClick3 = () => {
    if (disabled) return;
    onChange(3)
  }
  const doClick4 = () => {
    if (disabled) return;
    onChange(4)
  }
  const doClick5 = () => {
    if (disabled) return;
    onChange(5)
  }

  return (
    <>
      <div className="rating-input">
          <div onClick={doClick1} id='P1' onMouseLeave={doMouseLeave} onMouseEnter={doMouseEnter1} className={activeRating >=1 ? 'filled': 'empty'}>
            <FaStar />
          </div>
          <div onClick={doClick2} id='P2' onMouseLeave={doMouseLeave} onMouseEnter={doMouseEnter2} className={activeRating >=2 ? 'filled': 'empty'}>
            <FaStar />
          </div>
          <div onClick={doClick3} id='P3'onMouseLeave={doMouseLeave} onMouseEnter={doMouseEnter3} className={activeRating >=3 ? 'filled': 'empty'}>
            <FaStar />
          </div>
          <div onClick={doClick4} id='P4' onMouseLeave={doMouseLeave} onMouseEnter={doMouseEnter4} className={activeRating >=4 ? 'filled': 'empty'}>
            <FaStar />
          </div>
          <div onClick={doClick5} id='P5' onMouseLeave={doMouseLeave} onMouseEnter={doMouseEnter5} className={activeRating >=5 ? 'filled': 'empty'}>
            <FaStar />
          </div>
      </div>
    </>
  );
};

export default PawsRatingInput;
