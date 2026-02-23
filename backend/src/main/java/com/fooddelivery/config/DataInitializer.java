package com.fooddelivery.config;

import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.enums.Role;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Create admin
        User admin = userRepository.save(User.builder()
                .name("Admin")
                .email("admin@food.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .phone("9999999999")
                .build());

        // Create customer
        User customer = userRepository.save(User.builder()
                .name("John Doe")
                .email("customer@food.com")
                .password(passwordEncoder.encode("customer123"))
                .role(Role.CUSTOMER)
                .phone("8888888888")
                .address("123 Main St, City")
                .build());

        // Create restaurant owner
        User owner = userRepository.save(User.builder()
                .name("Restaurant Owner")
                .email("owner@food.com")
                .password(passwordEncoder.encode("owner123"))
                .role(Role.RESTAURANT_OWNER)
                .phone("7777777777")
                .build());

        // Create delivery agent
        userRepository.save(User.builder()
                .name("Delivery Agent")
                .email("agent@food.com")
                .password(passwordEncoder.encode("agent123"))
                .role(Role.DELIVERY_AGENT)
                .phone("6666666666")
                .build());

        // Create restaurants
        Restaurant r1 = restaurantRepository.save(Restaurant.builder()
                .name("Spice Garden")
                .description("Authentic Indian cuisine with rich flavors and traditional recipes")
                .address("42 Curry Lane, Mumbai")
                .phone("022-12345678")
                .imageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800")
                .cuisine("Indian")
                .openingHours("10:00 AM - 10:00 PM")
                .rating(4.5)
                .reviewCount(120)
                .deliveryTime(35)
                .deliveryFee(25.0)
                .minOrderAmount(150.0)
                .owner(owner)
                .build());

        Restaurant r2 = restaurantRepository.save(Restaurant.builder()
                .name("Pizza Paradise")
                .description("Wood-fired pizzas with fresh ingredients imported from Italy")
                .address("88 Napoli Road, Pune")
                .phone("020-87654321")
                .imageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800")
                .cuisine("Italian")
                .openingHours("11:00 AM - 11:00 PM")
                .rating(4.3)
                .reviewCount(89)
                .deliveryTime(25)
                .deliveryFee(30.0)
                .minOrderAmount(200.0)
                .owner(owner)
                .build());

        Restaurant r3 = restaurantRepository.save(Restaurant.builder()
                .name("Dragon Wok")
                .description("Authentic Chinese and Asian fusion dishes")
                .address("55 Dragon Street, Delhi")
                .phone("011-11223344")
                .imageUrl("https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800")
                .cuisine("Chinese")
                .openingHours("12:00 PM - 11:00 PM")
                .rating(4.1)
                .reviewCount(67)
                .deliveryTime(40)
                .deliveryFee(20.0)
                .minOrderAmount(120.0)
                .owner(owner)
                .build());

        Restaurant r4 = restaurantRepository.save(Restaurant.builder()
                .name("Burger Barn")
                .description("Juicy gourmet burgers with handmade patties")
                .address("12 Fast Food Ave, Bangalore")
                .phone("080-55667788")
                .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800")
                .cuisine("American")
                .openingHours("10:00 AM - 12:00 AM")
                .rating(4.6)
                .reviewCount(200)
                .deliveryTime(20)
                .deliveryFee(15.0)
                .minOrderAmount(100.0)
                .owner(owner)
                .build());

        // Menu items for Spice Garden
        menuItemRepository.save(MenuItem.builder().name("Butter Chicken").description("Creamy tomato curry with tender chicken").price(280).imageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400").category("Main Course").vegetarian(false).restaurant(r1).build());
        menuItemRepository.save(MenuItem.builder().name("Paneer Tikka Masala").description("Cottage cheese in rich spiced gravy").price(250).imageUrl("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400").category("Main Course").vegetarian(true).restaurant(r1).build());
        menuItemRepository.save(MenuItem.builder().name("Garlic Naan").description("Soft bread baked in tandoor with garlic").price(60).imageUrl("https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400").category("Bread").vegetarian(true).restaurant(r1).build());
        menuItemRepository.save(MenuItem.builder().name("Dal Makhani").description("Slow cooked black lentils in butter").price(200).imageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400").category("Main Course").vegetarian(true).restaurant(r1).build());
        menuItemRepository.save(MenuItem.builder().name("Chicken Biryani").description("Fragrant basmati rice with spiced chicken").price(320).imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400").category("Rice").vegetarian(false).restaurant(r1).build());

        // Menu items for Pizza Paradise
        menuItemRepository.save(MenuItem.builder().name("Margherita Pizza").description("Classic tomato, mozzarella, fresh basil").price(350).imageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400").category("Pizza").vegetarian(true).restaurant(r2).build());
        menuItemRepository.save(MenuItem.builder().name("Pepperoni Pizza").description("Loaded with spicy pepperoni slices").price(420).imageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400").category("Pizza").vegetarian(false).restaurant(r2).build());
        menuItemRepository.save(MenuItem.builder().name("Pasta Carbonara").description("Creamy pasta with bacon and egg").price(300).imageUrl("https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400").category("Pasta").vegetarian(false).restaurant(r2).build());
        menuItemRepository.save(MenuItem.builder().name("Tiramisu").description("Classic Italian dessert with coffee").price(180).imageUrl("https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400").category("Dessert").vegetarian(true).restaurant(r2).build());

        // Menu items for Dragon Wok
        menuItemRepository.save(MenuItem.builder().name("Chicken Fried Rice").description("Wok-tossed rice with vegetables and chicken").price(220).imageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400").category("Rice").vegetarian(false).restaurant(r3).build());
        menuItemRepository.save(MenuItem.builder().name("Kung Pao Chicken").description("Spicy stir-fry with peanuts and chilies").price(280).imageUrl("https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400").category("Main Course").vegetarian(false).restaurant(r3).build());
        menuItemRepository.save(MenuItem.builder().name("Spring Rolls").description("Crispy rolls with vegetable filling").price(150).imageUrl("https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=400").category("Starter").vegetarian(true).restaurant(r3).build());
        menuItemRepository.save(MenuItem.builder().name("Hakka Noodles").description("Stir fried noodles with veggies").price(200).imageUrl("https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400").category("Noodles").vegetarian(true).restaurant(r3).build());

        // Menu items for Burger Barn
        menuItemRepository.save(MenuItem.builder().name("Classic Cheeseburger").description("Beef patty with cheddar, lettuce, tomato").price(280).imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400").category("Burger").vegetarian(false).restaurant(r4).build());
        menuItemRepository.save(MenuItem.builder().name("Veggie Burger").description("Plant-based patty with fresh veggies").price(240).imageUrl("https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400").category("Burger").vegetarian(true).restaurant(r4).build());
        menuItemRepository.save(MenuItem.builder().name("Crispy Fries").description("Golden fries with seasoning").price(120).imageUrl("https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400").category("Sides").vegetarian(true).restaurant(r4).build());
        menuItemRepository.save(MenuItem.builder().name("Milkshake").description("Thick creamy shakes in 3 flavors").price(150).imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400").category("Beverages").vegetarian(true).restaurant(r4).build());

        System.out.println("✅ Sample data initialized!");
        System.out.println("👤 Customer: customer@food.com / customer123");
        System.out.println("🏪 Owner:    owner@food.com / owner123");
        System.out.println("🚴 Agent:    agent@food.com / agent123");
        System.out.println("🔑 Admin:    admin@food.com / admin123");
    }
}
