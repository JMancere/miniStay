import './SpotItem.css'
import { NavLink } from 'react-router-dom';

function SpotItem({ spot }) {

//  "https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png"
//<image src= {spot.previewImage} alt={spot.previewImage}></image>
//<img src="https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png" height="30px" alt="preview"></img>
return (
    <><NavLink to={`${spot.id}`} exact="true">
      <div className='spotItem redBox2 tooltip'>
        <span className="tooltiptext">{spot.name}</span>
        <img src={spot.previewImage} alt={spot.previewImage} height='400px' width="400px"></img>
        <div className='citystate redBox'>
          <p>{spot.city}, {spot.state}</p>
          <p className='stars'>stars: {spot.avgRating}</p>
        </div>
        <p><span className='price'> ${spot.price}</span> night</p>
        {/*<li className="spot-details redBox">
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
        </li>*/}
      </div>
      </NavLink>
    </>
  );
}

/*//  "https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png"
//<image src= {spot.previewImage} alt={spot.previewImage}></image>
//<img src="https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png" height="30px" alt="preview"></img>
return (
  <>
    <div onClick={onClick} className='spotItem redBox2'>
      <img src={spot.previewImage} alt={spot.previewImage} height='400px' width="400px"></img>
      <div className='citystate redBox'>
        <p>{spot.city}, {spot.state}</p>
        <p className='stars'>stars: {spot.avgRating}</p>
      </div>
      <p><span className='price'> ${spot.price}</span>/night</p>
      {/*<li className="spot-details redBox">
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
      </li>* /}
    </div>
  </>
);
}
*/
export default SpotItem;
