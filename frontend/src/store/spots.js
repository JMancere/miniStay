import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getAll";
const GET_SPOTDETAILS = "spots/getSpotDetails";

const getAllSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots,
  };
};

const getSpotDetails = (spot, reviews) => {
  return {
    type: GET_SPOTDETAILS,
    payload: {spot, reviews},
  };
};

export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  //console.log('resp', response)

  if (response.ok){
    const data = await response.json();
    //console.log('data', data)
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
    //console.log('data', data)
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
  let newState;
  switch (action.type) {
    case GET_SPOTDETAILS:
      newState = Object.assign({}, state);
      if (!newState.details)
      newState.details = {};
      newState.details[action.payload.spot.id] = action.payload;
      return newState;
    case GET_SPOTS:
      newState = Object.assign({}, state);
      //TODO normalize and convert to {} from []
      newState.spots = action.payload;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
