package com.fooddelivery.service;

import com.fooddelivery.dto.MenuItemDto;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public List<MenuItemDto.Response> getMenuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MenuItemDto.Response addMenuItem(Long restaurantId, MenuItemDto.CreateRequest request, Long ownerId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .vegetarian(request.isVegetarian())
                .restaurant(restaurant)
                .build();

        return toResponse(menuItemRepository.save(item));
    }

    public MenuItemDto.Response updateMenuItem(Long itemId, MenuItemDto.CreateRequest request, Long ownerId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!item.getRestaurant().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setCategory(request.getCategory());
        item.setVegetarian(request.isVegetarian());

        return toResponse(menuItemRepository.save(item));
    }

    public void toggleAvailability(Long itemId, Long ownerId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!item.getRestaurant().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        item.setAvailable(!item.isAvailable());
        menuItemRepository.save(item);
    }

    public void deleteMenuItem(Long itemId, Long ownerId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!item.getRestaurant().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        menuItemRepository.delete(item);
    }

    public MenuItemDto.Response toResponse(MenuItem item) {
        MenuItemDto.Response res = new MenuItemDto.Response();
        res.setId(item.getId());
        res.setName(item.getName());
        res.setDescription(item.getDescription());
        res.setPrice(item.getPrice());
        res.setImageUrl(item.getImageUrl());
        res.setCategory(item.getCategory());
        res.setVegetarian(item.isVegetarian());
        res.setAvailable(item.isAvailable());
        res.setRestaurantId(item.getRestaurant().getId());
        return res;
    }
}
