import { useEffect, useState } from 'react';
import { Navigation } from '../Navigation';
import {
  isLoggedIn,
  signIn,
  getAccount,
  readWishlist,
  removeCar,
} from '../utils';

const Index = () => {
  // Check if logged in
  if (!isLoggedIn()) {
    signIn();
  }
  
  const [accountId, setAccountId] = useState();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setAccountId(getAccount());
    readWishlist(0, 50)
      .then((res) => {
        setWishlist(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navigation
        firstButton={{ name: 'new', path: 'new' }}
        walletAddress={accountId}
        logout
      />
      <table className='table text-white mb-0'>
        <thead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Model</th>
            <th scope='col'>Mileage</th>
            <th scope='col'>Year</th>
            <th scope='col'>Price</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody id='car-records'>
          {/* Start of List */}
          {wishlist.map(({ image, name, model, mileage, year, price }, i) => (
            <tr key={i} className='fw-normal'>
              <th>
                <img
                  src={image}
                  alt='Toyota'
                  style={{ width: '45px', height: 'auto' }}
                />
                <span className='ms-2'>{name}</span>
              </th>
              <td className='align-middle'>
                <span>{model}</span>
              </td>
              <td className='align-middle'>
                <span>{mileage}</span>
              </td>
              <td className='align-middle'>
                <span>{year}</span>
              </td>
              <td className='align-middle'>
                <span>${price}</span>
              </td>
              <td className='align-middle'>
                <a
                  href='#!'
                  onClick={() => {
                    removeCar(i);
                  }}
                  data-mdb-toggle='tooltip'
                  title='Remove'
                >
                  <i className='fa fa-trash fa-lg text-danger'></i>
                </a>
              </td>
            </tr>
          ))}
          {/* End of List */}
        </tbody>
      </table>
    </>
  );
};

export default Index;
