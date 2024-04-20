import './ReviewItem.css'

function ReviewItem({ review }) {
  console.log('EL review', review)

  function getDate(){
    const months = ['January', 'February', 'March',
     'April', 'May', 'June', 'July', 'August',
     'September', 'October', 'November', 'December'];

    const date = new Date(review.updatedAt)

    return `${months[date.getMonth()]} ${date.getFullYear()}`;

  }

  return (
      <>
      <div className='redBox item'>

        <p>{review.User.firstName}</p>
        <p>{getDate()}</p>
        <p>{review.review}</p>
      </div>
      </>
    );
  }

export default ReviewItem;
