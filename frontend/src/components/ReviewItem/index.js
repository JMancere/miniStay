import './ReviewItem.css'
import { useSelector } from 'react-redux';
import OpenModalBtn from '../Navigation/OpenModalBtn';
import ConfirmModal from '../ConfirmModal';
import { deleteReviewThunk } from '../../store/spots';
import { useDispatch } from 'react-redux';

function ReviewItem({review }) {
  const dispatch = useDispatch();
  //console.log('EL review', review)

  const sessionUser = useSelector(state => state.session.user);

  function getDate(){
    const months = ['January', 'February', 'March',
     'April', 'May', 'June', 'July', 'August',
     'September', 'October', 'November', 'December'];

    const date = new Date(review.updatedAt)

    return `${months[date.getMonth()]} ${date.getFullYear()}`;

  }
  const hasDelete = () =>{
    if (!sessionUser?.id || !review.User?.id) return;

    const yesDelete = () => {
      //want to delete this review.
      //console.log('attempting delete')
      dispatch(deleteReviewThunk(review.id)).then();
    }

    const noDelete = () => {
      //
    }
    const detail =
    {
      heading: "Confirm Delete",
      text: "Are you sure you want to delete this review?",
      yesText: "Yes (Delete Review)",
      noText: "No (Keep Review)",
      yesAction: yesDelete,
      noAction: noDelete
    };

    if (sessionUser.id === review.User.id){
      //return (<button>Delete</button>);
      return (<OpenModalBtn
        buttonText="Delete"
        modalComponent={<ConfirmModal detail={detail}/>}
      />)
    }

    return
  }

  const doDeleteClick = () =>{


  }

  return (
      <>
      <div onClick={doDeleteClick} className='redBox item'>

        <p>{review.User?.firstName}</p>
        <p>{getDate()}</p>
        <p>{review.review}</p>

        {hasDelete()}

      </div>
      </>
    );
  }

export default ReviewItem;
