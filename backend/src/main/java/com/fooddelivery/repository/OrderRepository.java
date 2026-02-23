package com.fooddelivery.repository;

import com.fooddelivery.entity.Order;
import com.fooddelivery.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    List<Order> findByDeliveryAgentIdOrderByCreatedAtDesc(Long agentId);
    List<Order> findByRestaurantIdAndStatus(Long restaurantId, OrderStatus status);
}
