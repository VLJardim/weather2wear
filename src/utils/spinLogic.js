// src/utils/spinLogic.js
// --------------------------------------------
// Outfit generation logic with seasonal rules.
// Summer replaces Jackets with Accessories/Dresses
// --------------------------------------------

// Map temperature (°C) to coarse season
export function inferSeasonFromTemp(tempC) {
  if (tempC <= 5) return "Winter";
  if (tempC <= 15) return "Fall";
  if (tempC <= 25) return "Spring";
  return "Summer";
}

// Detect "bad" weather (rain, snow, storm, drizzle)
export function isBadWeather(condition) {
  if (!condition) return false;
  const c = String(condition).toLowerCase();
  return (
    c.includes("rain") ||
    c.includes("snow") ||
    c.includes("storm") ||
    c.includes("drizzle")
  );
}

// Check if item fits temperature range
function inTempRange(item, tempC) {
  if (!Array.isArray(item.temperatureRange) || item.temperatureRange.length !== 2)
    return true;
  const [min, max] = item.temperatureRange;
  return tempC >= min && tempC <= max;
}

// Support both string and array seasons
function seasonMatches(itemSeason, targetSeason) {
  if (!itemSeason) return false;
  if (Array.isArray(itemSeason)) return itemSeason.includes(targetSeason);
  return itemSeason === targetSeason;
}

// Score items by season, temperature, and weather
function scoreItem(item, targetSeason, tempC, bad) {
  let s = 0;

  // Season match
  if (seasonMatches(item.season, targetSeason)) s += 3;
  else if (item.fallbackSeason === "All Year") s += 1;

  // Temperature comfort
  if (inTempRange(item, tempC)) s += 2;

  // Special case: shoes (weather protection)
  if (item.category === "Shoes") {
    if (bad && item.closedShoe) s += 3;
    if (!bad && item.closedShoe === false) s += 1;
  }

  return s;
}

// ✅ Flexible category matching
function filterByCategory(items, category) {
  const normalized = category.toLowerCase();
  return items.filter((i) => {
    const c = i.category.toLowerCase();
    return (
      c === normalized ||
      c === normalized.slice(0, -1) || // match "Tops" vs "Top"
      normalized === c.slice(0, -1) ||
      (c.includes("jacket") && normalized.includes("outer")) || // Outerwear/Jacket
      (c.includes("outer") && normalized.includes("jacket"))
    );
  });
}

// Pick the "best" scored item; random among top equals
function pickBest(items, targetSeason, tempC, bad) {
  if (!items.length) return null;
  const scored = items
    .map((it) => ({ it, score: scoreItem(it, targetSeason, tempC, bad) }))
    .sort((a, b) => b.score - a.score);

  const bestScore = scored[0].score;
  const top = scored.filter((x) => x.score === bestScore).map((x) => x.it);

  return top[Math.floor(Math.random() * top.length)];
}

/**
 * Generates a weather-aware outfit.
 * - Summer replaces Jackets with Accessories/Dresses.
 * - Dresses replace Top + Bottom.
 * - Other seasons use Tops, Bottoms, Outerwear, Shoes.
 */
export function generateWeatherAwareOutfit(allItems, weather) {
  const temp = Number(weather?.temperature ?? 18);
  const condition = weather?.condition || "";
  const bad = isBadWeather(condition);
  const season = inferSeasonFromTemp(temp);

  console.log(
    "🧩 Checking categories for season:",
    season,
    "available categories:",
    Array.from(new Set(allItems.map((i) => i.category)))
  );

  const outfit = {};

  // ☀️ SUMMER RULESET
  if (season === "Summer") {
    console.log("🌞 Summer mode active — replacing Jackets with Dresses/Accessories");

    // 1️⃣ Try Dress (replaces Top + Bottom)
    const dressPool = filterByCategory(allItems, "Dresses").filter(
      (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
    );
    const dressPick = pickBest(dressPool, season, temp, bad);

    if (dressPick) {
      outfit.dress = dressPick;
    } else {
      // 2️⃣ No Dress found → pick separate Top & Bottom
      const topPool = filterByCategory(allItems, "Tops").filter(
        (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
      );
      const bottomPool = filterByCategory(allItems, "Bottoms").filter(
        (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
      );

      if (topPool.length === 0)
        console.warn("⚠️ No Tops found for season", season, "using fallback pool");
      if (bottomPool.length === 0)
        console.warn("⚠️ No Bottoms found for season", season, "using fallback pool");

      outfit.top = pickBest(topPool.length ? topPool : filterByCategory(allItems, "Tops"), season, temp, bad);
      outfit.bottom = pickBest(bottomPool.length ? bottomPool : filterByCategory(allItems, "Bottoms"), season, temp, bad);
    }

    // 3️⃣ Always include Shoes
    const shoePool = filterByCategory(allItems, "Shoes").filter(
      (it) => seasonMatches(it.season, season) || it.fallbackSeason === "All Year"
    );
    outfit.shoes = pickBest(shoePool, season, temp, bad);

    // 4️⃣ Replace Outerwear → Accessories
    const accPool = filterByCategory(allItems, "Accessories").filter(
      (it) => seasonMatches(it.season, season) && temp >= 20
    );
    outfit.accessory = pickBest(accPool, season, temp, bad) || null;
  }

  // 🍂 NON-SUMMER SEASONS (Normal jacket logic)
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

  console.log("🎯 Final Outfit Generated:", outfit);
  return outfit;
}
