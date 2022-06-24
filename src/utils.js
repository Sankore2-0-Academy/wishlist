// import { connect, Contract, WalletConnection } from 'near-api-js';
import { CONTRACT_NAME, getConfig } from './config';

const nearConfig = getConfig('development');

// Initialize contract & set global variables
export async function initContract(window) {
  // Initialize connection to the NEAR testnet
  const near = await window.nearApi.connect(nearConfig);

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new window.nearApi.WalletConnection(near);

  // Getting the Account Object. If still unauthorized, it's just empty string
  window.account = window.walletConnection.account();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new window.nearApi.Contract(
    window.account,
    CONTRACT_NAME,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ['add_car', 'read_wishlist', 'delete_car', 'xcc_counter'],
      sender: window.account, // account object to initialize and sign transactions.
    }
  );
}

export const isLoggedIn = () => {
  return window.walletConnection.isSignedIn();
};

export const getAccount = () => {
  return window.walletConnection.getAccountId();
};

export const signIn = () => {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  if (!isLoggedIn()) {
    window.walletConnection.requestSignIn(
      CONTRACT_NAME, // smart contract requesting access
      'Car Wishlist App' // optional
    );
    // window.location.replace(window.location.origin + '/');
  } else {
    alert(`Already logged in as ${getAccount()}`);
  }
};

export const signOut = () => {
  if (isLoggedIn()) {
    window.walletConnection.signOut();
    // Page redirect
    window.location.replace(window.location.origin + '/login');
  } else {
    alert(`Already logged Out!`);
  }
};

/**
 * ====================================================================
 * Smart Contract Methods
 * ====================================================================
 */

export const addCar = async (image, name, model, mileage, year, price) => {
  if (isLoggedIn()) {
    const response = await window.contract.add_car(
      {
        image,
        name,
        model,
        mileage,
        year,
        price,
      },
      '3000000000000', // attached GAS (optional)
      '1000000000000000000000000' // attached deposit in yoctoNEAR (optional)
    );
    return response;
  }
  return null;
};

export const readWishlist = async (start, limit) => {
  if (isLoggedIn()) {
    const response = await window.contract.read_wishlist({ start, limit });
    return response;
  }
  return [];
};

export const removeCar = async (id) => {
  if (isLoggedIn()) {
    const response = await window.contract.delete_car({ id });
    window.location.replace(window.location.origin + '/');
    return response;
  }
  return null;
};
