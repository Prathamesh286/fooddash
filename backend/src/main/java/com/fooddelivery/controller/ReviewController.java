package com.fooddelivery.controller;

import com.fooddelivery.dto.ReviewDto;
import com.fooddelivery.entity.User;
import com.fooddelivery.service.AuthService;
import com.fooddelivery.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewDto.Response> addReview(@RequestBody ReviewDto.CreateRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(reviewService.addReview(request, user));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ReviewDto.Response>> getRestaurantReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewService.getRestaurantReviews(restaurantId));
    }
}
