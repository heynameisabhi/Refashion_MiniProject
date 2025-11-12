# Quick Start Guide - Bag System

## 🚀 Servers Running
✅ Backend: http://localhost:8000  
✅ Frontend: http://localhost:5175

## 📱 Test the New Features

### 1. Upload & Categorize Items

**Go to:** http://localhost:5175/upload

1. Click "Continue as Guest" (if not logged in)
2. Upload a clothing image
3. Click "Analyze Item"
4. Wait for AI detection results
5. You'll see 3 action buttons:
   - **💰 Add to Resell** (if high quality)
   - **❤️ Add to Donation** (if high quality)
   - **♻️ Add to Recycle** (always available)
6. Click any button → Auto-redirects to My Bags

### 2. View Your Bags

**Go to:** http://localhost:5175/bag

- Switch between tabs: Resell | Donation | Recycle
- See all your items with previews
- Remove items or clear entire bags
- Notice the badge count in navbar

### 3. Marketplace Integration

**Go to:** http://localhost:5175/marketplace

- If you have resellable items, you'll see a banner at the top
- Banner shows:
  - Count of items ready to resell
  - Preview thumbnails (up to 3 items)
  - "View My Resell Bag" button

### 4. Navigation Badge

- Look at the navbar
- "My Bags" link has a red badge showing total item count
- Badge updates in real-time as you add/remove items

## 🎯 Test Scenarios

### Scenario A: High-Quality Item (Resellable)
```
Upload image → AI detects with 85% confidence
→ Shows "RESELLABLE" message
→ 3 buttons appear: Resell, Donation, Recycle
→ Click "Add to Resell"
→ Item added to BOTH Resell AND Donation bags
→ Badge shows "2" (1 item in 2 bags)
→ Marketplace shows resell banner
```

### Scenario B: Low-Quality Item (Recyclable)
```
Upload image → AI detects with 60% confidence
→ Shows "RECYCLABLE" message
→ Only 1 button appears: Recycle
→ Click "Add to Recycle"
→ Item added to Recycle bag only
→ Badge shows "1"
→ No banner in marketplace
```

### Scenario C: Multiple Items
```
Upload 3 items:
- 2 resellable (confidence > 70%)
- 1 recyclable (confidence < 70%)

Add all to their respective bags:
- Resell bag: 2 items
- Donation bag: 2 items (same as resell)
- Recycle bag: 1 item

Badge shows: 5 (total across all bags)
Marketplace banner: "You have 2 items ready to resell"
```

## 🔍 What to Look For

### ✅ Success Indicators
- [ ] Badge appears in navbar when items added
- [ ] Badge count updates correctly
- [ ] Items persist after page refresh (localStorage)
- [ ] Resellable items appear in both Resell and Donation
- [ ] Marketplace banner appears when resell items exist
- [ ] Image previews display correctly
- [ ] Success messages show with emojis
- [ ] Auto-redirect to bag page after adding item

### ❌ Common Issues
- **Network Error**: Make sure backend is running on port 8000
- **No Detection**: Check if model file exists at the path in main.py
- **Badge Not Updating**: Refresh the page
- **Images Not Showing**: Check browser console for errors

## 🎨 UI Elements to Notice

1. **Upload Page**
   - Image preview before analysis
   - Confidence scores with colored badges
   - Smart button visibility based on quality

2. **Bag Page**
   - Tab icons with emojis
   - Count badges on tabs
   - Grid layout with hover effects
   - Empty state messages

3. **Marketplace**
   - Gradient banner for resell items
   - Thumbnail previews
   - Item count display

4. **Navbar**
   - Red circular badge
   - Badge only shows when count > 0
   - Updates without page refresh

## 💡 Tips

- **Test with different images**: Try various clothing items to see different confidence scores
- **Check localStorage**: Open browser DevTools → Application → Local Storage → see `refashion_bags`
- **Try all 3 bags**: Add items to each category to see the full experience
- **Refresh the page**: Items should persist (stored in localStorage)
- **Clear bags**: Use "Clear All" button to reset a category

## 🐛 Troubleshooting

**Badge not showing?**
- Add an item first
- Check if BagProvider is wrapping the app (it is)

**Items disappearing?**
- Check browser console for errors
- Verify localStorage is enabled

**Marketplace banner not showing?**
- Make sure you added items to Resell bag
- Refresh the marketplace page

**Backend not responding?**
- Check if port 8000 is running: http://localhost:8000
- Should see: `{"message":"YOLOv8 API is running!"}`

## 📞 Need Help?

Check the logs:
- Backend logs: See the terminal running uvicorn
- Frontend logs: Browser DevTools → Console
- Network requests: Browser DevTools → Network tab
