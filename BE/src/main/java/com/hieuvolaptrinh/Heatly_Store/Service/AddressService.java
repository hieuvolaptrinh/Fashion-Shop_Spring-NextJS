package com.hieuvolaptrinh.Heatly_Store.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hieuvolaptrinh.Heatly_Store.Model.Address;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Repository.AddressRepository;
import com.hieuvolaptrinh.Heatly_Store.Request.AddressRequest;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public Address createAddress(AddressRequest addressRequest, User user) {
        if (addressRequest == null) {
            throw new RuntimeException("Address request cannot be null");
        }

        Address address = new Address();
        address.setStreetName(addressRequest.getAddressName());
        address.setDistrictName(addressRequest.getDistrictName());
        address.setProvinceName(addressRequest.getProvinceName());
        address.setWardName(addressRequest.getWardName());
        address.setUser(user);

        return addressRepository.save(address);
    }

    /**
     * Delete address by id and verify ownership
     */
    public boolean deleteAddress(Integer addressId, Integer userId) {
        Optional<Address> addressOpt = addressRepository.findByAddressId(addressId);
        if (addressOpt.isPresent()) {
            Address address = addressOpt.get();
            if (address.getUser().getUserId() == userId) {
                addressRepository.delete(address);
                return true;
            }
        }
        return false;
    }

    /**
     * Update address by id and verify ownership
     */
    public Address updateAddress(Integer addressId, AddressRequest addressRequest, Integer userId) {
        if (addressRequest == null) {
            throw new RuntimeException("Address request cannot be null");
        }

        Optional<Address> addressOpt = addressRepository.findByAddressId(addressId);
        if (addressOpt.isPresent()) {
            Address address = addressOpt.get();
            if (address.getUser().getUserId() == userId) {
                address.setStreetName(addressRequest.getAddressName());
                address.setDistrictName(addressRequest.getDistrictName());
                address.setProvinceName(addressRequest.getProvinceName());
                return addressRepository.save(address);
            }
        }
        return null;
    }

    public List<Address> getAllAddressByUserId(Integer userId) {
        return addressRepository.findByUserUserId(userId);
    }

    public Address getAddressById(Integer addressId) {
        return addressRepository.findByAddressId(addressId).orElse(null);
    }

    public boolean isAddressBelongsToUser(Integer addressId, Integer userId) {
        Optional<Address> addressOpt = addressRepository.findByAddressId(addressId);
        if (addressOpt.isPresent()) {
            Address address = addressOpt.get();
            return address.getUser().getUserId() == userId;
        }
        return false;
    }

}
