use near_sdk::borsh::{self, BorshSerialize, BorshDeserialize};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{near_bindgen};

use crate::vehicle::Vehicle;

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
 vehicles: Vec<Vehicle>,
}

impl Default for User {
  fn default() -> Self {
    Self {
      vehicles: vec![]
    }
  }
}

#[near_bindgen]
impl User {
 pub fn new_user() -> Self {
  Self {
   vehicles: vec![]
  }
 }

 pub fn add(&mut self, image: String, name: String, model: String, mileage: u64, year: String, price: f64) {
  let vehicle: Vehicle = Vehicle::new(image, name, model, mileage, year, price);
  self.vehicles.push(vehicle);
 }

 pub fn show(&self, start: u32, limit: u32) -> Vec<Vehicle> {
  let result: Vec<Vehicle> = self.vehicles.iter().skip(start as usize).take(limit as usize).cloned().collect();
  result
 }

 pub fn remove(&mut self, index: u64) -> Vehicle {
  let size: u64 = self.vehicles.len() as u64;
  assert!(size > 0 && index < size, "Wishlist Empty!");
  self.vehicles.remove(index as usize)
 }
}