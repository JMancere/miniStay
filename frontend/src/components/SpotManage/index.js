import './SpotManage.css';

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import SpotItem from '../SpotItem';
import { getCurrentSpotsThunk } from '../../store/spots';
import { getAllSpotsThunk } from '../../store/spots';

function SpotManage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);

  const spots2 = useSelector((store) => {
    let result = {}
    for (let spot in store.spots){
      //if (sessionUser?.id === store.spots[spot].Owner?.id)
      result[spot] = store.spots[spot];
    }
    return result
  });

  const spots = useSelector((store) => store.spots)

  useEffect(() => {
    dispatch(getCurrentSpotsThunk());
    //dispatch(getAllSpotsThunk());
  }, [dispatch]);


  console.log('spots===', spots);

  function getSL(){
    let res = [];
    if (spots.spots){
      for (let spot in spots.spots){
        res.push(<SpotItem doManage={true} key={spots.spots[spot].id} spot={spots.spots[spot]}/>)
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

export default SpotManage;
