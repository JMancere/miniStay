import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { getAllSpotsThunk } from '../../store/spots';
import  SpotDetail  from '../SpotDetail'

function Spots() {
  const dispatch = useDispatch();

  const spots = useSelector((store) => store.spots)

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);


  console.log('spots===', spots);

  function getSL(){
    let res;
    if (spots.spots){

      res = spots.spots.map((spot) => {
          return <SpotDetail key={spot.id} spot={spot} />
      });
    }
    return res ;
  }
  return (
    <div className="spots redBox">
      <h1>Spot List</h1>
      <ul className="redBox spotList">
        {getSL()}
      </ul>
    </div>
  )
}

export default Spots;
