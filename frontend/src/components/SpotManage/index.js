import './SpotManage.css';

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import SpotItem from '../SpotItem';
import { getCurrentSpotsThunk } from '../../store/spots';
import { Link } from 'react-router-dom';

function SpotManage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);

  const spots = useSelector((store) => {
    let result = {spots: {}}
    //console.log('asdasdasdasdas 111111', store.spots.spots)
    for (let spot in store.spots.spots){
      //console.log('asdasdasdasdas 333333', spot)
      //console.log('asdasdasdasdas 3aaaaaa', store.spots.spots[spot])
      if (sessionUser?.id === store.spots.spots[spot].ownerId)
      result.spots[spot] = store.spots.spots[spot];
    }
    //console.log('asdasdasdasdas RRRRR', result)
    return result
  });

  //const spots2 = useSelector((store) => store.spots)
  // const spots = useSelector((store) => {
  //   const result = {};

  //   for (let i in store.spots){
  //     if (store.spots[i]?.ownerId === sessionUser.id){
  //       result[i] = store.spots[i]
  //     }
  //   }
  //   return result;
  // });

  useEffect(() => {
    dispatch(getCurrentSpotsThunk());
    //dispatch(getAllSpotsThunk());
  }, [dispatch]);


  //console.log('spots===', spots);

  function getSL(){
    let res = [];
    if (spots.spots){
      for (let spot in spots.spots){
        res.push(<SpotItem doManage={true} key={spots.spots[spot].id} spot={spots.spots[spot]}/>)
      }
    }
    return res ;
  }

  const getHeader = () => {
    if ((!spots.spots) || Object.keys(spots.spots).length > 0){
      return "Manage Spots";
    } else
      return (
        <Link to="/spots/new">Create a new spot</Link>
      )
  }

  return (
    <div className="redBox">
      {/* <h1>Manage Spots</h1> */}
      <h1>{getHeader()}</h1>
      <ul className="redBox spots">
        {getSL()}
      </ul>
    </div>
  )
}

export default SpotManage;
