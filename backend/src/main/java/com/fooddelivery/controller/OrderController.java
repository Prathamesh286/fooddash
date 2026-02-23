package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.entity.User;
import com.fooddelivery.service.AuthService;
import com.fooddelivery.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDto.Response> placeOrder(@Valid @RequestBody OrderDto.CreateRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(orderService.placeOrder(request, user));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderDto.Response>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getMyOrders(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto.Response> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto.Response>> getRestaurantOrders(@PathVariable Long restaurantId,
                                                                       @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getRestaurantOrders(restaurantId, user.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto.Response>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/agent")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<List<OrderDto.Response>> getAgentOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getAgentOrders(user.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN') or hasRole('DELIVERY_AGENT')")
    public ResponseEntity<OrderDto.Response> updateStatus(@PathVariable Long id,
                                                          @RequestParam String status,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, user.getId()));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDto.Response> cancelOrder(@PathVariable Long id,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(orderService.cancelOrder(id, user.getId()));
    }
}
