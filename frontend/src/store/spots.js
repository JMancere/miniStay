import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getAll";
const GET_SPOTDETAILS = "spots/getSpotDetails";
const ADD_SPOT = 'spots/addSpot';
const EDIT_SPOT = 'spots/editSpot';
const DELETE_SPOT = 'spots/deleteSpot';
const DELETE_REVIEW = 'spots/deleteReview';
const ADD_REVIEW = 'spots/addReview';
const GET_SPOTSCURRENT = 'spots/getSpotsCurrent';

const deleteReview = (reviewID) => {
  return {
    type: DELETE_REVIEW,
    payload: reviewID
  };
}

const deleteSpot = (spotID) => {
  return {
    type: DELETE_SPOT,
    payload: spotID
  };
}

const editSpot = (spot) => {
  return {
    type: EDIT_SPOT,
    payload: spot
  };
}

// const addReview = (spotId, review) => {
//   return {
//     type: ADD_REVIEW,
//     payload: review,
//     spotId
//   };
// };

const getAllSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots,
  };
};

const getSpotDetails = (spot, reviews) => {
  return {
    type: GET_SPOTDETAILS,
    payload: spot,
    reviews: {reviews}
  };
};

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    payload: {spot},
  };
}

// const getSpotsCurrent = (spots) => {
//   return {
//     type: GET_SPOTSCURRENT,
//     payload: spots,
//   };
// }

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  //console.log('Deleting REVIEW:::', reviewId);

  let response;
  response = await csrfFetch(`/api/reviews/${reviewId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: null//JSON.stringify(spot)
    }
  );
  if (response.ok){
    //const data = await response.json();
    await response.json();
    //console.log('REVIEW DELETED data', data)
    dispatch(deleteReview(reviewId));
  } else {
  }
  return response;

}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  //console.log('Deleting SPOT:::', spotId);

  let response;
  response = await csrfFetch(`/api/spots/${spotId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: null//JSON.stringify(spot)
    }
  );
  if (response.ok){
    //const data = await response.json();
    await response.json();
    //console.log('SPOTS DELETED data', data)
    dispatch(deleteSpot(spotId));
  } else {
  }
  return response;
}

export const updateSpotThunk = (spot) => async (dispatch) => {
  //console.log('UPDATING SPOT:::', spot);

  let response;
  response = await csrfFetch(`/api/spots/${spot.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot)
    }
  );
  if (response.ok){
    const data = await response.json();
    //console.log('SPOTS THUNK data', data)
    dispatch(editSpot(data));
  } else {
  }
  return response;

}

export const getCurrentSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  //console.log('resp', response)

  if (response.ok){
    const data = await response.json();
    //console.log('SPOTS THUNK data', data)
    dispatch(getAllSpots(data.Spots));
  } else {
  }
  return response;

}

export const createReviewThunk = (spot, review) => async (dispatch) => {
  //console.log('CREATING REVIEW:::', review);

  let response;
  response = await csrfFetch(`/api/spots/${spot.id}/reviews`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }
  );

  if (response.ok){

    //const data = await response.json();
    // dispatch(addReview(spot.id, data));
    dispatch(getSpotDetailsThunk(spot.id))
  } else {
  }

  return response;
};

export const createSpotThunk = (spot) => async (dispatch) => {
  //console.log('CREATING SPOT:::', spot);

  let response;
  response = await csrfFetch("/api/spots/",
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot)
    }
  );

  if (response.ok){
    const data = await response.json();
    dispatch(addSpot(data));
    //console.log('adadaddadad', data)
    //add any images
    if (spot.imgPreview){
      let img = {};
      img.url = spot.imgPreview;
      img.preview = true;
      response = await csrfFetch(`/api/spots/${data.id}/images`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(img)
      }
      );

      for(let i = 1; i <=4; i++){
        if (spot['img'+i]){
          let img = {};
          img.url = spot['img'+i];
          img.preview = false;
          //console.log('attempting create ', 'img'+i, 'img'+i)
          response = await csrfFetch(`/api/spots/${data.id}/images`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(img)
          }
          );
        }
      }
      //reload all spots.
      getAllSpotsThunk()
      return(data)
    }

  } else {
  }

  return response;
};


export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  //console.log('resp', response)

  if (response.ok){
    const data = await response.json();
    //console.log('SPOTS THUNK data', data)
    dispatch(getAllSpots(data.Spots));
  } else {
  }
  return response;
};


export const getSpotDetailsThunk = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`);
  //console.log('resp', response)

  if (response.ok){
    const data = await response.json();
    //console.log('data for spotdets::', data)
    //dispatch(getSpotDetails(data));

    //now that we have pot data, get reviews for that spot.
    const responseReviews = await csrfFetch(`/api/spots/${id}/reviews`);
    if (responseReviews.ok){
      const dataReviews = await responseReviews.json();
      dispatch(getSpotDetails(data, dataReviews));
    } else {
      return responseReviews;
    }
  } else {
    return response;
  }
  return response;
};

//Get all Spots
const initialState = { spots: null };

const spotsReducer = (state = initialState, action) => {
  let newState = structuredClone(state);
  switch (action.type) {
    case ADD_REVIEW:
      if (!newState.spots) newState.spots = {};
      if (!newState.spots[action.spotId]) newState.spots[action.spotId] = {};
      if (!newState.spots[action.spotId].Reviews) newState.spots[action.spotId].Reviews = {};

      newState.spots[action.spotId].Reviews[action.payload.id] = action.payload;
      newState.spots[action.spotId].Reviews2 = action.payload;

      return newState;

    case DELETE_REVIEW:
      //Sice reviews are nested in spots atm (they prob should be seperate store items)
      //need to find and delete whatever wherever review matches.
      if (newState.spots) {
        for (let spot in newState.spots){
          if (newState.spots[spot].Reviews && newState.spots[spot].Reviews[action.payload])
            delete newState.spots[spot].Reviews[action.payload];
        }
      }
      return newState;
    case DELETE_SPOT:
      if (newState.spots && newState.spots[action.payload]) {
        delete newState.spots[action.payload];
      }
      return newState;
    case ADD_SPOT:
      if (!newState.spots) newState.spots = {}
      newState.spots[action.payload.spot.id] = action.payload;
      return newState;
    case EDIT_SPOT:
      if (!newState.spots) newState.spots = {}
          newState.spots[action.payload.id] = action.payload;
      return newState;
    case GET_SPOTDETAILS:
      if (!newState.spots) newState.spots = {};
      newState.spots[action.payload.id] = action.payload;
      //console.log('act revs ===', action.reviews)

      //newState.spots[action.payload.id].Reviews = action.reviews.reviews.Reviews;
      //normalize reviews.
      if (!newState.spots[action.payload.id].Reviews)
        newState.spots[action.payload.id].Reviews = {};
      //newState.spots[action.payload.id].Reviews2 = action.reviews.reviews.Reviews;

      if (Array.isArray(action.reviews.reviews.Reviews)){
        action.reviews.reviews.Reviews.forEach(el => {
          newState.spots[action.payload.id].Reviews[el.id] = el;
        });
      }
      return newState;
      case GET_SPOTS:
    case GET_SPOTSCURRENT:
      if (!newState.spots) newState.spots = {};
      action.payload.forEach(element => {
        newState.spots[element.id] = element
      });
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
