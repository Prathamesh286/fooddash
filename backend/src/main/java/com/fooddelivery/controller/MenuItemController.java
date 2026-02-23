package com.fooddelivery.controller;

import com.fooddelivery.dto.MenuItemDto;
import com.fooddelivery.entity.User;
import com.fooddelivery.service.AuthService;
import com.fooddelivery.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;
    private final AuthService authService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItemDto.Response>> getMenuByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuItemService.getMenuByRestaurant(restaurantId));
    }

    @PostMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto.Response> addMenuItem(@PathVariable Long restaurantId,
                                                            @RequestBody MenuItemDto.CreateRequest request,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(menuItemService.addMenuItem(restaurantId, request, user.getId()));
    }

    @PutMapping("/{itemId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto.Response> updateMenuItem(@PathVariable Long itemId,
                                                               @RequestBody MenuItemDto.CreateRequest request,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(menuItemService.updateMenuItem(itemId, request, user.getId()));
    }

    @PatchMapping("/{itemId}/toggle")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> toggleAvailability(@PathVariable Long itemId,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        menuItemService.toggleAvailability(itemId, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long itemId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        menuItemService.deleteMenuItem(itemId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
