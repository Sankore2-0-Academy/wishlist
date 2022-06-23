const nearConfig = getConfig('development');

// Initialize contract & set global variables
(async function () {
  // Initialize connection to NEAR testnet
  window.near = await nearApi.connect(nearConfig);

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new nearApi.WalletConnection(near);
  window.account = await walletConnection.account();

  // Initializing our contract APIs by contract name and configuration
  window.contract = new nearApi.Contract(
    account, // the account object that is connecting
    CONTRACT_NAME,
    {
      // name of contract you're connecting to
      viewMethods: [], // view methods do not change state but usually return a value
      changeMethods: ['add_car', 'read_wishlist', 'delete_car', 'xcc_counter'], // change methods modify state
      sender: account, // account object to initialize and sign transactions.
    }
  );
})(window);

const isLoggedIn = () => {
  return window.walletConnection.isSignedIn();
};

const getAccount = () => {
  return window.walletConnection.getAccountId();
};

const login = () => {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  if (!isLoggedIn()) {
    window.walletConnection.requestSignIn(
      CONTRACT_NAME, // smart contract requesting access
      APP_NAME // optional
    );
  } else {
    alert(`Already logged in as ${getAccount()}`);
  }
};

const logout = () => {
  if (isLoggedIn()) {
    window.walletConnection.signOut();
    // Page redirect
    window.location.reload();
  } else {
    alert(`Already logged Out!`);
  }
};

/**
 * ====================================================================
 * Smart Contract Methods
 * ====================================================================
 */

const addCar = async (image, name, model, mileage, year, price) => {
  if (isLoggedIn()) {
    const response = await contract.add_car(
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

const readWishlist = async (start, limit) => {
  if (isLoggedIn()) {
    const response = await contract.read_wishlist({ start, limit });
    return response;
  }
  return [];
};

const delete_car = async (id) => {
  if (isLoggedIn()) {
    const response = await contract.delete_car({id});
    return response;
  }
  return null;
};

const xcc_counter = async (name) => {
  if (isLoggedIn()) {
    const response = await contract.xcc_counter({ name });
    return response;
  }
  return null;
};
