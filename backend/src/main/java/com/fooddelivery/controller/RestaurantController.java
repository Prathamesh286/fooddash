package com.fooddelivery.controller;

import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.entity.User;
import com.fooddelivery.service.AuthService;
import com.fooddelivery.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<RestaurantDto.Response>> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(restaurantService.searchRestaurants(search));
        }
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<RestaurantDto.Response>> getMyRestaurants(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(restaurantService.getMyRestaurants(user.getId()));
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantDto.Response> create(@RequestBody RestaurantDto.CreateRequest request,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(restaurantService.createRestaurant(request, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantDto.Response> update(@PathVariable Long id,
                                                         @RequestBody RestaurantDto.CreateRequest request,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, request, user.getId()));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> toggleStatus(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        restaurantService.toggleRestaurantStatus(id, user.getId());
        return ResponseEntity.ok().build();
    }
}
