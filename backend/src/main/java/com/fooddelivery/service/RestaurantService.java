package com.fooddelivery.service;

import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<RestaurantDto.Response> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto.Response> getOpenRestaurants() {
        return restaurantRepository.findByOpenTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RestaurantDto.Response getRestaurantById(Long id) {
        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return toResponse(r);
    }

    public List<RestaurantDto.Response> searchRestaurants(String query) {
        return restaurantRepository.searchRestaurants(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto.Response> getMyRestaurants(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RestaurantDto.Response createRestaurant(RestaurantDto.CreateRequest request, User owner) {
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .cuisine(request.getCuisine())
                .openingHours(request.getOpeningHours())
                .deliveryTime(request.getDeliveryTime())
                .deliveryFee(request.getDeliveryFee())
                .minOrderAmount(request.getMinOrderAmount())
                .owner(owner)
                .build();

        return toResponse(restaurantRepository.save(restaurant));
    }

    public RestaurantDto.Response updateRestaurant(Long id, RestaurantDto.CreateRequest request, Long ownerId) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setOpeningHours(request.getOpeningHours());
        restaurant.setDeliveryTime(request.getDeliveryTime());
        restaurant.setDeliveryFee(request.getDeliveryFee());
        restaurant.setMinOrderAmount(request.getMinOrderAmount());

        return toResponse(restaurantRepository.save(restaurant));
    }

    public void toggleRestaurantStatus(Long id, Long ownerId) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        restaurant.setOpen(!restaurant.isOpen());
        restaurantRepository.save(restaurant);
    }

    public RestaurantDto.Response toResponse(Restaurant r) {
        RestaurantDto.Response res = new RestaurantDto.Response();
        res.setId(r.getId());
        res.setName(r.getName());
        res.setDescription(r.getDescription());
        res.setAddress(r.getAddress());
        res.setPhone(r.getPhone());
        res.setImageUrl(r.getImageUrl());
        res.setCuisine(r.getCuisine());
        res.setOpeningHours(r.getOpeningHours());
        res.setRating(r.getRating());
        res.setReviewCount(r.getReviewCount());
        res.setDeliveryTime(r.getDeliveryTime());
        res.setDeliveryFee(r.getDeliveryFee());
        res.setMinOrderAmount(r.getMinOrderAmount());
        res.setOpen(r.isOpen());
        if (r.getOwner() != null) res.setOwnerId(r.getOwner().getId());
        return res;
    }
}
