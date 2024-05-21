import './SpotDetail.css'
import { useDispatch, useSelector } from "react-redux";
import {useParams} from 'react-router-dom';
import { getSpotDetailsThunk } from '../../store/spots';
import { useEffect } from 'react';
import ReviewItem from '../ReviewItem';

import OpenModalBtn from '../Navigation/OpenModalBtn';
import NewReviewModal from '../NewReviewModal';
import { FaStar } from 'react-icons/fa6';


function SpotDetail() {
  //need to get spot from store.
  const dispatch = useDispatch();

  const { id } = useParams();

  const sessionUser = useSelector(state => state.session.user);

  const spot = useSelector((store) => {
    //console.log('store=====', store);
    if (store.spots.spots && store.spots.spots[id])
      return store.spots.spots[id];

     return null
  });

  let reviews = useSelector((store) => {
    if (store.spots.spots && store.spots.spots[id])
      return store.spots.spots[id].Reviews;

     return null
  });
  if (!reviews) reviews = {}

  useEffect(() => {
     dispatch(getSpotDetailsThunk(id));
  }, [dispatch, id]);


  //console.log('EL SESSIONUSER:::', sessionUser)
  //console.log('EL SPOT:::', spot)
  //console.log('EL REVIEWS:::', reviews)

  function getImages(){
    //return preview first then the rest
    let imgs = [];
    for (let i = 0; i < 5; i++)
      imgs[i] = null;

    if (spot.SpotImages){
      let counter = 1;
      for (let i of spot.SpotImages){
        if (i.preview)
          imgs[0] = i.url;
        else {
          imgs[counter] = i.url;
          counter++;
        }
      }
    }
    return imgs
  }

  if (!spot)
    return <></>

  let imgs = getImages();
  let previewImage = imgs[0];
  let img1 = imgs[1];
  let img2 = imgs[2];
  let img3 = imgs[3];
  let img4 = imgs[4];

  function currentUserOwnsSpot(){
    return sessionUser ? sessionUser.id === spot.Owner?.id : true;
  }

  function currentUserAuthToReview(){
    //to post a review need to not be the owner
    //and not have any reviews for this spot.
    let validUser = sessionUser ? sessionUser.id !== spot.Owner?.id : false;

    if (!validUser || Object.keys(reviews).length === 0) return;

    for (let r in reviews){
      validUser = validUser && (reviews[r].User.id !== sessionUser.id)
    }
    if (validUser){
      return (
        <OpenModalBtn
         buttonText="Post your review"
         modalComponent={<NewReviewModal spot={spot}/>}
       />)
    }

  }

  function getRL(){

      let res;
      if (reviews){
        if (Object.keys(reviews).length === 0){
          if (!currentUserOwnsSpot()){
            //if logged in does not own spot.
            res = (<>
                   <OpenModalBtn
                    buttonText="Post your review"
                    modalComponent={<NewReviewModal spot={spot}/>}
                  />
              <p>Be the first to post a review!</p>
            </>
            )
          }
        } else {

          let lcl = []
          for (let r in reviews){
            lcl.push(reviews[r]);
          }
          //console.log('asdasdasdasdas222223211312')
          // let lclSort = lcl.sort( (a, b) => {
          //   let timeA = a.createdAt;
          //   let timeB = b.createdAt;
          //   return timeA > timeB;
          //   }
          // );

          res = lcl.map((review) => {
            return <ReviewItem className='reviewItem' key={review.id} review={review}/>
          });
        }
      }
      return res;
    }

  function getStarLengthStr(length){
    if (length === 1)
      return '• ' + length + ' Review';
    else if (length > 1)
      return '• ' + length + ' Reviews';
    else
    return '';
  }
  function reserveClick(e){
    window.alert('Feature Coming Soon...')
  }

  if (!spot.Owner)
    return

  return (
    <>
    <div className="DetailTOP redBox">
      <h1>{spot.name}</h1>
      <p>{spot.city}, {spot.state}, {spot.country}</p>
      <div className="topDetailGrid redBox">
        <img className='prevImg' src={previewImage} alt={previewImage} ></img>
        {{img1} && <img className='Img1 imgSub' src={img1} alt={img1} ></img>}
        {{img2} && <img className='Img2 imgSub' src={img2} alt={img2} ></img>}
        {{img3} && <img className='Img3 imgSub' src={img3} alt={img3} ></img>}
        {{img4} && <img className='Img4 imgSub' src={img4} alt={img4} ></img>}
      </div>
    </div>
    <div className="DetailMid redBox">
      <h2 className='host'>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
      <p className='desc'>{spot.description}</p>
      <div className='midRating'>
        <div className='reserveBox'>
          <p><span style={{"fontWeight": "bold"}}>${spot.price}</span> night</p>
          <p className='rating-input'><FaStar /> {spot.avgStarRating} {getStarLengthStr(Object.keys(reviews).length)}</p>
          <button onClick={reserveClick} className='midBtn'>Reserve</button>
        </div>

      </div>
    </div>

    <h2 className='rating-input'><FaStar /> {spot.avgStarRating} {getStarLengthStr(Object.keys(reviews).length)}</h2>
    <div className="DetailBottom redBox">
      {currentUserAuthToReview()}
      {getRL()}
    </div>
    </>
  );
}

export default SpotDetail;
