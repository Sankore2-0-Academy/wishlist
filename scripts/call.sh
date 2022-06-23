#!/bin/bash 

source ./scripts/setting.conf

# Add Car to wishlist
# near call $SUB_ACCOUNT add_car '{"image": "https://www.ccarprice.com/products/Toyota_RAV4_Hybrid_LE_2022.jpg", "name": "Toyota", "model": "RAV4", "mileage": 1000, "year": "2022", "price": 5000000}' --accountId yto.testnet --amount 1

# Show wishlist content
# near call $SUB_ACCOUNT read_wishlist '{"start": 0, "limit": 10}' --accountId yto.testnet

# Remove car from wishlist
# near call $SUB_ACCOUNT delete_car '{"id": 1}' --accountId yto.testnet

# Cross contract call for save_name in test.wajakoya.testnet
near call $SUB_ACCOUNT xcc_counter '{"name": "Destiny"}' --accountId yto.testnet --gas 140000000000000
