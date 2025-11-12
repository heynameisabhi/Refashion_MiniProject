# Bag System Features

## Overview
A comprehensive bag management system that categorizes clothing items into Recycle, Resell, and Donation bags based on AI detection results.

## Key Features

### 1. **Smart Categorization**
- Items with >70% confidence are marked as **RESELLABLE**
- Items with lower confidence are marked as **RECYCLABLE**
- Resellable items automatically appear in both Resell AND Donation bags

### 2. **Upload Page - 3 Action Buttons**
After AI analysis, users get 3 options:
- **💰 Add to Resell** - For high-quality items (only shown if resellable)
- **❤️ Add to Donation** - For items to donate (only shown if resellable)
- **♻️ Add to Recycle** - For items to recycle (always shown)

### 3. **My Bags Page** (`/bag`)
- **3 Tabs**: Resell, Donation, Recycle
- Each tab shows items with:
  - Image preview
  - File name
  - Detected class
  - Confidence score
- Actions:
  - Remove individual items
  - Clear all items in a category
- Badge count in navbar shows total items across all bags

### 4. **Marketplace Integration**
- **Top Banner** appears when user has resellable items
- Shows count of items ready to resell
- Preview of up to 3 resell items
- Quick link to "View My Resell Bag"

### 5. **Navigation**
- "My Bags" link in navbar with badge showing total item count
- Badge updates in real-time as items are added/removed

## User Flow

```
1. Upload Image → 2. AI Analysis → 3. Choose Action → 4. Item Added to Bag → 5. View in My Bags → 6. Resell in Marketplace
```

### Example Flow:
1. User uploads a photo of a shirt
2. AI detects "shirt" with 85% confidence
3. System marks it as RESELLABLE
4. User sees 3 buttons: Resell, Donation, Recycle
5. User clicks "Add to Resell"
6. Item is added to BOTH Resell and Donation bags
7. User is redirected to My Bags page
8. In Marketplace, a banner shows "You have 1 item ready to resell"

## Data Storage
- Uses localStorage for persistence
- Data structure:
```javascript
{
  recycle: [items],
  resell: [items],
  donation: [items]
}
```

Each item contains:
- `id`: Unique identifier
- `fileName`: Original file name
- `preview`: Base64 image preview
- `detectedClass`: AI detected class name
- `confidence`: Detection confidence score
- `addedAt`: Timestamp

## Future Enhancements
- [ ] Add ability to list resell items with price
- [ ] Schedule donation pickups
- [ ] Find nearby recycling centers
- [ ] Track environmental impact (CO2 saved)
- [ ] Share items on social media
- [ ] Export bag contents as PDF
