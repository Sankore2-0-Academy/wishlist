/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc, Promise};
use near_sdk::collections::LookupMap;

mod vehicle;
mod user;

use vehicle::Vehicle;
use user::User;

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Wishlist {
    wishlist: LookupMap<String, User>,
}

impl Default for Wishlist {
  fn default() -> Self {
    Self {
      wishlist: LookupMap::new(b"w".to_vec()),
    }
  }
}

#[near_bindgen]
impl Wishlist {
    #[payable]
    pub fn add_car(&mut self, image: String, name: String, model: String, mileage: u64, year: String, price: u64) {
        let signer = env::predecessor_account_id();
        let deposit = env::attached_deposit();
        let initial_storage = self.initial_storage();

        if let Some(mut user) = self.wishlist.get(&signer) {
            user.add(
                image,
                name, 
                model, 
                mileage, 
                year, 
                price as f64
            );
            self.wishlist.insert(&signer, &user);
            self.settle_storage_cost(initial_storage, deposit, &signer);
        } else {
            let mut user = User::new_user();
            user.add(
                image,
                name, 
                model, 
                mileage, 
                year, 
                price as f64
            );
            self.wishlist.insert(&signer, &user);
            self.settle_storage_cost(initial_storage, deposit, &signer);
        }
    }

    pub fn read_wishlist(&self, start: u32, limit: u32) -> Option<Vec<Vehicle>> {
        let signer = env::predecessor_account_id();

        if let Some(user) = self.wishlist.get(&signer) {
            let vehicles: Vec<Vehicle> = user.show(start, limit);
            Some(vehicles)
        } else {
            Some(vec![])
        }
    }

    pub fn delete_car(&mut self, id: u64) -> Option<Vehicle> {
        let signer = env::predecessor_account_id();
        let initial_storage = self.initial_storage();

        if let Some(mut user) = self.wishlist.get(&signer) {
            let removed_vehicle = user.remove(id);
            self.wishlist.insert(&signer, &user);
            self.refund_storage_cost(initial_storage, &signer);
            Some(removed_vehicle)
        } else {
            None
        }
    }

    fn initial_storage(&self) -> u64 {
        let initial_storage = env::storage_usage();
        initial_storage
    }

    fn settle_storage_cost(&self, initial_storage: u64, attached_deposit: u128, signer: &str) {
        let current_storage = env::storage_usage();
        let used_storage = current_storage - initial_storage;
        let storage_unit_price = env::storage_byte_cost();

        if let Some(payable_storage_cost) = storage_unit_price.checked_mul(used_storage.into()) {
            assert!(attached_deposit >= payable_storage_cost);

            let excess = attached_deposit - payable_storage_cost;
            self.refund_excess(excess, signer);
        } else {
            panic!("Error calculating storage cost");
        }
    }

    fn refund_storage_cost(&self, initial_storage: u64, signer: &str) {
        let current_storage = env::storage_usage();
        let storage_released = initial_storage - current_storage;
        let storage_unit_price = env::storage_byte_cost();

        if let Some(refundable_storage_cost) = storage_unit_price.checked_mul(storage_released.into()) {
            self.refund_excess(refundable_storage_cost, signer);
        } else {
            panic!("Error calculating storage cost");
        }
    }

    fn refund_excess(&self, excess: u128, signer: &str) {
        if excess > 0 {
            Promise::new(signer.to_string()).transfer(excess);
        }
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::env::log;
    use near_sdk::{MockedBlockchain};
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 1000000000000000000000000,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    fn get_params() -> (String, String, String, u64, String, u64) {
        let image: String = String::from("https://www.ccarprice.com/products/Toyota_RAV4_Hybrid_LE_2022.jpg");
        let name: String = String::from("Toyota");
        let model: String = String::from("RAV4");
        let mileage: u64 = 10000;
        let year: String = String::from("2022");
        let price: u64 = 10000000;
        (image, name, model, mileage, year, price)
    }

    #[test]
    fn add_to_wishlist() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Wishlist::default();
        let params = get_params();
        contract.add_car(params.0, params.1, params.2, params.3, params.4, params.5);

        if let Some(vehicles) = contract.read_wishlist(0, 3) {
            assert_eq!(1, vehicles.len());
            let test_params = get_params();
            assert_eq!(&vehicles[0].model, &test_params.2);
        } else {
            log(b"Error in the code");
        }
        
    }

    #[test]
    fn remove_from_wishlist() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Wishlist::default();
        let params = get_params();
        contract.add_car(params.0, params.1, params.2, params.3, params.4, params.5);

        if let Some(vehicles) = contract.read_wishlist(0, 3) {
            assert_eq!(1, vehicles.len());
        } else {
            log(b"Error reading wishlist");
        }

        contract.delete_car(0);

        if let Some(vehicles) = contract.read_wishlist(0, 3) {
            assert_eq!(0, vehicles.len());
        } else {
            log(b"Error reading wishlist");
        }
    }
}
