import './SpotItem.css'
import { NavLink } from 'react-router-dom';

function SpotItem( {spot} ) {

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
      </div>
      </NavLink>
    </>
  );
}

export default SpotItem;
