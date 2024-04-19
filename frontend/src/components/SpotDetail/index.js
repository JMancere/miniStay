import './SpotDetail.css'
import { useDispatch, useSelector } from "react-redux";
import {useParams} from 'react-router-dom';
import { getSpotDetailsThunk } from '../../store/spots';
import { useEffect } from 'react';

function SpotDetail() {
  //need to get spot from store.

  const dispatch = useDispatch();

  const { id } = useParams();

  //If we are loading this spot page directly, bypassing spots, the store will not be initialized.
  //const spot = useSelector((store) => store.spots.spots?.find((e) => e.id === Number(id)));
  const spot = useSelector((store) => {
    if (store.spots.details)
      return store.spots.details[id];

     return null
  });

  useEffect(() => {
     dispatch(getSpotDetailsThunk(id));
  }, [dispatch, id]);


console.log('EL SPOT:::', spot)

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

  return (
    <div className="redBox">
      <h1>{spot.name}</h1>
      <p>{spot.city}, {spot.state}, {spot.country}</p>
      <div className="topDetailGrid redBox">
        <img className='prevImg' src={previewImage} alt={previewImage} ></img>
        {{img1} && <img className='Img1 imgSub' src={img1} alt={img1} ></img>}
        {{img2} && <img className='Img2 imgSub' src={img2} alt={img2} ></img>}
        {{img3} && <img className='Img3 imgSub' src={img3} alt={img3} ></img>}
        {{img4} && <img className='Img4 imgSub' src={img4} alt={img4} ></img>}

      </div>


      <p className="redBox" >id: {spot.id}</p>
      <p>descrition: {spot.description}</p>
      <p>address: {spot.address}</p>
      <p>lat: {spot.lat}</p>
      <p>lng: {spot.lng}</p>
      <p>price: {spot.price}</p>
      <p>ownerId: {spot.ownerId}</p>
      <p>previewImage: {spot.previewImage}</p>
      <p>avgRating: {spot.avgRating}</p>
      <p>CA: {spot.createdAt}</p>
      <p>UP: {spot.updatedAt}</p>
    </div>
  );

    // return (
  //   <li className="spot-details redBox">
  //     <p className="redBox" >id: {spot.id}</p>
  //     <p>name: {spot.name}</p>
  //     <p>descrition: {spot.description}</p>
  //     <p>address: {spot.address}</p>
  //     <p>city: {spot.city}</p>
  //     <p>state: {spot.state}</p>
  //     <p>country: {spot.country}</p>
  //     <p>lat: {spot.lat}</p>
  //     <p>lng: {spot.lng}</p>
  //     <p>price: {spot.price}</p>
  //     <p>ownerId: {spot.ownerId}</p>
  //     <p>previewImage: {spot.previewImage}</p>
  //     <p>avgRating: {spot.avgRating}</p>
  //     <p>CA: {spot.createdAt}</p>
  //     <p>UP: {spot.updatedAt}</p>
  //   </li>
  // );
}

export default SpotDetail;
