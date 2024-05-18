import './ReviewItem.css'
import { useSelector } from 'react-redux';

function ReviewItem({review }) {
  console.log('EL review', review)

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

    if (sessionUser.id === review.User.id)
      return (<button>Delete</button>);


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
