// use std::collections::HashMap;

mod vehicle;
pub mod user;

use vehicle::Vehicle;
use user::User;


pub fn main() {
    let email = "Kevin@gmail.com";
    let mut user: User = User::new(&email);

    println!("{} is logged in", user.email);

    let model: &str = "RAV4";
    user.add("Toyota", model, 0, "2022", 5000000.0);
    
    println!("{:?}", user.show());
}

#[cfg(test)]
mod tests {
    use crate::user::User;
    use crate::vehicle::Vehicle;
    // use super::*;

    #[test]
    fn create_user_object() {
        let email: &str = "abc@gmail.com";
        let user: User = User::new(&email);

        assert_eq!(&email, &user.email);
    }
    
    #[test]
    fn add_to_wishlist() {
        let email: &str = "abc@gmail.com";
        let mut user: User = User::new(&email);
        let model: &str = "RAV4";
        user.add("Toyota", model, 0, "2022", 5000000.0);

        assert_eq!(1, user.vehicles.len());

        match user.vehicles.get(&user.email){
            Some(vehicle) => assert_eq!(model, &vehicle.model),
            None => println!("Failed")
        }
        
    }

    #[test]
    fn remove_from_wishlist() {

        let email: &str = "abc@gmail.com";
        let mut user: User = User::new(&email);
        let model: &str = "RAV4";
        user.add("Toyota", model, 0, "2022", 5000000.0);

        assert_eq!(1, user.vehicles.len());

        user.remove();

        assert_eq!(0, user.vehicles.len());
    }
}