import './SpotDetail.css'
import { useDispatch } from "react-redux";

function SpotDetail({ spot }) {
  const dispatch = useDispatch();

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
