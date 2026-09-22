'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import TryOnModal from '@/components/TryOnModal';
import { useAuth } from '@/context/AuthContext';

// Modular Wardrobe Components
import WardrobeHeader from '@/components/wardrobe/WardrobeHeader';
import WardrobeTabs from '@/components/wardrobe/WardrobeTabs';
import SubtleAiStylistBar from '@/components/wardrobe/SubtleAiStylistBar';
import ClothesTab from '@/components/wardrobe/ClothesTab';
import OutfitsTab from '@/components/wardrobe/OutfitsTab';
import CalendarTab from '@/components/wardrobe/CalendarTab';
import TripPlannerTab from '@/components/wardrobe/TripPlannerTab';
import AddGarmentModal from '@/components/wardrobe/AddGarmentModal';
import MixMatchStylingModal from '@/components/wardrobe/MixMatchStylingModal';
import CreateTripModal from '@/components/wardrobe/CreateTripModal';
import PackClothesModal from '@/components/wardrobe/PackClothesModal';

import styles from './wardrobe.module.css';

export default function WardrobePage() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_sarah_01';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('clothes');

  // Backend Data (Starts completely empty)
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterSeason, setFilterSeason] = useState('all');
  const [filterOccasion, setFilterOccasion] = useState('all');
  const [filterColor, setFilterColor] = useState('all');

  // Modals Visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStylingModalOpen, setIsStylingModalOpen] = useState(false);
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [selectedTripForPacking, setSelectedTripForPacking] = useState(null);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [selectedTryOnItem, setSelectedTryOnItem] = useState(null);

  // Calendar State (14 upcoming days)
  const calendarDates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      list.push({ dateStr, dayName, dayNum, fullDate: d });
    }
    return list;
  }, []);
  const [selectedDateStr, setSelectedDateStr] = useState(calendarDates[0]?.dateStr || '');

  // 1. Fetch Wardrobe Data from Spring Boot Backend
  const fetchWardrobeData = async () => {
    setIsLoading(true);
    try {
      const [resItems, resOutfits, resSchedule, resTrips] = await Promise.all([
        fetch(`http://localhost:8085/api/wardrobe/items?userId=${userId}`),
        fetch(`http://localhost:8085/api/wardrobe/outfits?userId=${userId}`),
        fetch(`http://localhost:8085/api/wardrobe/schedule?userId=${userId}`),
        fetch(`http://localhost:8085/api/wardrobe/trips?userId=${userId}`)
      ]);

      if (resItems.ok) setItems(await resItems.json());
      if (resOutfits.ok) setOutfits(await resOutfits.json());
      if (resSchedule.ok) setSchedules(await resSchedule.json());
      if (resTrips.ok) setTrips(await resTrips.json());
    } catch (err) {
      console.error('Error fetching wardrobe data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobeData();
  }, [userId]);

  // 2. Wear Count Increment
  const handleWearItem = async (itemId, e) => {
    if (e) e.stopPropagation();
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, wearCount: (item.wearCount || 0) + 1 } : item))
    );
    try {
      await fetch(`http://localhost:8085/api/wardrobe/items/${itemId}/wear`, { method: 'POST' });
    } catch (err) {
      console.error('Error incrementing wear count:', err);
    }
  };

  // 3. Delete Garment
  const handleDeleteItem = async (itemId, itemName, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove "${itemName}" from your wardrobe?`)) return;
    setItems(prev => prev.filter(i => i.id !== itemId));
    try {
      await fetch(`http://localhost:8085/api/wardrobe/items/${itemId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // 4. Save New Garment to MySQL
  const handleSaveGarment = async (garmentData) => {
    const newItem = {
      userId,
      ...garmentData,
      wearCount: 0
    };

    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const saved = await res.json();
        setItems(prev => [saved, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving garment:', err);
    }
  };

  // 5. Save Mix & Match Outfit
  const handleSaveOutfit = async (outfitData) => {
    const outfitPayload = {
      userId,
      ...outfitData
    };

    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outfitPayload)
      });
      if (res.ok) {
        const saved = await res.json();
        setOutfits(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error saving outfit:', err);
    }
  };

  // 6. Delete Outfit
  const handleDeleteOutfit = async (outfit) => {
    if (!window.confirm(`Delete outfit "${outfit.name}"?`)) return;
    setOutfits(prev => prev.filter(o => o.id !== outfit.id));
    try {
      await fetch(`http://localhost:8085/api/wardrobe/outfits/${outfit.id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting outfit:', err);
    }
  };

  // 7. Schedule Outfit for Date
  const handleScheduleOutfitForDate = async (outfit) => {
    const scheduleReq = {
      userId,
      dateStr: selectedDateStr,
      outfitId: outfit.id,
      outfitName: outfit.name
    };
    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleReq)
      });
      if (res.ok) {
        const saved = await res.json();
        setSchedules(prev => [...prev.filter(s => s.dateStr !== selectedDateStr), saved]);
      }
    } catch (err) {
      console.error('Error scheduling outfit:', err);
    }
  };

  // 8. Unschedule Date
  const handleUnscheduleDate = async (dateStr) => {
    try {
      await fetch(`http://localhost:8085/api/wardrobe/schedule?userId=${userId}&dateStr=${dateStr}`, {
        method: 'DELETE'
      });
      setSchedules(prev => prev.filter(s => s.dateStr !== dateStr));
    } catch (err) {
      console.error('Error unscheduling:', err);
    }
  };

  // 9. Mark Scheduled Outfit as Worn
  const handleMarkDateAsWorn = async (scheduledOutfitId) => {
    const outfit = outfits.find(o => o.id === scheduledOutfitId);
    if (!outfit) return;
    try {
      const ids = JSON.parse(outfit.productIds || '[]');
      for (const id of ids) {
        await handleWearItem(id);
      }
      alert('Logged all pieces in this outfit as worn today!');
    } catch (e) {
      console.error(e);
    }
  };

  // 10. Trip Planner Handlers
  const handleSaveNewTrip = async (tripData) => {
    const newTrip = {
      userId,
      ...tripData
    };

    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip)
      });
      if (res.ok) {
        const saved = await res.json();
        setTrips(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error creating trip:', err);
    }
  };

  const handleDeleteTrip = async (tripId, destination) => {
    if (!window.confirm(`Delete trip to "${destination}"?`)) return;
    setTrips(prev => prev.filter(t => t.id !== tripId));
    try {
      await fetch(`http://localhost:8085/api/wardrobe/trips/${tripId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting trip:', err);
    }
  };

  const handleToggleChecklistItem = async (trip, itemKey, newValue) => {
    let list = {};
    try {
      list = JSON.parse(trip.checklist || '{}');
    } catch (e) {
      list = {};
    }
    list[itemKey] = newValue;
    const updated = { ...trip, checklist: JSON.stringify(list) };

    setTrips(prev => prev.map(t => (t.id === trip.id ? updated : t)));
    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const saved = await res.json();
        setTrips(prev => prev.map(t => (t.id === saved.id ? saved : t)));
      }
    } catch (err) {
      console.error('Error updating checklist:', err);
    }
  };

  const handleAddChecklistItem = async (trip, newItemKey) => {
    let list = {};
    try {
      list = JSON.parse(trip.checklist || '{}');
    } catch (e) {
      list = {};
    }
    list[newItemKey] = false;
    const updated = { ...trip, checklist: JSON.stringify(list) };

    setTrips(prev => prev.map(t => (t.id === trip.id ? updated : t)));
    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const saved = await res.json();
        setTrips(prev => prev.map(t => (t.id === saved.id ? saved : t)));
      }
    } catch (err) {
      console.error('Error adding checklist item:', err);
    }
  };

  const handleDeleteChecklistItem = async (trip, itemKey) => {
    let list = {};
    try {
      list = JSON.parse(trip.checklist || '{}');
    } catch (e) {
      list = {};
    }
    delete list[itemKey];
    const updated = { ...trip, checklist: JSON.stringify(list) };

    setTrips(prev => prev.map(t => (t.id === trip.id ? updated : t)));
    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const saved = await res.json();
        setTrips(prev => prev.map(t => (t.id === saved.id ? saved : t)));
      }
    } catch (err) {
      console.error('Error deleting checklist item:', err);
    }
  };

  const handleSavePackedGarments = async (trip, garmentIds) => {
    const updated = { ...trip, packedGarmentIds: JSON.stringify(garmentIds) };
    setTrips(prev => prev.map(t => (t.id === trip.id ? updated : t)));
    try {
      const res = await fetch('http://localhost:8085/api/wardrobe/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const saved = await res.json();
        setTrips(prev => prev.map(t => (t.id === saved.id ? saved : t)));
      }
    } catch (err) {
      console.error('Error updating packed garments:', err);
    }
  };

  const handleUnpackGarment = async (trip, pieceId) => {
    let list = [];
    try {
      list = JSON.parse(trip.packedGarmentIds || '[]');
    } catch (e) {
      list = [];
    }
    const filtered = list.filter(id => id !== pieceId);
    await handleSavePackedGarments(trip, filtered);
  };

  // 11. Virtual Try-On Trigger
  const handleTryOn = (garment) => {
    if (garment) {
      setSelectedTryOnItem(garment);
      setIsTryOnModalOpen(true);
    }
  };

  // Derived Values
  const availableBrands = useMemo(() => {
    const set = new Set(items.map(i => i.brand).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [items]);

  const filteredGarments = useMemo(() => {
    return items
      .filter(item => {
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'tops' && item.category !== 'tops' && item.category !== 'shirts') return false;
          if (selectedCategory === 'bottoms' && item.category !== 'bottoms' && item.category !== 'pants') return false;
          if (selectedCategory === 'outerwear' && item.category !== 'outerwear' && item.category !== 'jackets') return false;
          if (selectedCategory === 'shoes' && item.category !== 'shoes') return false;
          if (selectedCategory === 'dresses' && item.category !== 'dresses' && item.category !== 'one-pieces') return false;
          if (selectedCategory === 'accessories' && item.category !== 'accessories') return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          if (!matchName && !matchBrand) return false;
        }
        if (filterBrand !== 'all' && item.brand?.toLowerCase() !== filterBrand.toLowerCase()) return false;
        if (filterSeason !== 'all' && item.season !== filterSeason) return false;
        if (filterOccasion !== 'all' && item.occasion !== filterOccasion) return false;
        if (filterColor !== 'all' && !item.colors?.toLowerCase().includes(filterColor.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'most_worn') return (b.wearCount || 0) - (a.wearCount || 0);
        if (sortBy === 'least_worn') return (a.wearCount || 0) - (b.wearCount || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [items, selectedCategory, searchQuery, filterBrand, filterSeason, filterOccasion, filterColor, sortBy]);

  // Subtle AI Stylist suggestions from user's actual clothes
  const todaysTops = items.filter(i => i.category === 'tops' || i.category === 'shirts');
  const todaysBottoms = items.filter(i => i.category === 'bottoms' || i.category === 'pants');
  const suggestedTop = todaysTops[0] || null;
  const suggestedBottom = todaysBottoms[0] || null;

  return (
    <div className={styles.wardrobeWrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Virtual Try-On Modal */}
        {isTryOnModalOpen && selectedTryOnItem && (
          <TryOnModal
            isOpen={isTryOnModalOpen}
            onClose={() => {
              setIsTryOnModalOpen(false);
              setSelectedTryOnItem(null);
            }}
            garmentImage={selectedTryOnItem.imageUrl}
            productTitle={selectedTryOnItem.name}
            category={selectedTryOnItem.category}
            product={selectedTryOnItem}
          />
        )}

        {/* 1. Page Header */}
        <WardrobeHeader
          itemCount={items.length}
          onOpenStyling={() => setIsStylingModalOpen(true)}
          onOpenUpload={() => setIsAddModalOpen(true)}
        />

        {/* 2. Navigation Tabs */}
        <WardrobeTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          clothesCount={items.length}
          outfitsCount={outfits.length}
        />

        {/* 3. Subtle Daily AI Insight Bar (Only when clothes exist) */}
        {items.length > 0 && suggestedTop && suggestedBottom && activeTab === 'clothes' && (
          <SubtleAiStylistBar
            suggestedTop={suggestedTop}
            suggestedBottom={suggestedBottom}
            onTryOn={handleTryOn}
          />
        )}

        {/* TAB 1: CLOTHES CATALOG */}
        {activeTab === 'clothes' && (
          <ClothesTab
            items={items}
            totalItemsCount={items.length}
            filteredGarments={filteredGarments}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isFilterDrawerOpen={isFilterDrawerOpen}
            onToggleFilterDrawer={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            filterBrand={filterBrand}
            onSelectBrand={setFilterBrand}
            filterSeason={filterSeason}
            onSelectSeason={setFilterSeason}
            filterOccasion={filterOccasion}
            onSelectOccasion={setFilterOccasion}
            filterColor={filterColor}
            onSelectColor={setFilterColor}
            onResetFilters={() => {
              setFilterBrand('all');
              setFilterSeason('all');
              setFilterOccasion('all');
              setFilterColor('all');
            }}
            availableBrands={availableBrands}
            onOpenUpload={() => setIsAddModalOpen(true)}
            onWearItem={handleWearItem}
            onTryOnItem={handleTryOn}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {/* TAB 2: SAVED OUTFITS */}
        {activeTab === 'outfits' && (
          <OutfitsTab
            outfits={outfits}
            items={items}
            onOpenStyling={() => setIsStylingModalOpen(true)}
            onTryOnOutfit={handleTryOn}
            onScheduleOutfit={handleScheduleOutfitForDate}
            onDeleteOutfit={handleDeleteOutfit}
          />
        )}

        {/* TAB 3: CALENDAR SCHEDULER */}
        {activeTab === 'calendar' && (
          <CalendarTab
            calendarDates={calendarDates}
            selectedDateStr={selectedDateStr}
            onSelectDate={setSelectedDateStr}
            schedules={schedules}
            outfits={outfits}
            items={items}
            onScheduleOutfit={handleScheduleOutfitForDate}
            onUnscheduleDate={handleUnscheduleDate}
            onMarkAsWorn={handleMarkDateAsWorn}
            onTryOnItem={handleTryOn}
          />
        )}

        {/* TAB 4: TRIP PACKING PLANNER */}
        {activeTab === 'planner' && (
          <TripPlannerTab
            trips={trips}
            items={items}
            onOpenCreateTrip={() => setIsCreateTripModalOpen(true)}
            onDeleteTrip={handleDeleteTrip}
            onToggleChecklistItem={handleToggleChecklistItem}
            onAddChecklistItem={handleAddChecklistItem}
            onDeleteChecklistItem={handleDeleteChecklistItem}
            onOpenPackModal={(trip) => setSelectedTripForPacking(trip)}
            onUnpackGarment={handleUnpackGarment}
          />
        )}

        {/* MODAL 1: ADD PERSONAL GARMENT */}
        <AddGarmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSaveGarment={handleSaveGarment}
        />

        {/* MODAL 2: MIX & MATCH STYLING STUDIO */}
        <MixMatchStylingModal
          isOpen={isStylingModalOpen}
          onClose={() => setIsStylingModalOpen(false)}
          items={items}
          onSaveOutfit={handleSaveOutfit}
          onTryOn={handleTryOn}
        />

        {/* MODAL 3: CREATE TRIP MODAL */}
        <CreateTripModal
          isOpen={isCreateTripModalOpen}
          onClose={() => setIsCreateTripModalOpen(false)}
          onSaveTrip={handleSaveNewTrip}
        />

        {/* MODAL 4: PACK CLOTHES MODAL */}
        <PackClothesModal
          isOpen={Boolean(selectedTripForPacking)}
          onClose={() => setSelectedTripForPacking(null)}
          trip={selectedTripForPacking}
          items={items}
          onSavePackedGarments={handleSavePackedGarments}
        />
      </main>
    </div>
  );
}
