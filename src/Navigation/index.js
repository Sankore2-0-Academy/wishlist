import { Link } from "react-router-dom";
import { signOut } from "../utils";

export const Navigation = ({firstButton, walletAddress, logout}) => {
  const logUserOut = () => {
    signOut();
  }

// https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp

 return (
   <>
     <div className='text-center pt-3 pb-2'>
       <img
         src='/sankore.png'
         alt='Check'
         width='60'
       />
       <h2 className='my-4'>Car Wishlist</h2>
       <div className='d-flex justify-content-between'>
         <div>
           {firstButton && (
             <Link
               to={firstButton.path}
               className='btn btn-small btn-outline-info text-uppercase'
             >
               {firstButton.name}
             </Link>
           )}
         </div>

         {walletAddress && <h2 className='display-6'>{walletAddress}</h2>}

         <div>
           {logout && (
             <button className='btn btn-sm btn-secondary' onClick={logUserOut}>
               Logout
             </button>
           )}
         </div>
       </div>
     </div>
   </>
 );
}
