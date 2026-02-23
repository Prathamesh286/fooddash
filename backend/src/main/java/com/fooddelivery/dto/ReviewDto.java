package com.fooddelivery.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDateTime;

public class ReviewDto {

    @Data
    public static class CreateRequest {
        private Long restaurantId;

        @Min(1) @Max(5)
        private int rating;

        private String comment;
    }

    @Data
    public static class Response {
        private Long id;
        private Long customerId;
        private String customerName;
        private Long restaurantId;
        private int rating;
        private String comment;
        private LocalDateTime createdAt;
    }
}
