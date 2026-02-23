package com.fooddelivery.repository;

import com.fooddelivery.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwnerId(Long ownerId);
    List<Restaurant> findByOpenTrue();
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);

    @Query("SELECT r FROM Restaurant r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Restaurant> searchRestaurants(String query);
}
