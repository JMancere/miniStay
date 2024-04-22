import './SpotNew.css';

import { useState } from 'react';

function SpotNew() {
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  //const [lat, setLat] = useState('');
  //const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [img4, setImg4] = useState('');
  const [img5, setImg5] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();

    // const article = {}
    // article.id = nanoid();
    // article.title = title;
    // article.imageUrl = imageUrl;
    // article.body = body;

    // dispatch(addArticle(article));

    reset();
  };

  const reset = () => {
    setCountry('');
    setAddress('');
    setCity('');
    setState('');
    //const [lat, setLat] = useState('');
    //const [lng, setLng] = useState('');
    setDescription('');
    setTitle('');
    setPrice('');
    setImgPreview('');
    setImg1('');
    setImg2('');
    setImg3('');
    setImg4('');
    setImg5('');
  };

  return <>
    <div className='containesr'>

    <form className='container' onSubmit={handleSubmit}>
    <h1> Create a new Spot</h1>

    <label>
        Country
        <input
          type='text'
          onChange={(e) => setCountry(e.target.value)}
          value={country}
          placeholder='Country'
          name='country'
        />
      </label>
      <label>
        Street Address
        <input
          type='text'
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          placeholder='Address'
          name='address'
        />
      </label>
      <label>
        City
        <input
          type='text'
          onChange={(e) => setCity(e.target.value)}
          value={city}
          placeholder='City'
          name='city'
        />
      </label>
      ,
      <label>
        State
        <input
          type='text'
          onChange={(e) => setState(e.target.value)}
          value={state}
          placeholder='STATE'
          name='state'
        />
      </label>
      <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name='description'
          placeholder='Please write at least 30 characters'
          rows='10'
      />
      <button type='submit'>Submit</button>
      </form>
    <h2>Where's your place located?</h2>

    <h4>Guests will only get your exact address once they booked a reservation. </h4>
    Country
    Street address
    City , State
    {/* lat and lng */}
    <hr></hr>
    <h2>Describe your place to guests</h2>
    <h4>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
    </h4>
    textinput

    <hr></hr>
    <h2> Create a title for your spot</h2>
    <h4> Catch guests' attention with a spot title that highlights what makes your palce special/</h4>
    input
    <hr></hr>
    <h2>Set a base price for your spot.</h2>
    <h4> Competitive pricing can help your listing stand out and rank higher in search results.</h4>
    $input

    <hr></hr>
    <h2>Liven up your spot with photos</h2>
    <h4> Submit a link to at least one photo to publish your spot.</h4>
    input
    input
    input
    input
    input
    </div>

  </>

}

export default SpotNew;
