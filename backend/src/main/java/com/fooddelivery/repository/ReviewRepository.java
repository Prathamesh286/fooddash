package com.fooddelivery.repository;

import com.fooddelivery.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<Review> findByCustomerId(Long customerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Double getAverageRatingByRestaurantId(Long restaurantId);
}
