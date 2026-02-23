package com.fooddelivery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class RestaurantDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String name;
        private String description;
        private String address;
        private String phone;
        private String imageUrl;
        private String cuisine;
        private String openingHours;
        private int deliveryTime = 30;
        private double deliveryFee = 30.0;
        private double minOrderAmount = 100.0;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String address;
        private String phone;
        private String imageUrl;
        private String cuisine;
        private String openingHours;
        private double rating;
        private int reviewCount;
        private int deliveryTime;
        private double deliveryFee;
        private double minOrderAmount;
        private boolean open;
        private Long ownerId;
    }
}
