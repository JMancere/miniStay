import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { getAllSpotsThunk } from '../../store/spots';
import SpotItem from '../SpotItem';
import './Spots.css';

function Spots() {
  const dispatch = useDispatch();

  const spots = useSelector((store) => store.spots)

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);


  //console.log('spots===', spots);

  function getSL(){
    let res = [];
    if (spots.spots){
      for (let spot in spots.spots){
        res.push(<SpotItem key={spots.spots[spot].id} spot={spots.spots[spot]}/>)
      }
    }
    return res ;
  }
  return (
    <div className="redBox">
      <h1>Spot List</h1>
      <ul className="redBox spots">
        {getSL()}
      </ul>
    </div>
  )
}

export default Spots;
