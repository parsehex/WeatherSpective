# WeatherSpective

This is a weather app built with Vue 3, TypeScript, and Vite. It uses the OpenMeteo API to get weather data and Shadcn-vue for the UI.

## Locked Location Mode (Great for Raspberry Pi Displays)

You can lock the app to a single location using one environment variable.

1. Copy `.env.example` to `.env`.
2. Set `VITE_LOCKED_LOCATION` to a valid JSON object.

Example:

```env
VITE_LOCKED_LOCATION={"name":"Bentonville","latitude":36.3729,"longitude":-94.2088,"country":"United States","admin1":"Arkansas"}
```

When this variable is set correctly:

- The app always uses that location.
- Sidebar/location picker controls are hidden.
- The add-location route is disabled.

### Lock The 3 Unit Settings

You can also lock the three unit settings with env vars:

```env
VITE_LOCKED_TEMPERATURE_UNIT=fahrenheit
VITE_LOCKED_WIND_SPEED_UNIT=mph
VITE_LOCKED_PRECIPITATION_UNIT=inch
```

When set to valid values, those settings become read-only in the app.
If a value is invalid, it is ignored and a warning is shown in the settings dialog.

## 480x320 Display Behavior

For small landscape displays (like 480x320), the UI automatically switches to a compact mode:

- Tighter spacing and header sizing.
- Fewer metrics in the main weather card.
- 3-day forecast and 6-hour hourly strip for readability.

The default desktop and normal mobile layouts remain unchanged outside that compact breakpoint.
