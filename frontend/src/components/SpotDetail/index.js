import './SpotDetail.css'
import { useDispatch, useSelector } from "react-redux";
import {useParams} from 'react-router-dom';
import { getAllSpotsThunk } from '../../store/spots';
import { useEffect } from 'react';

function SpotDetail() {
  //need to get spot from store.

  const dispatch = useDispatch();

  const { id } = useParams();

  //If we are loading this spot page directly, bypassing spots, the store will not be initialized.
  const spot = useSelector((store) => store.spots.spots?.find((e) => e.id === Number(id)));

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  if (!spot)
    return <></>

  return (
    <li className="spot-details redBox">
      <p className="redBox" >id: {spot.id}</p>
      <p>name: {spot.name}</p>
      <p>descrition: {spot.description}</p>
      <p>address: {spot.address}</p>
      <p>city: {spot.city}</p>
      <p>state: {spot.state}</p>
      <p>country: {spot.country}</p>
      <p>lat: {spot.lat}</p>
      <p>lng: {spot.lng}</p>
      <p>price: {spot.price}</p>
      <p>ownerId: {spot.ownerId}</p>
      <p>previewImage: {spot.previewImage}</p>
      <p>avgRating: {spot.avgRating}</p>
      <p>CA: {spot.createdAt}</p>
      <p>UP: {spot.updatedAt}</p>
    </li>
  );
}

export default SpotDetail;
