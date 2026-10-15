package com.hieuvolaptrinh.Heatly_Store.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.hieuvolaptrinh.Heatly_Store.Request.AddressRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.UserRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.Notification;
import com.hieuvolaptrinh.Heatly_Store.Response.UserResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.UserResponse.AddressResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.UserService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // của user
    @GetMapping("")
    public ResponseEntity<UserResponse> getInfor(@AuthenticationPrincipal UserDetails userDetails) {

        UserResponse userResponse = userService.getUserInfor(userDetails);
        if (userResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<UserResponse>> getAllUser() {
        List<UserResponse> listUser = this.userService.getAllUser();
        return ResponseEntity.ok(listUser);
    }

    // update user
    @PutMapping("")
    public ResponseEntity<UserResponse> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserRequest userRequest) {

        UserResponse updatedUser = userService.updateUser(userDetails, userRequest);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    } // add address

    @PostMapping("/address")
    public ResponseEntity<AddressResponse> postMethodName(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddressRequest addressRequest) {
        AddressResponse addressResponse = userService.addAddress(userDetails, addressRequest);
        return ResponseEntity.ok(addressResponse);
    } // delete address

    @DeleteMapping("/address/{addressId}")
    public ResponseEntity<Notification> deleteAddress(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer addressId) {
        String result = userService.deleteAddress(userDetails, addressId);
        return ResponseEntity.ok(new Notification(result));
    }

    // update address
    @PutMapping("/address/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer addressId,
            @RequestBody AddressRequest addressRequest) {
        AddressResponse updatedAddress = userService.updateAddress(userDetails, addressId, addressRequest);
        if (updatedAddress == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedAddress);
    }

    // get all address
    @GetMapping("/address")
    public ResponseEntity<List<AddressResponse>> getAllAddress(@AuthenticationPrincipal UserDetails userDetails) {
        List<AddressResponse> listAddress = userService.getAllAddress(userDetails);
        if (listAddress == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(listAddress);
    }
}
