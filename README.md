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
- Lets you rename each site to a PI/site name in Site Information.
- Tracks current enrollment per site for ongoing trials.
- Includes a Current State dashboard view with LPI comparison, enrollment progress, active sites, enrollment rate, and a current-vs-forecast baseline curve.
- Current State pace status uses an **As of Date** so teams can compare current enrollment against the baseline forecast at a chosen cutoff month.
- Runs a simple monthly enrollment forecast.
- Shows monthly enrollment, cumulative enrollment, forecasted LPI, target comparison, and KPI cards.

## Save and load forecast files
- Click **Save** in the dashboard header to download the current forecast setup as a JSON file.
- Click **Load** to import a previously saved JSON file and restore study inputs, countries, sites, and scenarios.
- After loading, review values and click **Run Forecast** if you want to immediately refresh outputs.

## Site CSV import
- In **Site Information**, click **Download Site CSV Template** to get the required columns.
- Click **Export Sites CSV** to download your current site table for updates or backup.
- Fill in your site updates and click **Import Sites CSV**.
- Rows are matched by `site_key` (or `country` + `site_number`) against sites already defined in Country Information.
- Import updates PI/site name, activation date, ER mode/rate, max participants, current enrollment, and include flag.

## Scenario generator
- In **Scenario Engine**, click **Generate Best Add-On** to automatically test countries currently not included in the forecast.
- The generator chooses the country combination that reaches target enrollment fastest (and uses fewer countries when tied).

## Next build step
After this prototype looks right, the logic can be moved into a real app stack such as:
- ASP.NET Core / Blazor + Azure App Service + Azure SQL, or
- React + API + Azure SQL.
