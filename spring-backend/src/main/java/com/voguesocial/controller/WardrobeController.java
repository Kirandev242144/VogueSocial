package com.voguesocial.controller;

import com.voguesocial.model.*;
import com.voguesocial.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/wardrobe")
@CrossOrigin(origins = "*")
public class WardrobeController {

    @Autowired
    private WardrobeItemRepository itemRepository;

    @Autowired
    private WardrobeOutfitRepository outfitRepository;

    @Autowired
    private WardrobeScheduleRepository scheduleRepository;

    @Autowired
    private WardrobeTripPlanRepository tripPlanRepository;

    // ==========================================
    // 1. WARDROBE ITEMS (CLOTHES)
    // ==========================================

    @GetMapping("/items")
    public ResponseEntity<List<WardrobeItem>> getWardrobeItems(
            @RequestParam(defaultValue = "usr_sarah_01") String userId,
            @RequestParam(required = false) String category) {

        List<WardrobeItem> items;
        if (category != null && !category.equalsIgnoreCase("all")) {
            items = itemRepository.findByUserIdAndCategoryOrderByCreatedAtDesc(userId, category.toLowerCase());
        } else {
            items = itemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<WardrobeItem> addWardrobeItem(@RequestBody WardrobeItem item) {
        if (item.getId() == null || item.getId().trim().isEmpty()) {
            item.setId("wrd_item_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 5));
        }
        if (item.getCreatedAt() == null) {
            item.setCreatedAt(LocalDateTime.now());
        }
        if (item.getWearCount() == null) {
            item.setWearCount(0);
        }
        if (item.getBrand() == null || item.getBrand().trim().isEmpty()) {
            item.setBrand("Custom");
        }
        if (item.getCategory() != null) {
            item.setCategory(item.getCategory().toLowerCase());
        }
        WardrobeItem saved = itemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Map<String, Object>> deleteWardrobeItem(@PathVariable String id) {
        itemRepository.deleteById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("deletedId", id);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/items/{id}/wear")
    public ResponseEntity<WardrobeItem> incrementWearCount(@PathVariable String id) {
        Optional<WardrobeItem> opt = itemRepository.findById(id);
        if (opt.isPresent()) {
            WardrobeItem item = opt.get();
            item.setWearCount(item.getWearCount() == null ? 1 : item.getWearCount() + 1);
            WardrobeItem updated = itemRepository.save(item);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // 2. SAVED OUTFITS
    // ==========================================

    @GetMapping("/outfits")
    public ResponseEntity<List<WardrobeOutfit>> getOutfits(@RequestParam(defaultValue = "usr_sarah_01") String userId) {
        List<WardrobeOutfit> outfits = outfitRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(outfits);
    }

    @PostMapping("/outfits")
    public ResponseEntity<WardrobeOutfit> saveOutfit(@RequestBody WardrobeOutfit outfit) {
        if (outfit.getId() == null || outfit.getId().trim().isEmpty()) {
            outfit.setId("wrd_outfit_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 5));
        }
        if (outfit.getCreatedAt() == null) {
            outfit.setCreatedAt(LocalDateTime.now());
        }
        WardrobeOutfit saved = outfitRepository.save(outfit);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/outfits/{id}")
    public ResponseEntity<Map<String, Object>> deleteOutfit(@PathVariable String id) {
        outfitRepository.deleteById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("deletedId", id);
        return ResponseEntity.ok(res);
    }

    // ==========================================
    // 3. CALENDAR & SCHEDULES
    // ==========================================

    @GetMapping("/schedule")
    public ResponseEntity<List<WardrobeSchedule>> getSchedules(@RequestParam(defaultValue = "usr_sarah_01") String userId) {
        List<WardrobeSchedule> list = scheduleRepository.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/schedule")
    public ResponseEntity<WardrobeSchedule> scheduleOutfit(@RequestBody WardrobeSchedule req) {
        if (req.getId() == null || req.getId().trim().isEmpty()) {
            req.setId("wrd_sch_" + System.currentTimeMillis());
        }
        if (req.getCreatedAt() == null) {
            req.setCreatedAt(LocalDateTime.now());
        }
        // Remove existing schedule for that date if any
        scheduleRepository.deleteByUserIdAndDateStr(req.getUserId(), req.getDateStr());
        WardrobeSchedule saved = scheduleRepository.save(req);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/schedule")
    public ResponseEntity<Map<String, Object>> unscheduleOutfit(
            @RequestParam String userId,
            @RequestParam String dateStr) {
        scheduleRepository.deleteByUserIdAndDateStr(userId, dateStr);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("dateStr", dateStr);
        return ResponseEntity.ok(res);
    }

    // ==========================================
    // 4. TRIP PACKING PLANNER
    // ==========================================

    @GetMapping("/trips")
    public ResponseEntity<List<WardrobeTripPlan>> getTrips(@RequestParam(defaultValue = "usr_sarah_01") String userId) {
        List<WardrobeTripPlan> trips = tripPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(trips);
    }

    @PostMapping("/trips")
    public ResponseEntity<WardrobeTripPlan> saveTrip(@RequestBody WardrobeTripPlan trip) {
        if (trip.getId() == null || trip.getId().trim().isEmpty()) {
            trip.setId("wrd_trip_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 5));
        }
        if (trip.getCreatedAt() == null) {
            trip.setCreatedAt(LocalDateTime.now());
        }
        WardrobeTripPlan saved = tripPlanRepository.save(trip);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/trips/{id}")
    public ResponseEntity<Map<String, Object>> deleteTrip(@PathVariable String id) {
        tripPlanRepository.deleteById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("deletedId", id);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/debug-all")
    public ResponseEntity<Map<String, Object>> debugAll() {
        Map<String, Object> map = new HashMap<>();
        map.put("items", itemRepository.findAll());
        map.put("outfits", outfitRepository.findAll());
        map.put("schedules", scheduleRepository.findAll());
        map.put("trips", tripPlanRepository.findAll());
        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<Map<String, Object>> clearAll() {
        long itemsCount = itemRepository.count();
        itemRepository.deleteAll();
        long outfitsCount = outfitRepository.count();
        outfitRepository.deleteAll();
        long schedulesCount = scheduleRepository.count();
        scheduleRepository.deleteAll();
        long tripsCount = tripPlanRepository.count();
        tripPlanRepository.deleteAll();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("deletedItems", itemsCount);
        res.put("deletedOutfits", outfitsCount);
        res.put("deletedSchedules", schedulesCount);
        res.put("deletedTrips", tripsCount);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, Object>> clearWardrobe(@RequestParam String userId) {
        List<WardrobeItem> userItems = itemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        itemRepository.deleteAll(userItems);
        List<WardrobeOutfit> userOutfits = outfitRepository.findByUserIdOrderByCreatedAtDesc(userId);
        outfitRepository.deleteAll(userOutfits);
        List<WardrobeSchedule> userSchedules = scheduleRepository.findByUserId(userId);
        scheduleRepository.deleteAll(userSchedules);
        List<WardrobeTripPlan> userTrips = tripPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
        tripPlanRepository.deleteAll(userTrips);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("clearedUserId", userId);
        return ResponseEntity.ok(res);
    }
}
