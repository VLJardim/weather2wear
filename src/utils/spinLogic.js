/**
 * SPIN LOGIC - WEATHER-AWARE OUTFIT GENERATION
 * 
 * This is the core algorithm that generates outfits based on weather conditions.
 * It uses sophisticated rules to create appropriate outfits for different seasons.
 * 
 * Key features:
 * - Maps temperature to seasons (Winter, Spring, Summer, Fall)
 * - Detects bad weather (rain, snow) for appropriate clothing choices
 * - Scores items based on season, temperature, and weather conditions
 * - Special summer logic: dresses replace top+bottom, accessories replace outerwear
 * - Smart category matching (handles plural/singular variations)
 * 
 * Used by: useRoulette hook (main outfit generation)
 */

// src/utils/spinLogic.js
// --------------------------------------------
// Outfit generation logic with seasonal rules.
// Summer replaces Jackets with Accessories/Dresses
// --------------------------------------------

// Convert temperature (°C) to season for outfit logic
export function inferSeasonFromTemp(tempC) {
  if (tempC <= 5) return "Winter";   // Very cold
  if (tempC <= 15) return "Fall";    // Cool
  if (tempC <= 25) return "Spring";  // Mild
  return "Summer";                   // Warm/hot
}

// Detect weather conditions that require protective clothing
export function isBadWeather(condition) {
  if (!condition) return false;
  const c = String(condition).toLowerCase();
  return (
    c.includes("rain") ||     // Rainy weather
    c.includes("snow") ||     // Snowy weather
    c.includes("storm") ||    // Thunderstorms
    c.includes("drizzle")     // Light rain
  );
}

// Check if clothing item is suitable for current temperature
function inTempRange(item, tempC) {
  if (!Array.isArray(item.temperatureRange) || item.temperatureRange.length !== 2)
    return true; // No temperature restriction
  const [min, max] = item.temperatureRange;
  return tempC >= min && tempC <= max; // Temperature within item's range
}

// Check if item's season matches target season (supports both string and array)
function seasonMatches(itemSeason, targetSeason) {
  if (!itemSeason) return false;
  if (Array.isArray(itemSeason)) return itemSeason.includes(targetSeason); // Multi-season item
  return itemSeason === targetSeason; // Single season item
}

// Score clothing items based on weather appropriateness (higher = better match)
function scoreItem(item, targetSeason, tempC, bad) {
  let s = 0;

  // SEASON SCORING - Perfect season match gets highest points
  if (seasonMatches(item.season, targetSeason)) s += 3;      // Perfect match
  else if (item.fallbackSeason === "All Year") s += 1;       // All-season item

  // TEMPERATURE SCORING - Item comfort within temperature range
  if (inTempRange(item, tempC)) s += 2;

  // WEATHER PROTECTION SCORING - Special logic for shoes in bad weather
  if (item.category === "Shoes") {
    if (bad && item.closedShoe) s += 3;      // Closed shoes for rain/snow
    if (!bad && item.closedShoe === false) s += 1; // Open shoes for good weather
  }

  return s; // Total score for this item
}

// Flexible category matching
function filterByCategory(items, category) {
  const normalized = category.toLowerCase();
  return items.filter((i) => {
    const c = i.category.toLowerCase();
    return (
      c === normalized ||                                    // Exact match
      c === normalized.slice(0, -1) ||                      // "Tops" vs "Top"
      normalized === c.slice(0, -1) ||                      // "Top" vs "Tops"
      (c.includes("jacket") && normalized.includes("outer")) || // Outerwear/Jacket synonyms
      (c.includes("outer") && normalized.includes("jacket"))
    );
  });
}

// Select best-scoring item from available options (random among equals)
function pickBest(items, targetSeason, tempC, bad) {
  if (!items.length) return null;
  
  // Score all items and sort by score (highest first)
  const scored = items
    .map((it) => ({ it, score: scoreItem(it, targetSeason, tempC, bad) }))
    .sort((a, b) => b.score - a.score);

  // Get all items with the highest score
  const bestScore = scored[0].score;
  const top = scored.filter((x) => x.score === bestScore).map((x) => x.it);

  // Randomly pick from the best-scoring items
  return top[Math.floor(Math.random() * top.length)];
}


export function generateWeatherAwareOutfit(allItems, weather) {
  // Extract weather data
  const temp = Number(weather?.temperature ?? 18);  // Default to mild temperature
  const condition = weather?.condition || "";        // Weather condition string
  const bad = isBadWeather(condition);              // Is it raining/snowing?
  const season = inferSeasonFromTemp(temp);         // Determine season from temperature

  console.log(
    "🧩 Generating outfit for season:",
    season,
    "temp:", temp + "°C",
    "bad weather:", bad,
    "available categories:",
    Array.from(new Set(allItems.map((i) => i.category)))
  );

  const outfit = {}; // Will store selected clothing items

  //  SUMMER RULESET
  if (season === "Summer") {
    console.log("🌞 Summer mode active — replacing Jackets with Dresses/Accessories");

    //  Try Dress (replaces Top + Bottom)
    const dressPool = filterByCategory(allItems, "Dresses").filter(
      (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
    );
    const dressPick = pickBest(dressPool, season, temp, bad);

    if (dressPick) {
      outfit.dress = dressPick; // Use dress instead of separate top/bottom
    } else {
      //  No Dress found → pick separate Top & Bottom
      const topPool = filterByCategory(allItems, "Tops").filter(
        (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
      );
      const bottomPool = filterByCategory(allItems, "Bottoms").filter(
        (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
      );

      // Fallback to any top/bottom if no summer-specific items found
      if (topPool.length === 0)
        console.warn("⚠️ No summer Tops found, using fallback pool");
      if (bottomPool.length === 0)
        console.warn("⚠️ No summer Bottoms found, using fallback pool");

      outfit.top = pickBest(topPool.length ? topPool : filterByCategory(allItems, "Tops"), season, temp, bad);
      outfit.bottom = pickBest(bottomPool.length ? bottomPool : filterByCategory(allItems, "Bottoms"), season, temp, bad);
    }

    // Always include Shoes
    const shoePool = filterByCategory(allItems, "Shoes").filter(
      (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
    );
    outfit.shoes = pickBest(shoePool, season, temp, bad);

    // Replace Outerwear → Accessories
    const accPool = filterByCategory(allItems, "Accessories").filter(
      (it) => seasonMatches(it.season, season) && temp >= 20  // Only for warm weather
    );
    outfit.accessory = pickBest(accPool, season, temp, bad) || null;
  }

  // NON-SUMMER SEASONS (Normal jacket logic)
  else {
    console.log(`🧥 ${season} mode active — using standard outfit logic`);
    const cats = ["Tops", "Bottoms", "Outerwear", "Shoes"];

    for (const cat of cats) {
      let pool = filterByCategory(allItems, cat).filter(
        (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
      );

      if (pool.length === 0) {
        console.warn(`⚠️ No ${cat} found for season ${season}, using generic fallback`);
        pool = filterByCategory(allItems, cat);
      }

      const pick = pickBest(pool, season, temp, bad);
      if (!pick) continue;

      switch (cat) {
        case "Tops":
          outfit.top = pick;
          break;
        case "Bottoms":
          outfit.bottom = pick;
          break;
        case "Outerwear":
          // Optional "lighter jacket" rule for warm shoulder seasons
          if (temp >= 22 && !bad) {
            const lightPool = pool.filter((i) =>
              Array.isArray(i.season)
                ? i.season.includes("Summer")
                : i.season === "Summer"
            );
            outfit.outer = pickBest(lightPool.length ? lightPool : pool, season, temp, bad) || pick;
          } else {
            outfit.outer = pick;
          }
          break;
        case "Shoes":
          outfit.shoes = pick;
          break;
      }
    }
  }

  console.log(" Final Outfit Generated:", outfit);
  return outfit;
}
