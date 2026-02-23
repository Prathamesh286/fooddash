package com.fooddelivery.service;

import com.fooddelivery.dto.ReviewDto;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.Review;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    public ReviewDto.Response addReview(ReviewDto.CreateRequest request, User customer) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Review review = Review.builder()
                .customer(customer)
                .restaurant(restaurant)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        // Update restaurant rating
        Double avgRating = reviewRepository.getAverageRatingByRestaurantId(restaurant.getId());
        int count = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId()).size();
        restaurant.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0);
        restaurant.setReviewCount(count);
        restaurantRepository.save(restaurant);

        return toResponse(saved);
    }

    public List<ReviewDto.Response> getRestaurantReviews(Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ReviewDto.Response toResponse(Review review) {
        ReviewDto.Response res = new ReviewDto.Response();
        res.setId(review.getId());
        res.setCustomerId(review.getCustomer().getId());
        res.setCustomerName(review.getCustomer().getName());
        res.setRestaurantId(review.getRestaurant().getId());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}
