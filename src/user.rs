use std::collections::HashMap;

use crate::vehicle::Vehicle;


pub struct User {
 pub email: String,
 pub vehicles: HashMap<String, Vehicle>,
}

impl User {
 pub fn new(email: &str) -> Self {
  Self {
   email: email.to_string(),
   vehicles: HashMap::new()
  }
 }

 pub fn add(&mut self, name: &str, model: &str, mileage: u64, year: &str, price: f64) {
  let vehicle: Vehicle = Vehicle::new(name.to_string(), model.to_string(), mileage, year.to_string(), price);
  let key: &str = self.email.as_str();
  self.vehicles.insert(key.to_string(), vehicle);
 }

 pub fn show(&self) -> Option<&Vehicle> {
  match self.vehicles.get(&self.email) {
   Some(vehicle) => Some(vehicle),
   None => None
  }
 }

 pub fn remove(&mut self) {
  self.vehicles.remove(&self.email);
 }
}