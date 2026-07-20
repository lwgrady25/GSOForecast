const allCountries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Estonia',
  'EU',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kingdom of Saudi Arabia',
  'Kuwait',
  'Laos',
  'Latvia',
  'Lebanon',
  'Libya',
  'Lithuania',
  'Luxembourg',
  'Malaysia',
  'Maldives',
  'Malta',
  'Mexico',
  'Monaco',
  'Mongolia',
  'Morocco',
  'Myanmar',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Nigeria',
  'North Korea',
  'Norway',
  'Oman',
  'Pakistan',
  'Panama',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Thailand',
  'Turkey',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];

function populateCountryDatalist() {
  const datalist =
    document.getElementById('countryOptions');

  if (!datalist) {
    return;
  }

  datalist.innerHTML = allCountries
    .sort()
    .map(country =>
      `<option value="${country}"></option>`
    )
    .join('');
}

const historicalApprovalDays = [
  { country: 'Australia', approvalDays: 54 },
  { country: 'Belgium', approvalDays: 167 },
  { country: 'Brazil', approvalDays: 186 },
  { country: 'Canada', approvalDays: 46 },
  { country: 'EU', approvalDays: 102 },
  { country: 'France', approvalDays: 113 },
  { country: 'Germany', approvalDays: 127 },
  { country: 'Hungary', approvalDays: 105 },
  { country: 'Israel', approvalDays: 292 },
  { country: 'Italy', approvalDays: 146 },
  { country: 'Japan', approvalDays: 30 },
  { country: 'Kingdom of Saudi Arabia', approvalDays: 182 },
  { country: 'Malaysia', approvalDays: 102 },
  { country: 'Netherlands', approvalDays: 187 },
  { country: 'Qatar', approvalDays: 46 },
  { country: 'Singapore', approvalDays: 62 },
  { country: 'South Africa', approvalDays: 109 },
  { country: 'South Korea', approvalDays: 98 },
  { country: 'Spain', approvalDays: 118 },
  { country: 'Taiwan', approvalDays: 83 },
  { country: 'Thailand', approvalDays: 129 },
  { country: 'Turkey', approvalDays: 152 },
  { country: 'United Kingdom', approvalDays: 78 },
  { country: 'United Arab Emirates', approvalDays: 36 },
  { country: 'United States', approvalDays: 60 }
];

const COUNTRY_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#0891b2', '#be185d', '#65a30d', '#ea580c', '#0f766e',
  '#6d28d9', '#b45309', '#0284c7', '#9f1239', '#166534'
];

const SCENARIO_COLORS = [
  '#16a34a', '#ea580c', '#7c3aed', '#0891b2',
  '#be185d', '#ca8a04', '#0f172a', '#b91c1c'
];

let countryAssumptions = [];

let sites = [];

let scenarios = [];
let nextScenarioId = 1;


function formatDate(value) {
  if (!value) return '--';

  const d = value instanceof Date
    ? value
    : new Date(value + 'T00:00:00');

  if (Number.isNaN(d.getTime())) {
    return '--';
  }

  const day = String(d.getDate()).padStart(2, '0');

  const month = d.toLocaleDateString('en-US', {
    month: 'short'
  });

  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatDateForInput(dateObject) {
  if (!dateObject || Number.isNaN(dateObject.getTime())) {
    return '';
  }

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(value) {
  if (!value) return '';

  const dateObject = value instanceof Date ? value : parseDateInput(value);

  if (!dateObject || Number.isNaN(dateObject.getTime())) {
    return '';
  }

  return formatDate(dateObject);
}

function normalizeDateInputValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return '';
  }

  const parsedDate = parseDateInput(trimmedValue);

  if (!parsedDate) {
    return trimmedValue;
  }

  return formatDateForInput(parsedDate);
}

function parseDateInput(value) {
  if (!value) {
    return null;
  }

  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return null;
  }

  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthNameMatch = trimmedValue.match(/^(\d{1,2})[-/.](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[-/.](\d{4})$/i);

  if (monthNameMatch) {
    const [, day, monthName, year] = monthNameMatch;
    const monthIndex = monthNames.indexOf(monthName.toLowerCase());

    if (monthIndex >= 0) {
      return new Date(Number(year), monthIndex, Number(day));
    }
  }

 const slashDateMatch = trimmedValue.match(
  /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/
);

if (slashDateMatch) {
  const [, month, day, year] = slashDateMatch;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
}

  const hyphenParts = trimmedValue.split('-').map(part => Number(part));

  if (hyphenParts.length === 3 && hyphenParts.every(part => !Number.isNaN(part))) {
    const [year, month, day] = hyphenParts;
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(trimmedValue + 'T00:00:00');

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function addDays(dateObject, days) {
  const nextDate = new Date(dateObject);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function monthDiff(start, end) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

function setTextIfExists(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function setValueIfExists(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value;
  }
}

function getNumberValue(id, fallbackValue) {
  const element = document.getElementById(id);

  if (!element) {
    return fallbackValue;
  }

  return Number(element.value || fallbackValue);
}

function getTextValue(id, fallbackValue) {
  const element = document.getElementById(id);

  if (!element) {
    return fallbackValue;
  }

  return element.value || fallbackValue;
}

function getScreenFailRatePercent() {
  return getNumberValue('screenFailRateKPI', 0);
}

function calculateParticipantsWithScreenFail(participantsPerCountry) {
  const rate = getScreenFailRatePercent() / 100;
  return Math.round(participantsPerCountry * (1 - rate));
}

function getHistoricalApprovalDays(countryName) {
  if (!countryName) {
    return null;
  }

  const match = historicalApprovalDays.find(entry =>
    entry.country.toLowerCase() === String(countryName).trim().toLowerCase()
  );

  return match ? match.approvalDays : null;
}

function resolveApprovalDays(countryItem) {
  if (!countryItem || !countryItem.country) {
    return 0;
  }

  const historicalDays = getHistoricalApprovalDays(countryItem.country);

  if (historicalDays !== null) {
    return Number(historicalDays);
  }

  const hasApprovalDays = countryItem.approvalDays !== null && countryItem.approvalDays !== undefined && countryItem.approvalDays !== '';
  return hasApprovalDays ? Number(countryItem.approvalDays) : 0;
}

function getGlobalEnrollmentRateValue() {
return Number(getNumberValue('globalEnrollmentRateKPI', 0) || 0);
}

function getDerivedSiteEr(countryItem) {
  return Number(countryItem.countryEr || 0);
}

function calculateSiteMaxParticipants(countryItem, siteIndex, siteCount) {
  const totalParticipants = calculateParticipantsWithScreenFail(Number(countryItem.participantsPerCountry || 0));
  const count = Math.max(1, Number(siteCount || 0));
  const base = Math.floor(totalParticipants / count);
  const remainder = totalParticipants % count;
  return siteIndex < remainder ? base + 1 : base;
}

function buildSiteRows() {
  const previousSitesByKey = new Map(
    (sites || []).map(site => [`${site.country}|${site.site}`, site])
  );

  const nextSites = [];

  countryAssumptions.forEach(country => {
    if (!country.country) {
      return;
    }

    const siteCount = Math.max(0, Number(country.siteCount || 0));
    const effectiveApprovalDays = resolveApprovalDays(country);
    const effectiveEstimatedApprovalDate = calculateEstimatedApprovalDate(
      country.submissionDate,
      effectiveApprovalDays
    );

    const parsedEstimatedApprovalDate =
      parseDateInput(effectiveEstimatedApprovalDate);

    const averageTimeToActivateSite =
      Number(country.averageTimeToActivateSite || 0);

    for (let siteIndex = 0; siteIndex < siteCount; siteIndex += 1) {
      const siteNumber = siteIndex + 1;
      const siteName = `${country.country}${siteNumber}`;
      const key = `${country.country}|${siteName}`;
      const previousSite = previousSitesByKey.get(key);

      const activationDate = parsedEstimatedApprovalDate
        ? addDays(
            parsedEstimatedApprovalDate,
            averageTimeToActivateSite * (siteIndex + 1)
          )
        : null;

      const derivedActivationValue =
        previousSite && previousSite.activation
          ? previousSite.activation
          : activationDate
            ? formatDateForInput(activationDate)
            : '';

      const currentErMode =
        previousSite?.siteErMode || 'Global';

      let derivedErValue;

      if (currentErMode === 'Global') {
        derivedErValue = getGlobalEnrollmentRateValue();
      } else if (currentErMode === 'Custom') {
        // Preserve whatever the user manually entered
        derivedErValue = previousSite?.er ?? 0;
      } else {
        // Country mode — use country ER directly
        derivedErValue = getDerivedSiteEr(country);
      }

      const derivedMaxValue =
        calculateSiteMaxParticipants(
          country,
          siteIndex,
          siteCount
        );

      nextSites.push({
        include: Boolean(country.initialCountry),
        country: country.country,
        site: siteName,
        activation: derivedActivationValue,
        siteErMode: currentErMode,
        er: derivedErValue,
        max: derivedMaxValue,
        currentEnrollment:
          previousSite?.currentEnrollment || 0
      });
    }
  });

  sites = nextSites;
  return sites;
}

function refreshEstimatedApprovalCell(row, currentItem) {
  const derivedCell = row && row.querySelector('[data-derived="estimatedApproval"]');

  if (derivedCell) {
    const approvalDays = resolveApprovalDays(currentItem);
    derivedCell.textContent = formatDate(calculateEstimatedApprovalDate(currentItem.submissionDate, approvalDays));
  }
}

function handleHistoricalApprovalInputChange(event) {
  const { field, index } = event.target.dataset;

  if (!field || index === undefined) {
    return;
  }

  const rowIndex = Number(index);
  const currentItem = historicalApprovalDays[rowIndex];

  if (!currentItem) {
    return;
  }

  const value = field === 'approvalDays' ? Number(event.target.value) : event.target.value;
  currentItem[field] = value;

  renderCountryAssumptionsTable();
  renderHistoricalApprovalTable();
  renderSiteActivationTimeline();
}

function addHistoricalApprovalRow() {
  historicalApprovalDays.push({
    country: '',
    approvalDays: 0
  });

  renderHistoricalApprovalTable();
  renderSiteActivationTimeline();
}

function updateStudyTitle() {
  const studyName =
    document.getElementById('studyName')?.value?.trim();

  const title =
    document.getElementById('studyTitle');

  if (!title) {
    return;
  }

  title.textContent = studyName
    ? `${studyName} Enrollment Forecast`
    : 'Enrollment Forecast';
}

function renderHistoricalApprovalTable() {
  const body = document.getElementById('historicalApprovalTable');

  if (!body) {
    return;
  }

  body.innerHTML = '';

  historicalApprovalDays.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" value="${entry.country}" data-field="country" data-index="${index}" /></td>
      <td><input type="number" step="1" value="${entry.approvalDays}" data-field="approvalDays" data-index="${index}" /></td>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll('input').forEach(element => {
    element.addEventListener('change', handleHistoricalApprovalInputChange);
    element.addEventListener('blur', handleHistoricalApprovalInputChange);
  });

  renderSiteActivationTimeline();
}

function calculateEstimatedApprovalDate(submissionDate, approvalDays) {
  if (!submissionDate) {
    return '';
  }

  const baseDate = new Date(submissionDate + 'T00:00:00');

  if (Number.isNaN(baseDate.getTime())) {
    return '';
  }

  const calculatedDate = addDays(baseDate, Number(approvalDays) || 0);
  return formatDateForInput(calculatedDate);
}

function calculateTargetSubmissionDateForFps(countryItem) {
  const targetFpsDateValue = getTextValue('targetFpsDateKPI', '');
  const screeningWindow = getNumberValue('screeningWindowKPI', 0);
  const parsedTargetFpsDate = parseDateInput(targetFpsDateValue);

  if (!parsedTargetFpsDate) {
    return '';
  }

  const approvalDays = resolveApprovalDays(countryItem);
  const submissionDate = new Date(parsedTargetFpsDate);
  const adjustedDate = addDays(submissionDate, -(screeningWindow + approvalDays));
  return formatDateForInput(adjustedDate);
}

function handleCountryAssumptionInputChange(event) {
  const { field, index } = event.target.dataset;

  if (!field || index === undefined) {
    return;
  }

  const rowIndex = Number(index);
  const currentItem = countryAssumptions[rowIndex];

  if (!currentItem) {
    return;
  }

  let value = event.target.value;

  if (field === 'initialCountry') {
    value = value === 'true';
  } else if (field === 'submissionDate') {
    value = normalizeDateInputValue(value);
  } else if (['countryEr', 'participantsPerCountry', 'siteCount', 'approvalDays', 'averageTimeToActivateSite'].includes(field)) {
    value = Number(value);
  }

  currentItem[field] = value;

  if (field === 'country') {
    const historicalDays = getHistoricalApprovalDays(value);

    if (historicalDays !== null) {
      currentItem.approvalDays = historicalDays;
    }
  }

  renderCountryAssumptionsTable();
  renderSiteActivationTimeline();
  renderSiteTable();
}

function addCountryAssumptionRow() {
  countryAssumptions.push({
    country: '',
    initialCountry: false,
    countryEr: 0,
    participantsPerCountry: 0,
    siteCount: 0,
    averageTimeToActivateSite: 0,
    submissionDate: '',
    approvalDays: null
  });

  renderCountryAssumptionsTable();
  renderSiteTable();
}

function calculateSiteActivationTimelineDates(countryItem) {
  const siteCount = Number(countryItem.siteCount || 0);
  const averageTimeToActivateSite = Number(countryItem.averageTimeToActivateSite || 0);
  const effectiveApprovalDays = resolveApprovalDays(countryItem);
  const estimatedApprovalDate = calculateEstimatedApprovalDate(countryItem.submissionDate, effectiveApprovalDays);

  if (!estimatedApprovalDate || siteCount <= 0) {
    return [];
  }

  const parsedEstimatedApprovalDate = parseDateInput(estimatedApprovalDate);

  if (!parsedEstimatedApprovalDate) {
    return [];
  }

  return Array.from({ length: siteCount }, (_, index) => {
    const nextDate = addDays(parsedEstimatedApprovalDate, averageTimeToActivateSite * (index + 1));
    return formatDate(nextDate);
  });
}

function renderSiteActivationTimeline() {
  const head = document.getElementById('siteActivationTimelineHead');
  const body = document.getElementById('siteActivationTimelineTable');

  if (!head || !body) {
    return;
  }

  head.innerHTML = '';
  body.innerHTML = '';

  const maxSiteCount = Math.max(
    1,
    ...countryAssumptions.map(country => Number(country.siteCount || 0))
  );

  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Country</th>
    <th>Estimated Approval</th>
    <th>Site Count</th>
    ${Array.from({ length: maxSiteCount }, (_, index) => `<th>Site ${index + 1}</th>`).join('')}
  `;
  head.appendChild(headerRow);

  countryAssumptions.forEach(country => {
    const row = document.createElement('tr');
    const timelineDates = calculateSiteActivationTimelineDates(country);
    const estimatedApprovalValue = calculateEstimatedApprovalDate(country.submissionDate, resolveApprovalDays(country));

    row.innerHTML = `
      <td>${country.country || ''}</td>
      <td>${estimatedApprovalValue ? formatDate(estimatedApprovalValue) : ''}</td>
      <td>${country.siteCount || ''}</td>
      ${Array.from({ length: maxSiteCount }, (_, index) => {
        const value = timelineDates[index] || '';
        return `<td>${value}</td>`;
      }).join('')}
    `;

    body.appendChild(row);
  });
}

function renderCountryAssumptionsTable() {
  const body = document.getElementById('countryAssumptionsTable');

  if (!body) {
    return;
  }

  body.innerHTML = '';

  countryAssumptions.forEach((country, index) => {
    const row = document.createElement('tr');
    const effectiveApprovalDays = resolveApprovalDays(country);
    const participantsWithScreenFail = calculateParticipantsWithScreenFail(country.participantsPerCountry || 0);
    const estimatedApproval = calculateEstimatedApprovalDate(country.submissionDate, effectiveApprovalDays);
    const targetSubmissionDateForFps = calculateTargetSubmissionDateForFps(country);

    row.innerHTML = `
    <td>
  <input
    type="text"
    list="countryOptions"
    value="${country.country}"
    data-field="country"
    data-index="${index}" />
</td>
      <td>
        <select data-field="initialCountry" data-index="${index}">
          <option value="true" ${country.initialCountry ? 'selected' : ''}>Yes</option>
          <option value="false" ${!country.initialCountry ? 'selected' : ''}>No</option>
        </select>
      </td>
      <td><input type="number" step="0.01" value="${country.countryEr}" data-field="countryEr" data-index="${index}" /></td>
      <td><input type="number" step="1" value="${country.participantsPerCountry}" data-field="participantsPerCountry" data-index="${index}" /></td>
      <td data-derived="participantsWithScreenFail">${participantsWithScreenFail}</td>
      <td><input type="number" step="1" value="${country.siteCount}" data-field="siteCount" data-index="${index}" /></td>
      <td><input type="number" step="1" value="${country.averageTimeToActivateSite || ''}" data-field="averageTimeToActivateSite" data-index="${index}" /></td>
      <td><input type="text" value="${country.submissionDate ? formatDateForDisplay(country.submissionDate) : ''}" placeholder="DD-MMM-YYYY" data-field="submissionDate" data-index="${index}" /></td>
      <td data-derived="estimatedApproval">${estimatedApproval ? formatDate(estimatedApproval) : ''}</td>
      <td data-derived="targetSubmissionDateForFps">${targetSubmissionDateForFps ? formatDate(targetSubmissionDateForFps) : ''}</td>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', handleCountryAssumptionInputChange);
    element.addEventListener('blur', handleCountryAssumptionInputChange);
  });

  renderSiteActivationTimeline();

  renderScenarioList();
}

function addScenario() {
  scenarios.push({
    id: nextScenarioId++,
    name: '',
    enabled: true,
    screenFailRate: 0,
    enrollmentRate: 0,
    activationTimingAdjustment: 0,
    selectedCountries: []
  });
  renderScenarioList();
  runForecast();
}

function removeScenario(id) {
  scenarios = scenarios.filter(s => s.id !== id);
  renderScenarioList();
  runForecast();
}

function handleScenarioFieldChange(event) {
  const id = Number(event.target.dataset.scenarioId);
  if (!id) return;
  const scenario = scenarios.find(s => s.id === id);
  if (!scenario) return;

  const field = event.target.dataset.field;

  if (field === 'enabled') {
    scenario.enabled = event.target.checked;
  } else if (field === 'name') {
    scenario.name = event.target.value;
    return; // no need to re-run forecast for name-only change
  } else if (field === 'screenFailRate' || field === 'enrollmentRate' || field === 'activationTimingAdjustment') {
    scenario[field] = Number(event.target.value || 0);
  }

  // Always re-collect selected countries from DOM for this scenario
  scenario.selectedCountries = Array.from(
    document.querySelectorAll(`.scenario-country-cb[data-scenario-id="${id}"]:checked`)
  ).map(cb => cb.value);

  runForecast();
}

function renderScenarioList() {
  const container = document.getElementById('scenarioList');
  if (!container) return;

  if (scenarios.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);font-size:14px;margin-top:8px;">No scenarios yet — click "+ Add Scenario" to get started.</p>';
    return;
  }

  const nonInitialCountries = countryAssumptions.filter(c => c.country && !c.initialCountry);

  container.innerHTML = scenarios.map((sc, i) => {
    const color = SCENARIO_COLORS[i % SCENARIO_COLORS.length];

    const countriesHtml = nonInitialCountries.length > 0
      ? nonInitialCountries.map(c => `
          <label class="scenario-country-label">
            <input type="checkbox"
              class="scenario-country-cb"
              data-scenario-id="${sc.id}"
              value="${c.country}"
              ${sc.selectedCountries.includes(c.country) ? 'checked' : ''}>
            ${c.country}
          </label>`).join('')
      : '<span style="font-size:13px;color:var(--muted);">No non-initial countries defined.</span>';

    return `
      <div class="panel scenario-card" style="margin-bottom:16px;border-left:5px solid ${color};">
        <div class="scenario-card-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="scenario-color-dot" style="background:${color};"></span>
            <input type="text"
              class="scenario-field scenario-name-input"
              data-scenario-id="${sc.id}"
              data-field="name"
              value="${sc.name}"
              placeholder="Scenario ${i + 1}" />
            <label class="scenario-enable-label">
              <input type="checkbox"
                class="scenario-field"
                data-scenario-id="${sc.id}"
                data-field="enabled"
                ${sc.enabled ? 'checked' : ''}>
              Enabled
            </label>
          </div>
          <button class="scenario-remove-btn" data-scenario-id="${sc.id}">Remove</button>
        </div>

        <div class="form-grid" style="margin:14px 0;">
          <label>Screen Fail Rate (%)
            <input type="number" step="0.1"
              class="scenario-field"
              data-scenario-id="${sc.id}"
              data-field="screenFailRate"
              value="${sc.screenFailRate}" />
          </label>
          <label>Enrollment Rate
            <input type="number" step="0.01"
              class="scenario-field"
              data-scenario-id="${sc.id}"
              data-field="enrollmentRate"
              value="${sc.enrollmentRate}" />
          </label>
          <label>Site Activation Timing Adjustment (Days)
            <input type="number" step="1"
              class="scenario-field"
              data-scenario-id="${sc.id}"
              data-field="activationTimingAdjustment"
              value="${sc.activationTimingAdjustment}" />
          </label>
        </div>

        ${nonInitialCountries.length > 0 ? `
          <div>
            <p class="scenario-countries-label">Additional Countries to Include</p>
            <div class="scenario-countries-grid">${countriesHtml}</div>
          </div>` : ''}
      </div>`;
  }).join('');

  container.querySelectorAll('.scenario-field').forEach(el => {
    el.addEventListener('input', handleScenarioFieldChange);
    el.addEventListener('change', handleScenarioFieldChange);
  });

  container.querySelectorAll('.scenario-country-cb').forEach(cb => {
    cb.addEventListener('change', handleScenarioFieldChange);
  });

  container.querySelectorAll('.scenario-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeScenario(Number(btn.dataset.scenarioId)));
  });
}

function renderSiteTable() {
  buildSiteRows();

  const body = document.getElementById('siteTable');

  if (!body) {
    return;
  }

  body.innerHTML = '';

  sites.forEach((site, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
  <td>
    <input type="checkbox"
      ${site.include ? 'checked' : ''}
      data-field="include"
      data-index="${index}" />
  </td>

  <td>${site.country}</td>

  <td>${site.site}</td>

  <td>
    <input
      type="text"
      value="${site.activation ? formatDateForDisplay(site.activation) : ''}"
      placeholder="DD-MMM-YYYY"
      data-field="activation"
      data-index="${index}" />
  </td>

  <td>
    <select
      data-field="siteErMode"
      data-index="${index}">
      <option value="Country"
        ${(site.siteErMode || 'Global') === 'Country' ? 'selected' : ''}>
        Country
      </option>
      <option value="Global"
        ${(site.siteErMode || 'Global') === 'Global' ? 'selected' : ''}>
        Global
      </option>
      <option value="Custom"
        ${site.siteErMode === 'Custom' ? 'selected' : ''}>
        Custom
      </option>
    </select>
  </td>

  <td>
    <input
      type="number"
      step="0.01"
      value="${site.er}"
      data-field="er"
      data-index="${index}"
      ${(site.siteErMode || 'Global') !== 'Custom' ? 'readonly style="background:#f8fafc;color:#667085;"' : ''} />
  </td>

  <td>
    <input
      type="number"
      value="${site.max}"
      data-field="max"
      data-index="${index}" />
  </td>

  <td>
    <input
      type="number"
      value="${site.currentEnrollment || 0}"
      data-field="currentEnrollment"
      data-index="${index}" />
  </td>
`;

    body.appendChild(row);
  });

  body.querySelectorAll('input, select').forEach(input => {
  input.addEventListener('change', event => {
    const index = Number(event.target.dataset.index);
    const field = event.target.dataset.field;

    if (field === 'include') {
      sites[index][field] = event.target.checked;

    } else if (field === 'siteErMode') {
      const newMode = event.target.value;
      sites[index].siteErMode = newMode;
      const countryData = countryAssumptions.find(
        country => country.country === sites[index].country
      );

      if (newMode === 'Global') {
        sites[index].er = getNumberValue('globalEnrollmentRateKPI', 0);
      } else if (newMode === 'Country') {
        sites[index].er = Number(countryData?.countryEr || 0);
      }
      // Custom: keep the existing er value as the starting point

      // Re-render so the readonly state on the ER field updates
      renderSiteTable();

    } else if (field === 'er') {
      // Only accept manual edits when in Custom mode
      if (sites[index].siteErMode === 'Custom') {
        sites[index][field] = Number(event.target.value);
      }
    } else if (field === 'max' || field === 'currentEnrollment') {
      sites[index][field] = Number(event.target.value);
    } else if (field === 'activation') {
      sites[index][field] = normalizeDateInputValue(event.target.value);
    } else {
      sites[index][field] = event.target.value;
    }

    // Re-render table for include toggles (siteErMode re-renders inline above)
    if (field === 'include') {
      renderSiteTable();
    }
    runForecast();
  });
});
}

function roundEnrollment(value) {
return Math.round((Number(value) || 0) * 10) / 10;
}
function formatEnrollment(value) {
const rounded = roundEnrollment(value);
if (Number.isInteger(rounded)) {
return String(rounded);
}
return rounded.toFixed(1);
}
function calculateMonthlySiteEnrollment(site, monthValue, enrolledAtSite) {
  const activation = parseDateInput(site.activation);

  if (!activation) {
    return 0;
  }

  const siteMax = Number(site.max || 0);
  const monthlyRate = Number(site.er || 0);

  if (siteMax <= 0) {
    return 0;
  }

  const screeningWindow = getNumberValue(
  'screeningWindowKPI',
  0
);

  const activationPlusScreening = addDays(
    activation,
    screeningWindow
  );

  const startMonth = new Date(
    activationPlusScreening.getFullYear(),
    activationPlusScreening.getMonth(),
    1
  );

  const monthDate = new Date(monthValue + 'T00:00:00');

  const remaining = Math.max(
    0,
    siteMax - enrolledAtSite
  );

  if (monthDate < startMonth || remaining <= 0) {
    return 0;
  }

  const calculatedEnrollment = Math.round(
    remaining * monthlyRate
  );

  const monthlyEnrollment = Math.min(
    remaining,
    Math.max(1, calculatedEnrollment)
  );

  return monthlyEnrollment;
}
function getSiteEnrollmentStartMonth(site) {
  const activation = parseDateInput(site.activation);

  if (!activation) {
    return null;
  }

  const screeningWindow =
    getNumberValue('screeningWindowKPI', 0);

  const activationPlusScreening =
    addDays(activation, screeningWindow);

  return new Date(
    activationPlusScreening.getFullYear(),
    activationPlusScreening.getMonth(),
    1
  );
}

function formatMonthForForecast(dateObject) {
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}-01`;
}

function addForecastMonths(dateObject, monthsToAdd) {
  const result = new Date(dateObject);

  result.setMonth(
    result.getMonth() + monthsToAdd
  );

  return result;
}

function generateForecastMonths(
  includedSites,
  targetLpiValue
) {
  const siteStartDates = includedSites
    .map(site => getSiteEnrollmentStartMonth(site))
    .filter(date => date);

  if (siteStartDates.length === 0) {
    return [];
  }

  const firstForecastMonth =
    new Date(
      Math.min(
        ...siteStartDates.map(date =>
          date.getTime()
        )
      )
    );

  const parsedTargetLpi =
    parseDateInput(targetLpiValue);

  const lastForecastMonth =
    parsedTargetLpi
      ? new Date(
          parsedTargetLpi.getFullYear(),
          parsedTargetLpi.getMonth(),
          1
        )
      : addForecastMonths(
          firstForecastMonth,
          24
        );

  const forecastMonths = [];

  let currentMonth =
    new Date(firstForecastMonth);

  while (currentMonth <= lastForecastMonth) {

    forecastMonths.push(
      formatMonthForForecast(
        currentMonth
      )
    );

    currentMonth =
      addForecastMonths(
        currentMonth,
        1
      );
  }

  return forecastMonths;
}

function calculateCountryContributions(forecastMonths) {
  const countryTotals = {};

  const includedSites =
    sites.filter(site => site.include);

  includedSites.forEach(site => {
    let enrolledAtSite =
      Number(site.currentEnrollment || 0);

    let siteTotal =
      Number(site.currentEnrollment || 0);

    forecastMonths.forEach(month => {
      const monthlyIncrement =
        calculateMonthlySiteEnrollment(
          site,
          month,
          enrolledAtSite
        );

      enrolledAtSite += monthlyIncrement;
      siteTotal += monthlyIncrement;
    });

    if (!countryTotals[site.country]) {
      countryTotals[site.country] = 0;
    }

    countryTotals[site.country] += siteTotal;
  });

  return Object.entries(countryTotals)
    .map(([country, total]) => ({
      country,
      total: roundEnrollment(total)
    }))
    .filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);
}

function renderCountryContributionChart(countryContributions) {
  const chart =
    document.getElementById('countryContributionChart');

  if (!chart) {
    return;
  }

  chart.innerHTML = '';

  if (!countryContributions || countryContributions.length === 0) {
    chart.innerHTML =
      '<p class="empty-chart-message">No country contribution data to display.</p>';

    return;
  }

  const width = 900;
  const rowHeight = 38;
  const height =
    Math.max(220, countryContributions.length * rowHeight + 60);

  const padding = {
    top: 25,
    right: 90,
    bottom: 25,
    left: 180
  };

  const chartWidth =
    width - padding.left - padding.right;

  const maxValue = Math.max(
    ...countryContributions.map(item => Number(item.total || 0)),
    1
  );

  const bars = countryContributions.map((item, index) => {
    const y =
      padding.top + index * rowHeight;

    const barWidth =
      (Number(item.total || 0) / maxValue) * chartWidth;

    const valueLabel =
      typeof formatEnrollment === 'function'
        ? formatEnrollment(item.total)
        : item.total;

    return `
      <text
        x="${padding.left - 12}"
        y="${y + 21}"
        class="country-chart-label">
        ${item.country}
      </text>

      <rect
        x="${padding.left}"
        y="${y}"
        width="${barWidth}"
        height="24"
        class="country-chart-bar">
      </rect>

      <text
        x="${padding.left + barWidth + 8}"
        y="${y + 18}"
        class="country-chart-value">
        ${valueLabel}
      </text>
    `;
  }).join('');

  chart.innerHTML = `
    <svg
      class="country-chart-svg"
      viewBox="0 0 ${width} ${height}"
      role="img"
      aria-label="Country contribution chart">

      <text
        x="${padding.left}"
        y="16"
        class="country-chart-title">
        Projected Enrollment by Country
      </text>

      ${bars}
    </svg>
  `;
}
function getSiteActivationMonth(site) {
  const activation =
    parseDateInput(site.activation);

  if (!activation) {
    return null;
  }

  return new Date(
    activation.getFullYear(),
    activation.getMonth(),
    1
  );
}

function generateSiteActivationMonths(
  includedSites,
  targetLpiValue
) {
  const activationDates = includedSites
    .map(site => getSiteActivationMonth(site))
    .filter(date => date);

  if (activationDates.length === 0) {
    return [];
  }

  const firstActivationMonth =
    new Date(
      Math.min(
        ...activationDates.map(date =>
          date.getTime()
        )
      )
    );

  const parsedTargetLpi =
    parseDateInput(targetLpiValue);

  const lastActivationMonth =
    parsedTargetLpi
      ? new Date(
          parsedTargetLpi.getFullYear(),
          parsedTargetLpi.getMonth(),
          1
        )
      : addForecastMonths(
          firstActivationMonth,
          24
        );

  const activationMonths = [];

  let currentMonth =
    new Date(firstActivationMonth);

  while (currentMonth <= lastActivationMonth) {
    activationMonths.push(
      formatMonthForForecast(currentMonth)
    );

    currentMonth =
      addForecastMonths(
        currentMonth,
        1
      );
  }

  return activationMonths;
}

function calculateSiteActivationCurve(
  includedSites,
  targetLpiValue
) {
  const activationMonths =
    generateSiteActivationMonths(
      includedSites,
      targetLpiValue
    );

  return activationMonths.map(month => {
    const monthDate =
      new Date(month + 'T00:00:00');

    const activeSites =
      includedSites.filter(site => {
        const activationMonth =
          getSiteActivationMonth(site);

        return (
          activationMonth &&
          activationMonth <= monthDate
        );
      }).length;

    return {
      month,
      activeSites
    };
  });
}

function renderSiteActivationCurveChart(
  activationCurve
) {
  const chart =
    document.getElementById(
      'siteActivationCurveChart'
    );

  if (!chart) {
    return;
  }

  chart.innerHTML = '';

  if (!activationCurve || activationCurve.length === 0) {
    chart.innerHTML =
      '<p class="empty-chart-message">No site activation data to display.</p>';

    return;
  }

 const width = Math.max(
  1400,
  activationCurve.length * 65
);

  const height = 360;

  const padding = {
    top: 35,
    right: 40,
    bottom: 70,
    left: 60
  };

  const chartWidth =
    width - padding.left - padding.right;

  const chartHeight =
    height - padding.top - padding.bottom;

  const maxSites = Math.max(
    ...activationCurve.map(row =>
      Number(row.activeSites || 0)
    ),
    1
  );

  const xStep =
    chartWidth /
    Math.max(1, activationCurve.length - 1);

  function getX(index) {
    return padding.left + index * xStep;
  }

  function getY(value) {
    return (
      padding.top +
      chartHeight -
      (value / maxSites) * chartHeight
    );
  }

  const activationPoints =
    activationCurve
      .map((row, index) => {
        return `${getX(index)},${getY(row.activeSites)}`;
      })
      .join(' ');

  const xLabels =
    activationCurve
      .map((row, index) => {
        const x = getX(index);
        const y = height - 30;

        return `
          <text
            x="${x}"
            y="${y}"
            class="site-activation-x-label"
            transform="rotate(-45 ${x} ${y})">
            ${formatMonthLabel(row.month)}
          </text>
        `;
      })
      .join('');

  const valueLabels =
    activationCurve
      .map((row, index) => {
        const x = getX(index);
        const y = getY(row.activeSites) - 8;

        return `
          <text
            x="${x}"
            y="${y}"
            class="site-activation-value-label">
            ${row.activeSites}
          </text>
        `;
      })
      .join('');

  const dots =
    activationCurve
      .map((row, index) => {
        return `
          <circle
            cx="${getX(index)}"
            cy="${getY(row.activeSites)}"
            r="4"
            class="site-activation-dot">
          </circle>
        `;
      })
      .join('');

  chart.innerHTML = `
    <svg
      class="site-activation-svg"
      viewBox="0 0 ${width} ${height}"
      role="img"
      aria-label="Site activation curve">

      <line
        x1="${padding.left}"
        y1="${padding.top + chartHeight}"
        x2="${width - padding.right}"
        y2="${padding.top + chartHeight}"
        class="chart-axis">
      </line>

      <line
        x1="${padding.left}"
        y1="${padding.top}"
        x2="${padding.left}"
        y2="${padding.top + chartHeight}"
        class="chart-axis">
      </line>

      <polyline
        points="${activationPoints}"
        class="site-activation-line">
      </polyline>

      ${dots}

      ${valueLabels}

      ${xLabels}

      <text
        x="${padding.left}"
        y="18"
        class="site-activation-title">
        Cumulative Active Sites
      </text>
    </svg>
  `;
}
function buildScenarioSitesForScenario(scenario) {
  if (!scenario.enabled) {
    return [];
  }

  const selectedCountries = scenario.selectedCountries || [];

  const scenarioSites = sites
    .filter(site => site.include || selectedCountries.includes(site.country))
    .map(site => {
      const scenarioSite = { ...site };

      if (selectedCountries.includes(site.country)) {
        scenarioSite.include = true;
      }

      const baseScreenFail = getNumberValue('screenFailRateKPI', 0);
      const scenarioScreenFail = scenario.screenFailRate > 0
        ? Number(scenario.screenFailRate)
        : baseScreenFail;

      const countryInfo = countryAssumptions.find(c => c.country === site.country);

      if (countryInfo) {
        const participants = Number(countryInfo.participantsPerCountry || 0);
        const siteCount = Math.max(1, Number(countryInfo.siteCount || 1));
        scenarioSite.max = Math.round(participants * (1 - scenarioScreenFail / 100) / siteCount);
      }

      if (scenario.enrollmentRate > 0) {
        scenarioSite.er = Number(scenario.enrollmentRate);
      }

      const activationDate = parseDateInput(site.activation);
      if (activationDate) {
        const adjustment = Number(scenario.activationTimingAdjustment || 0);
        scenarioSite.activation = formatDateForInput(
          adjustment === 0 ? activationDate : addDays(activationDate, adjustment)
        );
      }

      return scenarioSite;
    });

  return scenarioSites;
}
function calculateForecastForSites(siteList, forecastMonths, target) {
  const forecast = forecastMonths.map(month => ({
    month,
    monthly: 0,
    cumulative: 0,
    remaining: target
  }));

  const includedSiteList = siteList.filter(site => site.include);

  includedSiteList.forEach(site => {
    let enrolledAtSite = Number(site.currentEnrollment || 0);

    forecast.forEach(row => {
      const monthlyIncrement = calculateMonthlySiteEnrollment(
        site,
        row.month,
        enrolledAtSite
      );

      enrolledAtSite += monthlyIncrement;
      row.monthly += monthlyIncrement;
    });
  });

  let cumulative = includedSiteList.reduce((sum, site) => {
    return sum + Number(site.currentEnrollment || 0);
  }, 0);

  forecast.forEach(row => {
    cumulative += row.monthly;

    row.monthly = roundEnrollment(row.monthly);
    row.cumulative = roundEnrollment(cumulative);
    row.remaining = roundEnrollment(
      Math.max(0, target - cumulative)
    );
  });

  return forecast;
}

function mergeForecastMonths(currentMonths, scenarioMonths) {
  return Array.from(
    new Set([
      ...currentMonths,
      ...scenarioMonths
    ])
  ).sort();
}

 
function runForecast() {
  buildSiteRows();

  const target = getNumberValue('targetEnrollmentKPI', 0);
  const screenFailRate = getNumberValue('screenFailRateKPI', 0);
  const screeningWindow = getNumberValue('screeningWindowKPI', 0);
  const targetFpsDateValue = getTextValue('targetFpsDateKPI', '');
  const targetLpi = getTextValue('targetLpiKPI', '');

  const screenFailDecimal = screenFailRate / 100;

const minimumScreeningsNeeded = screenFailDecimal >= 1

? 0

: Math.ceil(target / (1 - screenFailDecimal));

  const parsedTargetFpsDate = parseDateInput(targetFpsDateValue);
  const parsedTargetLpiDate = parseDateInput(targetLpi);
  const expectedFpiDate = parsedTargetFpsDate
    ? addDays(parsedTargetFpsDate, screeningWindow)
    : null;

  setValueIfExists(
  'minimumScreeningsNeeded',
  minimumScreeningsNeeded
);

setValueIfExists(
  'expectedFpiDate',
  expectedFpiDate ? formatDate(expectedFpiDate) : ''
);
if (parsedTargetFpsDate) {
  setValueIfExists(
    'targetFpsDateKPI',
    formatDate(parsedTargetFpsDate)
  );
}

if (parsedTargetLpiDate) {
  setValueIfExists(
    'targetLpiKPI',
    formatDate(parsedTargetLpiDate)
  );
}
const includedSites =
  sites.filter(site => site.include);

let forecastMonths =
  generateForecastMonths(includedSites, targetLpi);

// Build sites for every enabled scenario and merge their months in
const enabledScenarios = scenarios.filter(s => s.enabled);
const allScenarioSitesList = enabledScenarios.map(s => buildScenarioSitesForScenario(s));

allScenarioSitesList.forEach(scenarioSites => {
  if (scenarioSites.length > 0) {
    forecastMonths = mergeForecastMonths(
      forecastMonths,
      generateForecastMonths(scenarioSites, targetLpi)
    );
  }
});

let forecast =
  calculateForecastForSites(includedSites, forecastMonths, target);

// One forecast result per enabled scenario
const allScenarioForecasts = enabledScenarios
  .map((scenario, i) => {
    const scenarioSites = allScenarioSitesList[i];
    if (scenarioSites.length === 0) return null;
    return {
      name: scenario.name || `Scenario ${i + 1}`,
      color: SCENARIO_COLORS[i % SCENARIO_COLORS.length],
      forecast: calculateForecastForSites(scenarioSites, forecastMonths, target)
    };
  })
  .filter(Boolean);

if (forecast.length === 0) {

  renderForecastTable([], target);

  renderChart([], target, [], null);

  setTextIfExists('kpiProjected', 0);
  setTextIfExists('kpiForecastLpi', 'Target Not Met');
  setTextIfExists('kpiActiveSites', 0);
  renderSiteActivationCurveChart([]);
  renderCountryContributionChart([]);
  renderScenarioComparisonTable(includedSites, [], allScenarioSitesList, allScenarioForecasts, target);
  return;
}

  const lpiRow = forecast.find(row => row.cumulative >= target);
  const activeSites = sites.filter(site => site.include).length;
  const projected = forecast[forecast.length - 1].cumulative;

  let status;
  if (!lpiRow) {
    status = 'Target Not Met';
  } else if (!parsedTargetLpiDate) {
    status = 'On Track';
  } else {
    const forecastLpiDate = new Date(lpiRow.month + 'T00:00:00');
    const diff = monthDiff(forecastLpiDate, parsedTargetLpiDate);
    if (diff > 0) {
      status = `On Track (${diff} month${diff === 1 ? '' : 's'} ahead)`;
    } else if (diff < 0) {
      const behind = Math.abs(diff);
      status = `Behind Target (${behind} month${behind === 1 ? '' : 's'} behind)`;
    } else {
      status = 'On Track (On Target)';
    }
  }

  setTextIfExists('kpiTarget', target);
  setTextIfExists('kpiProjected', formatEnrollment(projected));
  setTextIfExists('kpiTargetLpi', parsedTargetLpiDate ? formatDate(parsedTargetLpiDate) : '--');
  setTextIfExists('kpiForecastLpi', lpiRow ? formatDate(lpiRow.month) : 'Target Not Met');
  setTextIfExists('kpiActiveSites', activeSites);

  const statusElement = document.getElementById('kpiStatus');

  if (statusElement) {
    statusElement.textContent = status;
    statusElement.className =
      status.includes('Behind') || status.includes('Not')
        ? 'status-risk'
        : 'status-good';
  }

renderForecastTable(forecast, target);

const monthlyByCountry = calculateMonthlyByCountry(includedSites, forecastMonths);
renderChart(forecast, target, allScenarioForecasts, monthlyByCountry);

const countryContributions = calculateCountryContributions(forecastMonths);
renderCountryContributionChart(countryContributions);

const activationCurveSites =
  allScenarioSitesList.length > 0 && allScenarioSitesList[0].length > 0
    ? allScenarioSitesList[0]
    : includedSites;

const siteActivationCurve = calculateSiteActivationCurve(activationCurveSites, targetLpi);
renderSiteActivationCurveChart(siteActivationCurve);

renderScenarioComparisonTable(includedSites, forecast, allScenarioSitesList, allScenarioForecasts, target);
}

function renderScenarioComparisonTable(includedSites, baseForecast, allScenarioSitesList, allScenarioForecasts, target) {
  const panel = document.getElementById('scenarioComparisonPanel');
  const body = document.getElementById('scenarioComparisonBody');
  if (!panel || !body) return;

  // Hide the panel if no scenarios exist
  if (allScenarioForecasts.length === 0) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = '';

  function summariseSites(siteList) {
    const filtered = siteList.filter(s => s.include);
    const countries = [...new Set(filtered.map(s => s.country))];
    const totalParticipants = filtered.reduce((sum, s) => sum + Number(s.max || 0), 0);
    return {
      countryCount: countries.length,
      siteCount: filtered.length,
      totalParticipants
    };
  }

  function findLpiRow(forecastRows) {
    return forecastRows.find(row => row.cumulative >= target) || null;
  }

  const baseSummary = summariseSites(includedSites);
  const baseLpiRow = findLpiRow(baseForecast);
  const baseLpiDate = baseLpiRow ? new Date(baseLpiRow.month + 'T00:00:00') : null;

  function diffLabel(scenarioLpiRow) {
    if (!baseLpiRow && !scenarioLpiRow) return { text: '—', cls: '' };
    if (!baseLpiRow) return { text: 'Base misses target', cls: 'status-good' };
    if (!scenarioLpiRow) return { text: 'Misses target', cls: 'status-risk' };

    const scenarioDate = new Date(scenarioLpiRow.month + 'T00:00:00');
    const diff = monthDiff(scenarioDate, baseLpiDate); // positive = scenario is earlier (better)

    if (diff === 0) return { text: 'Same as base', cls: '' };
    if (diff > 0) return { text: `${diff} month${diff === 1 ? '' : 's'} faster`, cls: 'status-good' };
    const behind = Math.abs(diff);
    return { text: `${behind} month${behind === 1 ? '' : 's'} slower`, cls: 'status-risk' };
  }

  // Build base row
  const rows = [];

  rows.push(`
    <tr class="comparison-base-row">
      <td><strong>Base Case</strong></td>
      <td>${baseSummary.countryCount}</td>
      <td>${baseSummary.siteCount}</td>
      <td>${baseSummary.totalParticipants.toLocaleString()}</td>
      <td>${baseLpiRow ? formatDate(baseLpiRow.month) : '<span class="status-risk">Target not met</span>'}</td>
      <td>—</td>
    </tr>
  `);

  // One row per scenario
  allScenarioForecasts.forEach((sf, i) => {
    const scenarioSites = allScenarioSitesList[i] || [];
    const summary = summariseSites(scenarioSites);
    const lpiRow = findLpiRow(sf.forecast);
    const diff = diffLabel(lpiRow);

    const colorDot = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${sf.color};margin-right:6px;"></span>`;

    rows.push(`
      <tr>
        <td>${colorDot}<strong>${sf.name || 'Unnamed'}</strong></td>
        <td>${summary.countryCount}</td>
        <td>${summary.siteCount}</td>
        <td>${summary.totalParticipants.toLocaleString()}</td>
        <td>${lpiRow ? formatDate(lpiRow.month) : '<span class="status-risk">Target not met</span>'}</td>
        <td class="${diff.cls}">${diff.text}</td>
      </tr>
    `);
  });

  body.innerHTML = rows.join('');
}

function renderForecastTable(forecast, target) {
  const body = document.getElementById('forecastTable');

  if (!body) {
    return;
  }

  body.innerHTML = '';

  forecast.forEach(row => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${formatDate(row.month)}</td>
  <td>${formatEnrollment(row.monthly)}</td>
  <td>${formatEnrollment(row.cumulative)}</td>
  <td>${formatEnrollment(row.remaining)}</td>
    `;

    body.appendChild(tr);
  });
}

function formatMonthLabel(monthValue) {
  const date = new Date(monthValue + 'T00:00:00');

  const month = date.toLocaleDateString('en-US', {
    month: 'short'
  });

  const year = date.getFullYear().toString().slice(-2);

  return `${month}-${year}`;
}

function calculateMonthlyByCountry(includedSites, forecastMonths) {
  const siteEnrolled = {};
  includedSites.forEach(site => {
    siteEnrolled[site.site] = Number(site.currentEnrollment || 0);
  });

  return forecastMonths.map(month => {
    const breakdown = {};
    includedSites.forEach(site => {
      const increment = calculateMonthlySiteEnrollment(site, month, siteEnrolled[site.site]);
      siteEnrolled[site.site] += increment;
      if (increment > 0) {
        breakdown[site.country] = (breakdown[site.country] || 0) + increment;
      }
    });
    return { month, breakdown };
  });
}

function renderChart(forecast, target, scenarioForecasts = [], monthlyByCountry = null) {
  const chart = document.getElementById('chart');

  if (!chart) {
    return;
  }

  chart.innerHTML = '';

  if (!forecast || forecast.length === 0) {
    return;
  }

  // Collect ordered country list from breakdown data
  const countries = monthlyByCountry
    ? [...new Set(monthlyByCountry.flatMap(row => Object.keys(row.breakdown)))]
    : [];

  const legendItemsPerRow = 5;
  const legendRows = countries.length > 0 ? Math.ceil(countries.length / legendItemsPerRow) : 0;
  const legendAreaHeight = legendRows > 0 ? legendRows * 22 + 14 : 0;

  const width = Math.max(1400, forecast.length * 65);
  const baseHeight = 600;
  const height = baseHeight + legendAreaHeight;

  const padding = {
    top: 30,
    right: 40,
    bottom: 70,
    left: 70
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = baseHeight - padding.top - padding.bottom;

  const maxMonthly = Math.max(
    ...forecast.map(row => Number(row.monthly || 0)),
    1
  );

  const maxCumulative = Math.max(
    target,
    ...forecast.map(row => Number(row.cumulative || 0)),
    ...scenarioForecasts.flatMap(sf => sf.forecast.map(row => Number(row.cumulative || 0))),
    1
  );

  const xStep = chartWidth / Math.max(1, forecast.length - 1);

  function getX(index) {
    return padding.left + index * xStep;
  }

  function getMonthlyY(value) {
    return padding.top + chartHeight - ((value / maxMonthly) * chartHeight);
  }

  function getCumulativeY(value) {
    return padding.top + chartHeight - ((value / maxCumulative) * chartHeight);
  }

  // Y-axis ticks and grid lines (cumulative scale)
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => {
    const value = Math.round((maxCumulative / yTickCount) * i);
    const y = getCumulativeY(value);
    return `
      <line x1="${padding.left - 5}" y1="${y}" x2="${padding.left}" y2="${y}" stroke="#98a2b3" stroke-width="1"></line>
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#f0f4f8" stroke-width="1"></line>
      <text x="${padding.left - 8}" y="${y + 4}" font-size="11" fill="#667085" text-anchor="end">${value}</text>
    `;
  }).join('');

  const yAxisLabel = `
    <text
      x="${-(padding.top + chartHeight / 2)}"
      y="16"
      transform="rotate(-90)"
      font-size="12"
      fill="#475467"
      text-anchor="middle"
      font-weight="600">
      Total Enrolled
    </text>
  `;

  // Stacked country-colored monthly bars
  const monthlyBars = forecast.map((row, index) => {
    const monthly = Number(row.monthly || 0);
    if (monthly <= 0) return '';

    const barWidth = 24;
    const x = getX(index) - barWidth / 2;

    if (!monthlyByCountry || !monthlyByCountry[index] || countries.length === 0) {
      const y = getMonthlyY(monthly);
      const barHeight = padding.top + chartHeight - y;
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" class="chart-bar"></rect>`;
    }

    const breakdown = monthlyByCountry[index].breakdown;
    let yBottom = padding.top + chartHeight;

    return countries.map((country, colorIndex) => {
      const val = Number(breakdown[country] || 0);
      if (val <= 0) return '';
      const segHeight = Math.max(1, (val / maxMonthly) * chartHeight);
      const yTop = yBottom - segHeight;
      const color = COUNTRY_COLORS[colorIndex % COUNTRY_COLORS.length];
      const rect = `<rect x="${x}" y="${yTop}" width="${barWidth}" height="${segHeight}" fill="${color}"></rect>`;
      yBottom = yTop;
      return rect;
    }).join('');
  }).join('');

  const cumulativePoints = forecast
    .map((row, index) => `${getX(index)},${getCumulativeY(Number(row.cumulative || 0))}`)
    .join(' ');

  // One polyline + dots per scenario
  const scenarioLines = scenarioForecasts.map(sf => {
    const pts = sf.forecast
      .map((row, index) => `${getX(index)},${getCumulativeY(Number(row.cumulative || 0))}`)
      .join(' ');
    const dots = sf.forecast
      .map((row, index) => `<circle cx="${getX(index)}" cy="${getCumulativeY(Number(row.cumulative || 0))}" r="4" fill="${sf.color}"></circle>`)
      .join('');
    return `
      <polyline points="${pts}" fill="none" stroke="${sf.color}" stroke-width="3" stroke-dasharray="6 4"></polyline>
      ${dots}
    `;
  }).join('');

  const targetY = getCumulativeY(target);

  const xLabels = forecast.map((row, index) => {
    const x = getX(index);
    const y = baseHeight - 30;
    return `
      <text x="${x}" y="${y}" class="chart-x-label" transform="rotate(-45 ${x} ${y})">
        ${formatMonthLabel(row.month)}
      </text>
    `;
  }).join('');

  const monthlyLabels = forecast.map((row, index) => {
    const monthly = Number(row.monthly || 0);
    if (monthly <= 0) return '';
    const x = getX(index);
    const y = getMonthlyY(monthly) - 6;
    return `<text x="${x}" y="${y}" class="chart-bar-label">${formatEnrollment(monthly)}</text>`;
  }).join('');

  // Country color legend (below chart)
  const countryLegend = countries.map((country, i) => {
    const col = i % legendItemsPerRow;
    const row = Math.floor(i / legendItemsPerRow);
    const lx = padding.left + col * (chartWidth / legendItemsPerRow);
    const ly = baseHeight + 8 + row * 22;
    const color = COUNTRY_COLORS[i % COUNTRY_COLORS.length];
    return `
      <rect x="${lx}" y="${ly}" width="12" height="12" fill="${color}" rx="2"></rect>
      <text x="${lx + 16}" y="${ly + 10}" font-size="12" fill="#475467">${country}</text>
    `;
  }).join('');

  // Scenario legend items in header row
  const scenarioLegendItems = scenarioForecasts.map((sf, i) => {
    const lx = padding.left + 560 + i * 160;
    return `<text x="${lx}" y="18" font-size="12" fill="${sf.color}" font-weight="600">- - ${sf.name || 'Scenario ' + (i + 1)}</text>`;
  }).join('');

  chart.innerHTML = `
    <svg
      class="chart-svg"
      viewBox="0 0 ${width} ${height}"
      style="height:${height}px"
      role="img"
      aria-label="Enrollment forecast chart">

      ${yAxisLabel}
      ${yTicks}

      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" class="chart-axis"></line>
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" class="chart-axis"></line>

      <line x1="${padding.left}" y1="${targetY}" x2="${width - padding.right}" y2="${targetY}" class="chart-target-line"></line>
      <text x="${width - padding.right}" y="${targetY - 8}" class="chart-target-label">Target: ${target}</text>

      ${monthlyBars}

      <polyline points="${cumulativePoints}" class="chart-cumulative-line"></polyline>

      ${forecast.map((row, index) => `
        <circle cx="${getX(index)}" cy="${getCumulativeY(Number(row.cumulative || 0))}" r="4" class="chart-cumulative-dot"></circle>
      `).join('')}

      ${scenarioLines}

      ${monthlyLabels}
      ${xLabels}

      <text x="${padding.left}" y="18" class="chart-title">Enrollment Curve</text>
      <text x="${padding.left + 150}" y="18" class="chart-legend-bar">■ Monthly Enrollment</text>
      <text x="${padding.left + 330}" y="18" class="chart-legend-line">— Cumulative</text>
      ${scenarioLegendItems}

      ${countryLegend}
    </svg>
  `;
}

function setupNavigation() {
  document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-button').forEach(navButton => {
        navButton.classList.remove('active');
      });

      document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
      });

      button.classList.add('active');

      const selectedView = document.getElementById(button.dataset.view);

      if (selectedView) {
        selectedView.classList.add('active');
      }
    });
  });
}

function setupInputListeners() {
 const studyNameInput =
  document.getElementById('studyName');

if (studyNameInput) {
  studyNameInput.addEventListener(
    'input',
    updateStudyTitle
  );
}
 
  const inputIds = [
    'targetEnrollmentKPI',
    'screenFailRateKPI',
    'screeningWindowKPI',
    'globalEnrollmentRateKPI',
    'targetFpsDateKPI',
    'targetLpiKPI'
  ];

  const refreshStudySetup = () => {
    runForecast();
    renderCountryAssumptionsTable();
    renderSiteActivationTimeline();
    renderSiteTable();
  };

  inputIds.forEach(id => {
    const input = document.getElementById(id);

    if (input) {
      input.addEventListener('change', refreshStudySetup);
      input.addEventListener('blur', refreshStudySetup);
    }
  });

  const runForecastTop = document.getElementById('runForecastTop');

  if (runForecastTop) {
    runForecastTop.addEventListener('click', runForecast);
  }

  const runForecastSites = document.getElementById('runForecastSites');

  if (runForecastSites) {
    runForecastSites.addEventListener('click', runForecast);
  }

  const addCountryButton = document.getElementById('addCountryAssumptionRow');

  if (addCountryButton) {
    addCountryButton.addEventListener('click', addCountryAssumptionRow);
  }

  const addHistoricalButton = document.getElementById('addHistoricalApprovalRow');

  if (addHistoricalButton) {
    addHistoricalButton.addEventListener('click', addHistoricalApprovalRow);
  }
}

setupNavigation();
setupInputListeners();
populateCountryDatalist();

renderHistoricalApprovalTable();
renderCountryAssumptionsTable();
renderSiteTable();
renderSiteActivationTimeline();
renderScenarioList();

const addScenarioBtn = document.getElementById('addScenarioBtn');
if (addScenarioBtn) {
  addScenarioBtn.addEventListener('click', addScenario);
}

runForecast();
  
