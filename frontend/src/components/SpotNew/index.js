import './SpotNew.css';

import { useState } from 'react';
import { createSpotThunk } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

function SpotNew() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [img4, setImg4] = useState('');
  const [errors, setErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const spot = {}
    spot.country = country;
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.lat = lat;
    spot.lng = lng;
    spot.description = description;
    spot.name = name;
    spot.price = price;
    spot.imgPreview = imgPreview;
    spot.img1 = img1;
    spot.img2 = img2;
    spot.img2 = img3;
    spot.img2 = img4;


    return dispatch(createSpotThunk(spot))
      .then(
        reset()
      ).catch(async (res) => {
        const data = await res.json();

        console.log('EL errors::', data.errors)
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });

  };

  const reset = () => {
    if (errors)
      return;
    setCountry('');
    setAddress('');
    setCity('');
    setState('');
    setLat('');
    setLng('');
    setDescription('');
    setName('');
    setPrice('');
    setImgPreview('');
    setImg1('');
    setImg2('');
    setImg3('');
    setImg4('');

    navigate("/");
  };

  return <>
      <form className='container' onSubmit={handleSubmit}>
        {/* <div className='inForm'> */}
        <h1> Create a new Spot</h1>
        <h2>Where's your place located?</h2>
        <h4>Guests will only get your exact address once they booked a reservation. </h4>
        {/* <label> */}
            Country
            {errors.country && (<p className="error">{errors.country}</p>)}
            <input
              type='text'
              onChange={(e) => setCountry(e.target.value)}
              value={country}
              placeholder='Country'
              name='country'
              required
            />
          {/* </label> */}
          {/* <label> */}
            Street Address
            {errors.address && (<p className="error">{errors.address}</p>)}
            <input
              type='text'
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder='Address'
              name='address'
              required
            />
          {/* </label> */}
          {/* <label> */}
            City
            {errors.city && (<p className="error">{errors.city}</p>)}
            <input
              type='text'
              onChange={(e) => setCity(e.target.value)}
              value={city}
              placeholder='City'
              name='city'
              required
            />
          {/* </label> */}
          ,
          {/* <label> */}
            State
            {errors.state && (<p className="error">{errors.state}</p>)}
            <input
              type='text'
              onChange={(e) => setState(e.target.value)}
              value={state}
              placeholder='STATE'
              name='state'
              required
            />
          {/* </label> */}
          {/* lat and lng */}
          Latitude
          {errors.lat && (<p className="error">{errors.lat}</p>)}
            <input
              type='text'
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              placeholder='Latitude'
              name='lat'
              required
            />
            Longitude
            {errors.lng && (<p className="error">{errors.lng}</p>)}
            <input
              type='text'
              onChange={(e) => setLng(e.target.value)}
              value={lng}
              placeholder='Longitude'
              name='lng'
              required
            />

          <hr></hr>
          <h2>Describe your place to guests</h2>
          <h4>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
          </h4>
          {errors.description && (<p className="error">{errors.description}</p>)}
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name='description'
              placeholder='Please write at least 30 characters'
              rows='10'
              required
          />
        <hr></hr>
        <h2> Create a title for your spot</h2>
        <h4> Catch guests' attention with a spot title that highlights what makes your palce special/</h4>
        {errors.title && (<p className="error">{errors.title}</p>)}
        <input
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Name of your spot'
              name='name'
              required
        />
        <hr></hr>
        <h2>Set a base price for your spot.</h2>
        <h4> Competitive pricing can help your listing stand out and rank higher in search results.</h4>
        {errors.price && (<p className="error">{errors.price}</p>)}
        <input
              type='text'
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              placeholder='Price per night (USD)'
              name='price'
              required
        />
        <hr></hr>
        <h2>Liven up your spot with photos</h2>
        <h4> Submit a link to at least one photo to publish your spot.</h4>
        {errors.imgPreview && (<p className="error">{errors.imgPreview}</p>)}
        <input
              type='text'
              onChange={(e) => setImgPreview(e.target.value)}
              value={imgPreview}
              placeholder='Preview Image URL'
              name='imgPreview'
        />
        {errors.img1 && (<p className="error">{errors.img1}</p>)}
        <input
              type='text'
              onChange={(e) => setImg1(e.target.value)}
              value={img1}
              placeholder='Image URL'
              name='img1'
        />
        {errors.img2 && (<p className="error">{errors.img2}</p>)}
        <input
              type='text'
              onChange={(e) => setImg2(e.target.value)}
              value={img2}
              placeholder='Image URL'
              name='img2'
        />
        {errors.img3 && (<p className="error">{errors.img3}</p>)}
        <input
              type='text'
              onChange={(e) => setImg3(e.target.value)}
              value={img3}
              placeholder='Image URL'
              name='img3'
        />
        {errors.img4 && (<p className="error">{errors.img4}</p>)}
        <input
              type='text'
              onChange={(e) => setImg4(e.target.value)}
              value={img4}
              placeholder='Image URL'
              name='img4'
        />

        <hr></hr>

        <button type='submit'>Create Spot</button>
        {/* </div> */}
      </form>
  </>
}

export default SpotNew;