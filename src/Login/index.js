import { Navigation } from '../Navigation';
import { signIn, isLoggedIn } from '../utils';

const index = () => {
 if (isLoggedIn()) {
   window.location.replace(window.location.origin + '/');
 }
 
 const login = () => {
  signIn();
 }

 return (
   <>
     <Navigation
       walletAddress='Authentication Required'
     />
     <div className='d-flex justify-content-center'>
       <button onClick={login}
         className='btn btn-small btn-warning text-center'
       >
         Login
       </button>
     </div>
   </>
 );
}

export default index;