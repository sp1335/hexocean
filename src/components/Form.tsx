import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  name: string;
  preparation_time: string;
  type: string;
  no_of_slices?: number;
  diameter?: number;
  spiciness_scale?: number;
  slices_of_bread?: number;
}

const Form: React.FC = () => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [dishType, setDishType] = useState('');
  const [noOfSlices, setNoOfSlices] = useState(0);
  const [diameter, setDiameter] = useState(0.0);
  const [spicinessScale, setSpicinessScale] = useState(0);
  const [slicesOfBread, setSlicesOfBread] = useState(0);
  const [response, setResponse] = useState('');

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleHoursChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setHours(parseInt(event.target.value));
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setMinutes(parseInt(event.target.value));
  };

  const handleSecondsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSeconds(parseInt(event.target.value));
  };

  const handleDishType = (event: ChangeEvent<HTMLSelectElement>) => {
    setDishType(event.target.value);
  };

  const handleNoOfSlicesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNoOfSlices(parseInt(event.target.value));
  };

  const handleDiameterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDiameter(parseFloat(event.target.value));
  };

  const handleSpicinessScaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSpicinessScale(parseInt(event.target.value));
  };

  const handleSlicesOfBreadChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlicesOfBread(parseInt(event.target.value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: FormData = {
      name: name,
      type: dishType,
      preparation_time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    };

    if (dishType === 'pizza') {
      formData.no_of_slices = noOfSlices;
      formData.diameter = diameter;
    } else if (dishType === 'soup') {
      formData.spiciness_scale = spicinessScale;
    } else if (dishType === 'sandwich') {
      formData.slices_of_bread = slicesOfBread;
    }

    try {
      const response = await axios.post('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', formData);
      setResponse('Dish submitted successfully!')
    } catch (error) {
      setResponse(error.response.data.type||error.response.data.name)
    }

    console.log(formData);
  };

  const renderPizzaFields = () => {
    return (
      <div className='pizzaFields'>
        <div>
          <p className='fs-5'>Number of slices</p>
          <input
            value={noOfSlices}
            type='number'
            min='1'
            onChange={handleNoOfSlicesChange}
            className='inputPizza'
          />
        </div>
        <div>
          <p className='fs-5'>Diameter</p>
          <input
            type='number'
            step='0.5'
            min='15'
            value={diameter}
            onChange={handleDiameterChange}
            className='inputPizza'
          />
        </div>
      </div>
    );
  };

  const renderSoupFields = () => {
    return (
      <div className='soupFields'>
        <p className='fs-5'>Spiciness Scale</p>
        <div className='d-flex gap-3'>
          <input
            type='range'
            min='1'
            max='10'
            value={spicinessScale}
            onChange={handleSpicinessScaleChange}
          />
          <p className='fs-5'>{spicinessScale}</p>
        </div>
      </div>
    );
  };

  const renderSandwichFields = () => {
    return (
      <div className='sandwichFields'>
        <p className='fs-5'>Number of slices of bread</p>
        <input
          type='number'
          min='1'
          value={slicesOfBread}
          onChange={handleSlicesOfBreadChange}
          className='inputPizza'
        />
      </div>
    );
  };

  return (
    <>
      <form className='formbody' onSubmit={handleSubmit}>
        <h2>Dish form</h2>
        {response && (
          <div>
            <p>{response}</p>
          </div>
        )}
        <div className='inputGroup'>
          <p className='fs-5'>Name:</p>
          <input type='text' min='3' value={name} onChange={handleNameChange} placeholder='Type dish name' />
        </div>
        <div className='inputGroup'>
          <p className='fs-5'>Type</p>
          <select value={dishType} onChange={handleDishType} className='fs-5'>
            <option className='text-muted' value=''>
              Select dish type
            </option>
            <option value='pizza'>Pizza</option>
            <option value='soup'>Soup</option>
            <option value='sandwich'>Sandwich</option>
          </select>
        </div>
        {dishType === 'pizza' && renderPizzaFields()}
        {dishType === 'soup' && renderSoupFields()}
        {dishType === 'sandwich' && renderSandwichFields()}
        <div className='inputGroup'>
          <p className='fs-5'>Preparation time</p>
          <div className='d-flex gap-1 align-item-center'>
            <select value={hours} onChange={handleHoursChange} className='fs-5 rounded preptime'>
              {Array.from(Array(24).keys()).map((hour) => (
                <option key={hour} value={hour} className='fs-5 preptime'>
                  {hour.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <span> : </span>
            <select value={minutes} onChange={handleMinutesChange} className='fs-5 rounded preptime'>
              {Array.from(Array(60).keys()).map((minute) => (
                <option key={minute} value={minute} className='fs-5 preptime'>
                  {minute.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <span> : </span>
            <select value={seconds} onChange={handleSecondsChange} className='fs-5 rounded preptime'>
              {Array.from(Array(60).keys()).map((second) => (
                <option key={second} value={second} className='fs-5'>
                  {second.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </>
  );
};

export default Form;