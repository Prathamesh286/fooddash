package com.fooddelivery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

public class MenuItemDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String name;
        private String description;

        @Positive
        private double price;

        private String imageUrl;
        private String category;
        private boolean vegetarian;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private double price;
        private String imageUrl;
        private String category;
        private boolean vegetarian;
        private boolean available;
        private Long restaurantId;
    }
}
