# Quick Test - Listing System

## 🚀 Test the New Listing Feature

### Step 1: Add Item to Resell Bag
1. Go to: http://localhost:5175/upload
2. Upload a clothing image
3. Click "Analyze Item"
4. If detected as "resellable", click "💰 Add to Resell"
5. You'll be redirected to My Bags

### Step 2: Create a Listing
1. You're now on the Resell tab in My Bags
2. You should see your item with a **"List Item"** button
3. Click **"List Item"**
4. You'll be redirected to the Create Listing page

### Step 3: Fill in Details
**Required fields (marked with *):**
- **Title**: e.g., "Vintage Denim Jacket"
- **Price**: e.g., "45.00"
- **Description**: e.g., "Beautiful vintage denim jacket in great condition..."

**Optional fields:**
- **Brand**: e.g., "Levi's"
- **Size**: e.g., "M"
- **Category**: Select from dropdown
- **Condition**: Select from dropdown (defaults to "Good")

### Step 4: Add More Images (Optional)
1. Click the **"+"** button in the images section
2. Select 1-4 more images (5 total max)
3. First image is automatically the main photo
4. Hover over images to see remove button

### Step 5: Create Listing
1. Click **"Create Listing"** button
2. You'll be redirected to Marketplace
3. Your listing should appear in the grid!

## ✅ What to Check

### In My Bags:
- [ ] "List Item" button appears on resell items
- [ ] Button is primary/green color
- [ ] "Remove" button still works

### In Create Listing Page:
- [ ] Original image is pre-loaded
- [ ] Can add more images (up to 5 total)
- [ ] Can remove images
- [ ] All form fields work
- [ ] Validation shows errors for missing required fields
- [ ] Cancel button goes back to bags

### In Marketplace:
- [ ] New listing appears in grid
- [ ] Price badge shows on image
- [ ] Description is truncated to 2 lines
- [ ] Brand, condition, category tags display
- [ ] Image displays correctly

### After Creating Listing:
- [ ] Item removed from resell bag
- [ ] Listing persists after page refresh
- [ ] Can create multiple listings

## 🎯 Expected Results

### Before Creating Listing:
```
My Bags → Resell Tab
┌─────────────────┐
│     Image       │
│ shirt.jpg       │
│ Detected: ...   │
│ [List] [Remove] │ ← "List Item" button
└─────────────────┘
```

### Create Listing Page:
```
┌──────────────────────────────────┐
│ Create Listing                   │
├─────────────┬────────────────────┤
│ Images      │ Item Details       │
│ [Img1][+]   │ Title: *           │
│             │ Price: * $         │
│             │ Description: *     │
│             │ Brand:             │
│             │ Size:              │
│             │ Category: [▼]      │
│             │ Condition: [▼]     │
│             │ [Cancel] [Create]  │
└─────────────┴────────────────────┘
```

### Marketplace Result:
```
┌─────────────────┐
│                 │
│   Your Image    │
│          $45.00 │ ← Price badge
├─────────────────┤
│ Vintage Denim   │
│ Beautiful...    │
│ [Levi's] [Good] │
└─────────────────┘
```

## 🐛 Common Issues

**"No item selected" error?**
- Must click "List Item" from bag page
- Don't navigate directly to /create-listing URL

**Listing not showing in marketplace?**
- Refresh the marketplace page
- Check if listing was created (check localStorage)

**Can't add more images?**
- Maximum is 5 images total
- Check file format (JPG, PNG, HEIC)

**Validation errors?**
- Title, Price, and Description are required
- Price must be a number > 0

## 💡 Tips

1. **Add Multiple Images**: Show different angles of your item
2. **Write Good Descriptions**: Mention condition, brand, why you're selling
3. **Set Fair Prices**: Research similar items
4. **Use Categories**: Helps buyers find your items
5. **Be Honest About Condition**: Builds trust

## 🎉 Success!

If you can:
1. ✅ Click "List Item" from resell bag
2. ✅ Fill in the form
3. ✅ Add multiple images
4. ✅ Create the listing
5. ✅ See it in marketplace

**Then the listing system is working perfectly!** 🎊
