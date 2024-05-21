import './SpotItem.css'
import { NavLink, useNavigate } from 'react-router-dom';
import OpenModalBtn from '../Navigation/OpenModalBtn';
import ConfirmModal from '../ConfirmModal';
import { deleteSpotThunk } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { FaStar } from 'react-icons/fa6';

function SpotItem( {doManage, spot} ) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

//  "https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png"
//<image src= {spot.previewImage} alt={spot.previewImage}></image>
//<img src="https://www.pinclipart.com/picdir/big/519-5193057_hut-clipart-wooden-house-wooden-house-clipart-png.png" height="30px" alt="preview"></img>

  const updateClick = (e) => {
    e.preventDefault()
    navigate(`${spot.id}/edit`);
  }

  const getManageBtns = () => {
    const yesDelete = () => {
      //want to delete this spot.
      //console.log('attempting delete')
      dispatch(deleteSpotThunk(spot.id)).then();
    }

    const noDelete = () => {
      //
    }

    if (doManage){
      const detail =
        {
          heading: "Confirm Delete",
          text: "Are you sure you want to remove this spot from the listings?",
          yesText: "Yes (Delete Spot)",
          noText: "No (Keep Spot)",
          yesAction: yesDelete,
          noAction: noDelete
        };

      return (
        <>
          <div><button className="btn" onClick={updateClick}>Update</button></div>
          <div>
          <OpenModalBtn
            buttonText="Delete"
            modalComponent={<ConfirmModal detail={detail}/>}
          />
          </div>
        </>
      )
    } else
      return;
  }

  return (
    <><NavLink to={`${spot.id}`} exact="true">
      <div className='spotItem redBox2 tooltip'>
        <span className="tooltiptext">{spot.name}</span>
        <img src={spot.previewImage} alt={spot.previewImage} height='400px' width="400px"></img>
        <div className='citystate redBox'>
          <p>{spot.city}, {spot.state}</p>
          <p className='rating-input'><FaStar /> {spot.avgRating}</p>
        </div>
        {getManageBtns()}
        <p><span className='price'> ${spot.price}</span> night</p>
      </div>
      </NavLink>
    </>
  );
}

export default SpotItem;
