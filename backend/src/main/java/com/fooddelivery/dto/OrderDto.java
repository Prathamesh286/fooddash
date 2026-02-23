package com.fooddelivery.dto;

import com.fooddelivery.enums.OrderStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    public static class OrderItemRequest {
        private Long menuItemId;
        private int quantity;
    }

    @Data
    public static class CreateRequest {
        private Long restaurantId;

        @NotEmpty
        private List<OrderItemRequest> items;

        @NotBlank
        private String deliveryAddress;

        private String paymentMethod = "CASH";
        private String specialInstructions;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long menuItemId;
        private String menuItemName;
        private int quantity;
        private double price;
        private double subtotal;
    }

    @Data
    public static class Response {
        private Long id;
        private Long customerId;
        private String customerName;
        private Long restaurantId;
        private String restaurantName;
        private List<OrderItemResponse> orderItems;
        private OrderStatus status;
        private String deliveryAddress;
        private double subtotal;
        private double deliveryFee;
        private double totalAmount;
        private String paymentMethod;
        private boolean paymentDone;
        private String specialInstructions;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
