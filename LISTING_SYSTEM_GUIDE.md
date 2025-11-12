# Marketplace Listing System Guide

## 🎯 Overview

Users can now create detailed listings for their resellable items with:
- Multiple images (up to 5)
- Price
- Description
- Brand, Size, Category
- Condition

## 📋 User Flow

```
1. Upload Image → 2. AI Detects "resellable" → 3. Add to Resell Bag
    ↓
4. Go to My Bags → 5. Click "List Item" → 6. Fill Details
    ↓
7. Add More Images → 8. Set Price → 9. Write Description
    ↓
10. Create Listing → 11. Appears in Marketplace
```

## 🆕 New Features

### 1. Create Listing Page (`/create-listing`)

**Left Panel - Images:**
- Shows the original uploaded image
- Add up to 4 more images (5 total)
- First image is the main photo
- Remove images with hover button
- Drag & drop or click to upload

**Right Panel - Details:**
- **Title*** (required): Item name
- **Price*** (required): In dollars
- **Description*** (required): Detailed description
- **Brand**: Optional brand name
- **Size**: Optional size (S, M, L, XL, etc.)
- **Category**: Dropdown (Tops, Bottoms, Dresses, etc.)
- **Condition**: Dropdown (New, Like New, Good, Fair)

### 2. Updated Bag Page

**Resell Tab:**
- Each item now has a "List Item" button
- Clicking opens the Create Listing page
- Item data is passed to the form

**Other Tabs:**
- Donation and Recycle tabs remain unchanged
- Only resell items can be listed

### 3. Updated Marketplace

**Displays:**
- All created listings from localStorage
- Price badge on image
- Description preview (2 lines)
- Brand, Condition, Category tags
- Multiple images support

**Banner:**
- Shows when you have items in resell bag
- Updated text: "Ready to List Your Items?"
- Links to bag page

## 🎨 UI Components

### Create Listing Page:
```
┌─────────────────────────────────────────┐
│  Create Listing                         │
├──────────────────┬──────────────────────┤
│  Images Panel    │  Details Panel       │
│  ┌────┬────┐     │  Title: _________    │
│  │Img1│Img2│     │  Price: $_______     │
│  ├────┼────┤     │  Description:        │
│  │Img3│ +  │     │  ________________    │
│  └────┴────┘     │  Brand: _________    │
│  Add up to 5     │  Size: __________    │
│                  │  Category: [▼]       │
│                  │  Condition: [▼]      │
│                  │  [Cancel] [Create]   │
└──────────────────┴──────────────────────┘
```

### Marketplace Item Card:
```
┌─────────────────┐
│                 │
│     Image       │
│            $25  │ ← Price badge
├─────────────────┤
│ Title           │
│ Description...  │
│ [Brand] [Good]  │ ← Tags
└─────────────────┘
```

## 💾 Data Storage

### Listing Object:
```javascript
{
  id: "listing-1234567890",
  title: "Vintage Denim Jacket",
  description: "Beautiful vintage denim...",
  price: "45.00",
  brand: "Levi's",
  size: "M",
  condition: "good",
  category: "outerwear",
  images: [
    "data:image/jpeg;base64,...",  // Main image
    "data:image/jpeg;base64,...",  // Additional images
  ],
  detectedClass: "resellable",
  createdAt: 1234567890
}
```

### Storage Location:
- **localStorage key**: `marketplace_listings`
- **Format**: JSON array of listing objects
- **Persistence**: Survives page refresh

## 🔄 Workflow Examples

### Example 1: Complete Listing Flow
```
1. User uploads shirt image
2. AI detects "resellable"
3. User clicks "Add to Resell"
4. Goes to My Bags → Resell tab
5. Clicks "List Item" on the shirt
6. Redirected to Create Listing page
7. Adds 2 more photos of the shirt
8. Fills in:
   - Title: "Vintage Band T-Shirt"
   - Price: $25
   - Description: "Rare 90s band tee..."
   - Brand: "Vintage"
   - Size: "L"
   - Category: "Tops"
   - Condition: "Good"
9. Clicks "Create Listing"
10. Item removed from resell bag
11. Redirected to marketplace
12. Listing appears in marketplace grid
```

### Example 2: Multiple Items
```
User has 3 items in resell bag:
1. Jacket - Lists with $50 price
2. Jeans - Lists with $30 price
3. Shoes - Lists with $40 price

All 3 appear in marketplace
Resell bag is now empty
```

## ✅ Validation Rules

**Required Fields:**
- Title (must not be empty)
- Price (must be > 0)
- Description (must not be empty)
- At least 1 image

**Optional Fields:**
- Brand
- Size
- Category
- Condition (defaults to "good")

**Image Limits:**
- Minimum: 1 image (from original upload)
- Maximum: 5 images total
- Formats: JPG, PNG, HEIC

## 🎯 Key Features

### 1. Multi-Image Support
- Upload multiple angles of the same item
- First image is the main/cover photo
- Remove unwanted images
- Visual indicator for main photo

### 2. Detailed Descriptions
- Large text area for detailed descriptions
- Encourage users to describe condition, story, etc.
- Helps buyers make informed decisions

### 3. Price Display
- Prominent price badge on marketplace cards
- Formatted as currency ($XX.XX)
- Required field ensures all listings have prices

### 4. Smart Filtering
- Marketplace filters work with new listings
- Filter by brand, category, condition
- Combines backend items + local listings

### 5. Seamless Integration
- Items removed from resell bag after listing
- Automatic redirect to marketplace
- Success message on creation

## 🚀 Testing Guide

### Test 1: Create Basic Listing
1. Upload image → Detect as resellable → Add to Resell
2. Go to My Bags → Click "List Item"
3. Fill required fields (Title, Price, Description)
4. Click "Create Listing"
5. Check marketplace for new listing

### Test 2: Add Multiple Images
1. Start creating listing
2. Click "+" to add more images
3. Upload 4 more images (5 total)
4. Remove one image
5. Create listing
6. Check marketplace card shows main image

### Test 3: Validation
1. Try to create listing without title → See error
2. Try without price → See error
3. Try without description → See error
4. Fill all required fields → Success

### Test 4: Multiple Listings
1. Add 3 items to resell bag
2. List all 3 with different prices
3. Check marketplace shows all 3
4. Check resell bag is empty

## 🐛 Troubleshooting

**Listing not appearing in marketplace?**
- Check localStorage: `marketplace_listings`
- Refresh the marketplace page
- Check browser console for errors

**Images not uploading?**
- Check file format (JPG, PNG, HEIC)
- Check file size (browser limits)
- Try one image at a time

**"No item selected" error?**
- Must navigate from bag page
- Click "List Item" button
- Don't navigate directly to /create-listing

## 📊 Future Enhancements

- [ ] Edit existing listings
- [ ] Delete listings
- [ ] Mark as sold
- [ ] Buyer messaging
- [ ] Favorites/Wishlist
- [ ] Search functionality
- [ ] Sort by price, date, etc.
- [ ] User profiles
- [ ] Transaction history
- [ ] Reviews/Ratings
