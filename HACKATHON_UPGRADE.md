# Karoo & Coast — Hackathon Upgrade Notes

This build converts the original Journey Weaver prototype into a stronger 2027 Train Tourism Hackathon concept without replacing its core South African tourism idea.

## Added in this upgrade

1. **Pretoria is now km 0**
   - Added Pretoria Station as the first journey moment.
   - Added a transparent Pretoria→Johannesburg gateway segment.
   - Shifted all existing route moments so distance is measured from Pretoria.

2. **Journey Intelligence**
   - Airport-style progress panel.
   - Current area.
   - Next real station.
   - ETA-style time-to-next-station.
   - Remaining journey distance.
   - Clear Demo Mode / GPS Mode labels.

3. **WindowCast™**
   - Route-aware alerts before selected landmarks and landscape moments.
   - “Look right”, “look outside” and “look up” guidance only where supported by the researched story.
   - Current prototype triggers include the Witwatersrand, Vaal, Orange River, Karoo night sky, Three Sisters, Hex River and Table Mountain.

4. **GPS journey mode**
   - User-triggered browser geolocation.
   - Nearest-route matching when the device is within 20 km of the mapped corridor.
   - Automatic journey-position updates while GPS mode is active.
   - Explicitly labelled as route matching, not live railway tracking.

5. **Station Mode**
   - Tourism-discovery layer for selected major stops.
   - Shows the kinds of station/passenger information the future partner-integrated product can surface.
   - Connects arrival to heritage, attractions, culture and local experiences.

6. **Global research translated into the product**
   - Japan: digital collecting / station stamp inspiration.
   - Norway: location-synchronised landscape storytelling.
   - Switzerland, Germany and France: digital journey-companion patterns.
   - Schiphol and Heathrow: contextual passenger guidance and “what happens next” thinking.
   - Added this research logic to the home and About pages.

7. **Offline-friendly PWA foundation**
   - Added web manifest.
   - Added a simple same-origin runtime service worker cache.
   - External map tiles and live backend data are still online dependencies.

8. **Positioning / pitch**
   - Main value proposition: **“Your train journey becomes part of the destination.”**
   - Product flow: **MOVE → DISCOVER → EXPERIENCE**.
   - Differentiator: the growing rail-tourism intelligence layer behind WindowCast and Station Mode.

## Important production follow-ups

- Replace the schematic Pretoria gateway with authoritative long-distance route geometry when the operator/official dataset is available.
- Integrate authoritative railway timetable/status/platform data instead of simulating operational status.
- Verify every station facility, opening hour and tourism booking link with partners before displaying it as live information.
- Add offline map tiles/route packages if full no-signal mapping is required.
- Add richer translations and human-recorded Local Voices content.
- Add authenticated community moderation and partner content workflows.
