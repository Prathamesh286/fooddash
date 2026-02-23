package com.fooddelivery.service;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.entity.*;
import com.fooddelivery.enums.OrderStatus;
import com.fooddelivery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderDto.Response placeOrder(OrderDto.CreateRequest request, User customer) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Order order = Order.builder()
                .customer(customer)
                .restaurant(restaurant)
                .deliveryAddress(request.getDeliveryAddress())
                .paymentMethod(request.getPaymentMethod())
                .specialInstructions(request.getSpecialInstructions())
                .deliveryFee(restaurant.getDeliveryFee())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0;

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            double itemSubtotal = menuItem.getPrice() * itemReq.getQuantity();
            subtotal += itemSubtotal;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .price(menuItem.getPrice())
                    .subtotal(itemSubtotal)
                    .build();

            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        order.setSubtotal(subtotal);
        order.setTotalAmount(subtotal + restaurant.getDeliveryFee());

        return toResponse(orderRepository.save(order));
    }

    public List<OrderDto.Response> getMyOrders(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderDto.Response> getRestaurantOrders(Long restaurantId, Long ownerId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderDto.Response> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderDto.Response> getAgentOrders(Long agentId) {
        return orderRepository.findByDeliveryAgentIdOrderByCreatedAtDesc(agentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderDto.Response updateOrderStatus(Long orderId, String status, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.valueOf(status));

        if (status.equals("OUT_FOR_DELIVERY")) {
            User agent = userRepository.findById(userId).orElse(null);
            order.setDeliveryAgent(agent);
        }

        return toResponse(orderRepository.save(order));
    }

    public OrderDto.Response cancelOrder(Long orderId, Long customerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cannot cancel order in " + order.getStatus() + " state");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return toResponse(orderRepository.save(order));
    }

    public OrderDto.Response getOrderById(Long orderId) {
        return toResponse(orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found")));
    }

    private OrderDto.Response toResponse(Order order) {
        OrderDto.Response res = new OrderDto.Response();
        res.setId(order.getId());
        res.setCustomerId(order.getCustomer().getId());
        res.setCustomerName(order.getCustomer().getName());
        res.setRestaurantId(order.getRestaurant().getId());
        res.setRestaurantName(order.getRestaurant().getName());
        res.setStatus(order.getStatus());
        res.setDeliveryAddress(order.getDeliveryAddress());
        res.setSubtotal(order.getSubtotal());
        res.setDeliveryFee(order.getDeliveryFee());
        res.setTotalAmount(order.getTotalAmount());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setPaymentDone(order.isPaymentDone());
        res.setSpecialInstructions(order.getSpecialInstructions());
        res.setCreatedAt(order.getCreatedAt());
        res.setUpdatedAt(order.getUpdatedAt());

        if (order.getOrderItems() != null) {
            List<OrderDto.OrderItemResponse> items = order.getOrderItems().stream().map(oi -> {
                OrderDto.OrderItemResponse ir = new OrderDto.OrderItemResponse();
                ir.setId(oi.getId());
                ir.setMenuItemId(oi.getMenuItem().getId());
                ir.setMenuItemName(oi.getMenuItem().getName());
                ir.setQuantity(oi.getQuantity());
                ir.setPrice(oi.getPrice());
                ir.setSubtotal(oi.getSubtotal());
                return ir;
            }).collect(Collectors.toList());
            res.setOrderItems(items);
        }

        return res;
    }
}
