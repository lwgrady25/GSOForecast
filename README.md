# GSO Forecast MVP

This is a zero-build, browser-based MVP prototype for the GSO clinical enrollment forecasting tool.

## How to run
1. Unzip this folder.
2. Open the folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server** if you have that extension, or simply double-click `index.html` to open it in a browser.

## What this MVP does
- Holds study-level assumptions.
- Holds site-level assumptions.
- Lets you include/exclude sites.
- Runs a simple monthly enrollment forecast.
- Shows monthly enrollment, cumulative enrollment, forecasted LPI, target comparison, and KPI cards.

## Next build step
After this prototype looks right, the logic can be moved into a real app stack such as:
- ASP.NET Core / Blazor + Azure App Service + Azure SQL, or
- React + API + Azure SQL.
