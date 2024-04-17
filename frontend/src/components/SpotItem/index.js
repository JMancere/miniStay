import './SpotItem.css'

function SpotItem({ spot }) {

//  "https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png"
//<image src= {spot.previewImage} alt={spot.previewImage}></image>
return (
    <>
      <p>{spot.city}, {spot.state}</p>
      <img src="https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png" height="30px" alt="preview"></img>
      <img src={spot.previewImage} height="30px" alt="preview"></img>
      <p>stars: {spot.avgRating}</p>
      <p>{spot.price} night</p>
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
    </>
  );
}

export default SpotItem;
