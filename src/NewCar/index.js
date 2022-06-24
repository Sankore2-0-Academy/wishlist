import {Navigation} from '../Navigation';
import { isLoggedIn, addCar } from '../utils';

const index = () => {
  // Check if logged in
  if (!isLoggedIn()) {
    window.location.replace(window.location.origin + '/login');
  }

  const submit = async (event) => {
   event.preventDefault();
   const image = event.target.image.value;
   const name = event.target.name.value;
   const model = event.target.model.value;
   const mileage = event.target.mileage.value;
   const year = event.target.year.value;
   const price = event.target.price.value;

   const addedCar = await addCar(
     image,
     name,
     model,
     Number.parseInt(mileage),
     year,
     Number.parseFloat(price)
   );

   event.target.reset();

   if (addedCar != null) {
     window.location.replace(window.location.origin + '/');
   }
  };

  return (
    <>
      <Navigation
        firstButton={{ name: 'back', path: '/' }}
        walletAddress='test.testnet'
        logout
      />
      <form onSubmit={submit} id='new-car'>
        <h2 className='display-5 text-center'>New Car Records</h2>
        <div className='row mb-3'>
          <div className='col'>
            <input
              name='image'
              type='url'
              className='form-control'
              placeholder='Image'
              aria-label='Image'
            />
          </div>
          <div className='col'>
            <input
              name='name'
              type='text'
              className='form-control'
              placeholder='Name'
              aria-label='Name'
            />
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <input
              name='model'
              type='text'
              className='form-control'
              placeholder='Model'
              aria-label='Model'
            />
          </div>
          <div className='col'>
            <input
              name='mileage'
              type='number'
              className='form-control'
              placeholder='Mileage'
              aria-label='Mileage'
            />
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <input
              name='price'
              type='number'
              className='form-control'
              placeholder='Price'
              aria-label='Price'
            />
          </div>
          <div className='col'>
            <input
              name='year'
              type='text'
              className='form-control'
              placeholder='Year'
              aria-label='Year'
            />
          </div>
        </div>
        <button type='submit' className='btn btn-info'>
          Add
        </button>
      </form>
    </>
  );
}

export default index;