package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.Address;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Model.Role;
import com.hieuvolaptrinh.Heatly_Store.Model.Cart;
import com.hieuvolaptrinh.Heatly_Store.Repository.UserRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.RoleRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.CartRepository;
import com.hieuvolaptrinh.Heatly_Store.Request.AddressRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.RegisterRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.UserRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.UserResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.UserResponse.AddressResponse;
import com.hieuvolaptrinh.Heatly_Store.Util.Error.GlobalException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressService addressService;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;

    public UserService(UserRepository userRepository, AddressService addressService,
                       RoleRepository roleRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.addressService = addressService;
        this.roleRepository = roleRepository;
        this.cartRepository = cartRepository;

    } // Fetch user by phone number

    public User fetchUserLogin(String identifier) {
        Optional<User> userOptional;
        userOptional = userRepository.findByPhoneNumber(identifier);
        return userOptional.orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String registerUser(RegisterRequest registerRequest) throws Exception {

        Optional<User> existingUser = userRepository.findByPhoneNumber(registerRequest.getPhoneNumber());
        if (existingUser.isPresent()) {
            throw new Exception("Số điện thoại đã được sử dụng");
        }
        User newUser = new User();
        newUser.setPhoneNumber(registerRequest.getPhoneNumber());
        newUser.setFullName(registerRequest.getFullName());
        newUser.setActive(true);

        System.out.println("Creating user with phone: " + registerRequest.getPhoneNumber()); // Gán role mặc định là
        // USER
        Role defaultRole = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));

        List<Role> roles = new ArrayList<>();
        roles.add(defaultRole);
        newUser.setListRoles(roles);

        System.out.println("Assigned role: " + defaultRole.getRoleName());

        User savedUser = userRepository.save(newUser);
        System.out.println("Saved user with ID: " + savedUser.getUserId());

        Cart cart = new Cart();
        cart.setUser(savedUser);
        cart.setListCartDetails(new ArrayList<>());
        Cart savedCart = cartRepository.save(cart);
        System.out.println("Created cart with ID: " + savedCart.getCartId());

        savedUser.setCart(savedCart);

        if (registerRequest.getAddressRequest() != null) {
            System.out.println("Creating address...");
            Address address = addressService.createAddress(registerRequest.getAddressRequest(), savedUser);
            if (savedUser.getBaseAddresses() == null) {
                savedUser.setBaseAddresses(new ArrayList<>());
            }
            savedUser.getBaseAddresses().add(address);
            System.out.println("Created address with ID: " + address.getAddressId());
        }
        User finalUser = userRepository.save(savedUser);
        System.out.println("Registration completed successfully for user ID: " + finalUser.getUserId());
        return "Đăng ký thành công với số điện thoại: " + finalUser.getPhoneNumber();
    }

    public UserResponse getUserInfor(UserDetails userDetails) {
        Integer userId = Integer.parseInt(userDetails.getUsername());
        return userRepository.findByUserId(userId)
                .map(UserService::convertToUserResponse)
                .orElse(null);
    }

    // get all users (for admin)

    public List<UserResponse> getAllUser() {
        List<User> users = userRepository.findAll();
        return convertToUserResponseList(users);
    }

    /**
     * Update user information
     */
    public UserResponse updateUser(UserDetails userDetails, UserRequest userRequest) {
        Integer userId = Integer.parseInt(userDetails.getUsername());

        return userRepository.findByUserId(userId)
                .map(user -> {
                    // Update user fields
                    user.setPhoneNumber(userRequest.getPhoneNumber());
                    user.setFullName(userRequest.getFullName());

                    User updatedUser = userRepository.save(user);
                    return convertToUserResponse(updatedUser);
                })
                .orElse(null);
    }

    /**
     * Add new address for user
     */
    public AddressResponse addAddress(UserDetails userDetails, AddressRequest addressRequest) {
        Integer userId = Integer.parseInt(userDetails.getUsername());

        return userRepository.findByUserId(userId)
                .map(user -> {
                    Address address = addressService.createAddress(addressRequest, user);
                    return convertToAddressResponse(address);
                }).orElseThrow(() -> new RuntimeException("User not found"));

    }

    /**
     * Delete address by id
     */
    public String deleteAddress(UserDetails userDetails, Integer addressId) {
        Integer userId = Integer.parseInt(userDetails.getUsername());

        // Verify user exists
        if (!userRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        boolean isDeleted = addressService.deleteAddress(addressId, userId);
        return isDeleted ? "Xóa địa chỉ thành công" : "Không tìm thấy địa chỉ hoặc không có quyền xóa";
    }

    /**
     * Update address
     */
    public AddressResponse updateAddress(UserDetails userDetails, Integer addressId, AddressRequest addressRequest) {
        Integer userId = Integer.parseInt(userDetails.getUsername());

        // Verify user exists
        if (!userRepository.findByUserId(userId).isPresent()) {
            return null;
        }

        Address updatedAddress = addressService.updateAddress(addressId, addressRequest, userId);
        return updatedAddress != null ? convertToAddressResponse(updatedAddress) : null;
    }

    /**
     * Get all addresses for user
     */
    public List<AddressResponse> getAllAddress(UserDetails userDetails) {
        Integer userId = Integer.parseInt(userDetails.getUsername());

        return userRepository.findByUserId(userId)
                .map(user -> {
                    List<Address> addresses = addressService.getAllAddressByUserId(userId);
                    return convertToAddressResponseList(addresses);
                })
                .orElse(null);
    }

    public static UserResponse convertToUserResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setActive(user.isActive());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setFullName(user.getFullName());
        if (user.getBaseAddresses() != null) {
            List<AddressResponse> addressResponses = user.getBaseAddresses().stream()
                    .map(UserService::convertToAddressResponse)
                    .collect(Collectors.toList());
            response.setListAddress(addressResponses);
        }

        return response;
    }

    /**
     * Convert Address entity to AddressResponse DTO
     */
    public static AddressResponse convertToAddressResponse(Address address) {
        if (address == null) {
            return null;
        }

        AddressResponse response = new AddressResponse();
        response.setAddressId(address.getAddressId());
        response.setAddressName(address.getStreetName());
        response.setDistrictName(address.getDistrictName());
        response.setProvinceName(address.getProvinceName());
        response.setWardName(address.getWardName());
        return response;
    }

    /**
     * Convert list of Address entities to list of AddressResponse DTOs
     */
    public static List<AddressResponse> convertToAddressResponseList(List<Address> addresses) {
        if (addresses == null) {
            return null;
        }
        return addresses.stream()
                .map(UserService::convertToAddressResponse)
                .collect(Collectors.toList());
    }

    // Convert list of User entities to list of UserResponse DTOs
    public static List<UserResponse> convertToUserResponseList(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(UserService::convertToUserResponse)
                .collect(Collectors.toList());
    }
}
