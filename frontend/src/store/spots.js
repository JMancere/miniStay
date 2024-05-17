import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getAll";
const GET_SPOTDETAILS = "spots/getSpotDetails";
const ADD_SPOT = 'spots/addSpot';
const ADD_REVIEW = 'soits/addReview';

const addReview = (spotId, review) => {
  return {
    type: ADD_REVIEW,
    payload: review,
    spotId
  };
};

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

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    payload: {spot},
  };
}

export const createReviewThunk = (spot, review) => async (dispatch) => {
  console.log('CREATING REVIEW:::', review);

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

    getSpotDetailsThunk(spot.id)

    //dispatch(addReview(spot.id, data));
  } else {
  }

  return response;
};

export const createSpotThunk = (spot) => async (dispatch) => {
  console.log('CREATING SPOT:::', spot);

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
    console.log('adadaddadad', data)
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
          console.log('attempting create ', 'img'+i, 'img'+i)
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
    console.log('SPOTS THUNK data', data)
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
  let newState = structuredClone(state);
  switch (action.type) {
    case ADD_REVIEW:
      if (!newState.details[action.payload.spotId].reviews) {
        newState.details[action.payload.spotId].reviews = []
      }
      newState.details[action.payload.spotId].reviews.push(action.payload)
      return newState;
    case ADD_SPOT:
      if (!newState.spots) newState.spots = {}
      newState.spots[action.payload.spot.id] = action.payload;
      return newState;
    case GET_SPOTDETAILS:

      if (!newState.details) newState.details = {};
      newState.details[action.payload.spot.id] = action.payload;

      return newState;
    case GET_SPOTS:
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
