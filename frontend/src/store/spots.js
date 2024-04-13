import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getAll";

const getAllSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots,
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

//Get all Spots
const initialState = { spots: null };

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
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
