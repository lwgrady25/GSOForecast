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
const APP_STATE_VERSION = 1;
const APP_STATE_FILE_PREFIX = 'gso-forecast';
const SITE_CSV_TEMPLATE_HEADERS = [
  'country',
  'site_number',
  'pi_site_name',
  'activation_date',
  'er_mode',
  'enrollment_rate',
  'max_participants',
  'current_enrollment',
  'include'
];


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

  const monthAliases = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11
  };
  const monthNameMatch = trimmedValue.match(/^(\d{1,2})[-/. ]?([a-zA-Z]+)[-/. ]?(\d{4})$/);

  if (monthNameMatch) {
    const [, day, monthName, year] = monthNameMatch;
    const monthIndex = monthAliases[monthName.toLowerCase()];

    if (monthIndex !== undefined) {
      return new Date(Number(year), monthIndex, Number(day));
    }
  }

 const slashDateMatch = trimmedValue.match(
  /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/
);

if (slashDateMatch) {
  const [, day, month, year] = slashDateMatch;  // DD/MM/YYYY

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

function toStringValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function toFiniteNumber(value, fallbackValue = 0) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallbackValue;
  }

  return numericValue;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getStudyInputsSnapshot() {
  return {
    studyName: getTextValue('studyName', ''),
    targetEnrollmentKPI: getTextValue('targetEnrollmentKPI', ''),
    screenFailRateKPI: getTextValue('screenFailRateKPI', ''),
    screeningWindowKPI: getTextValue('screeningWindowKPI', ''),
    globalEnrollmentRateKPI: getTextValue('globalEnrollmentRateKPI', ''),
    averagePricePerParticipantKPI: getTextValue('averagePricePerParticipantKPI', ''),
    targetFpsDateKPI: getTextValue('targetFpsDateKPI', ''),
    targetLpiKPI: getTextValue('targetLpiKPI', ''),
    currentStateAsOfDate: getTextValue('currentStateAsOfDate', '')
  };
}

function applyStudyInputsSnapshot(studyInputs) {
  const safeInputs = isPlainObject(studyInputs) ? studyInputs : {};

  setValueIfExists('studyName', toStringValue(safeInputs.studyName));
  setValueIfExists('targetEnrollmentKPI', toStringValue(safeInputs.targetEnrollmentKPI));
  setValueIfExists('screenFailRateKPI', toStringValue(safeInputs.screenFailRateKPI));
  setValueIfExists('screeningWindowKPI', toStringValue(safeInputs.screeningWindowKPI));
  setValueIfExists('globalEnrollmentRateKPI', toStringValue(safeInputs.globalEnrollmentRateKPI));
  setValueIfExists('averagePricePerParticipantKPI', toStringValue(safeInputs.averagePricePerParticipantKPI));
  setValueIfExists('targetFpsDateKPI', toStringValue(safeInputs.targetFpsDateKPI));
  setValueIfExists('targetLpiKPI', toStringValue(safeInputs.targetLpiKPI));
  setValueIfExists('currentStateAsOfDate', toStringValue(safeInputs.currentStateAsOfDate));
}

function getAppStateSnapshot() {
  return {
    version: APP_STATE_VERSION,
    savedAt: new Date().toISOString(),
    studyInputs: getStudyInputsSnapshot(),
    historicalApprovalDays: historicalApprovalDays.map(item => ({
      country: toStringValue(item.country),
      approvalDays: toFiniteNumber(item.approvalDays, 0)
    })),
    countryAssumptions: countryAssumptions.map(item => ({
      country: toStringValue(item.country),
      initialCountry: Boolean(item.initialCountry),
      countryEr: toFiniteNumber(item.countryEr, 0),
      participantsPerCountry: toFiniteNumber(item.participantsPerCountry, 0),
      siteCount: toFiniteNumber(item.siteCount, 0),
      averageTimeToActivateSite: toFiniteNumber(item.averageTimeToActivateSite, 0),
      submissionDate: toStringValue(item.submissionDate),
      approvalDays: item.approvalDays === null ? null : toFiniteNumber(item.approvalDays, 0)
    })),
    sites: sites.map(item => ({
      siteKey: toStringValue(item.siteKey),
      include: Boolean(item.include),
      country: toStringValue(item.country),
      site: toStringValue(item.site),
      activation: toStringValue(item.activation),
      siteErMode: toStringValue(item.siteErMode || 'Global'),
      er: toFiniteNumber(item.er, 0),
      max: toFiniteNumber(item.max, 0),
      currentEnrollment: toFiniteNumber(item.currentEnrollment, 0)
    })),
    scenarios: scenarios.map(item => ({
      id: toFiniteNumber(item.id, 0),
      name: toStringValue(item.name),
      enabled: Boolean(item.enabled),
      screenFailRate: toFiniteNumber(item.screenFailRate, 0),
      enrollmentRate: toFiniteNumber(item.enrollmentRate, 0),
      activationTimingAdjustment: toFiniteNumber(item.activationTimingAdjustment, 0),
      selectedCountries: Array.isArray(item.selectedCountries)
        ? item.selectedCountries.map(value => toStringValue(value))
        : []
    })),
    nextScenarioId: toFiniteNumber(nextScenarioId, 1)
  };
}

function getStateFileName(studyName) {
  const cleanedName = toStringValue(studyName)
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '');

  const dateStamp = new Date().toISOString().slice(0, 10);
  const filePrefix = cleanedName || APP_STATE_FILE_PREFIX;

  return `${filePrefix}-state-${dateStamp}.json`;
}

function saveStateToFile() {
  const snapshot = getAppStateSnapshot();
  const fileContents = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([fileContents], { type: 'application/json' });
  const blobUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = getStateFileName(snapshot.studyInputs.studyName);

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(blobUrl);
}

function readFileAsText(file, onSuccess, onError) {
  const reader = new FileReader();

  reader.onload = () => {
    onSuccess(String(reader.result || ''));
  };

  reader.onerror = () => {
    onError('Unable to read the selected file. Please try again.');
  };

  reader.readAsText(file);
}

function parseLoadedState(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    window.alert('The selected file is not valid JSON.');
    return null;
  }
}

function normalizeHistoricalApprovals(items) {
  return items
    .filter(item => isPlainObject(item))
    .map(item => ({
      country: toStringValue(item.country),
      approvalDays: toFiniteNumber(item.approvalDays, 0)
    }));
}

function normalizeCountryAssumptions(items) {
  return items
    .filter(item => isPlainObject(item))
    .map(item => ({
      country: toStringValue(item.country),
      initialCountry: Boolean(item.initialCountry),
      countryEr: toFiniteNumber(item.countryEr, 0),
      participantsPerCountry: toFiniteNumber(item.participantsPerCountry, 0),
      siteCount: toFiniteNumber(item.siteCount, 0),
      averageTimeToActivateSite: toFiniteNumber(item.averageTimeToActivateSite, 0),
      submissionDate: toStringValue(item.submissionDate),
      approvalDays: item.approvalDays === null ? null : toFiniteNumber(item.approvalDays, 0)
    }));
}

function normalizeSites(items) {
  return items
    .filter(item => isPlainObject(item))
    .map(item => ({
      siteKey: toStringValue(item.siteKey),
      include: Boolean(item.include),
      country: toStringValue(item.country),
      site: toStringValue(item.site),
      activation: toStringValue(item.activation),
      siteErMode: toStringValue(item.siteErMode || 'Global'),
      er: toFiniteNumber(item.er, 0),
      max: toFiniteNumber(item.max, 0),
      currentEnrollment: toFiniteNumber(item.currentEnrollment, 0)
    }));
}

function normalizeScenarios(items) {
  return items
    .filter(item => isPlainObject(item))
    .map(item => ({
      id: toFiniteNumber(item.id, 0),
      name: toStringValue(item.name),
      enabled: Boolean(item.enabled),
      screenFailRate: toFiniteNumber(item.screenFailRate, 0),
      enrollmentRate: toFiniteNumber(item.enrollmentRate, 0),
      activationTimingAdjustment: toFiniteNumber(item.activationTimingAdjustment, 0),
      selectedCountries: Array.isArray(item.selectedCountries)
        ? item.selectedCountries.map(value => toStringValue(value))
        : []
    }))
    .filter(item => item.id > 0);
}

function loadStateFromText(jsonText) {
  const loadedState = parseLoadedState(jsonText);

  if (!isPlainObject(loadedState)) {
    if (loadedState !== null) {
      window.alert('The selected file is not a valid forecast save file.');
    }
    return;
  }

  if (!Array.isArray(loadedState.historicalApprovalDays)) {
    window.alert('The selected file is missing historical approval data.');
    return;
  }

  if (!Array.isArray(loadedState.countryAssumptions)) {
    window.alert('The selected file is missing country assumption data.');
    return;
  }

  if (!Array.isArray(loadedState.sites)) {
    window.alert('The selected file is missing site data.');
    return;
  }

  if (!Array.isArray(loadedState.scenarios)) {
    window.alert('The selected file is missing scenario data.');
    return;
  }

  applyStudyInputsSnapshot(loadedState.studyInputs);

  const loadedHistoricalApprovals = normalizeHistoricalApprovals(loadedState.historicalApprovalDays);
  historicalApprovalDays.splice(0, historicalApprovalDays.length, ...loadedHistoricalApprovals);

  countryAssumptions = normalizeCountryAssumptions(loadedState.countryAssumptions);
  sites = normalizeSites(loadedState.sites);
  scenarios = normalizeScenarios(loadedState.scenarios);

  const highestScenarioId = scenarios.reduce((highest, scenario) => Math.max(highest, scenario.id), 0);
  const loadedNextScenarioId = toFiniteNumber(loadedState.nextScenarioId, 0);
  nextScenarioId = loadedNextScenarioId > highestScenarioId
    ? loadedNextScenarioId
    : highestScenarioId + 1;

  updateStudyTitle();
  renderHistoricalApprovalTable();
  renderCountryAssumptionsTable();
  renderSiteTable();
  renderSiteActivationTimeline();
  renderScenarioList();
  runForecast();
}

function normalizeCsvHeader(value) {
  return toStringValue(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvRows(csvText) {
  const lines = toStringValue(csvText)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter(line => line.trim().length > 0);

  if (lines.length < 2) {
    return { headerMap: null, rows: [] };
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const headerMap = {};

  rawHeaders.forEach((header, index) => {
    const key = normalizeCsvHeader(header);
    if (key) {
      headerMap[key] = index;
    }
  });

  const rows = lines.slice(1).map((line, index) => ({
    rowNumber: index + 2,
    values: parseCsvLine(line)
  }));

  return { headerMap, rows };
}

function readCsvField(rowValues, headerMap, aliases) {
  for (let i = 0; i < aliases.length; i += 1) {
    const index = headerMap[aliases[i]];
    if (index !== undefined) {
      return toStringValue(rowValues[index]).trim();
    }
  }
  return '';
}

function parseImportBoolean(value) {
  const normalized = toStringValue(value).trim().toLowerCase();
  if (!normalized) return null;
  if (['true', 'yes', 'y', '1'].includes(normalized)) return true;
  if (['false', 'no', 'n', '0'].includes(normalized)) return false;
  return null;
}

function parseImportNumber(value, fieldLabel, rowNumber, errors) {
  const text = toStringValue(value).trim();
  if (!text) {
    return null;
  }

  const numericValue = Number(text);
  if (!Number.isFinite(numericValue)) {
    errors.push(`Row ${rowNumber}: Invalid ${fieldLabel} value "${value}".`);
    return null;
  }

  return numericValue;
}

function downloadSiteCsvTemplate() {
  const sampleRows = [
    SITE_CSV_TEMPLATE_HEADERS.join(','),
    'United States,1,Dr. Smith,15-Jan-2026,Custom,0.35,25,18,true'
  ];
  const csv = sampleRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'site-import-template.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toCsvCell(value) {
  const text = toStringValue(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function getSiteNumberFromSite(site) {
  const explicitSiteKey = toStringValue(site.siteKey).trim();
  const siteKeyMatch = explicitSiteKey.match(/\|(\d+)$/);
  if (siteKeyMatch) {
    return siteKeyMatch[1];
  }

  const legacyNameMatch = toStringValue(site.site).match(/(\d+)$/);
  if (legacyNameMatch) {
    return legacyNameMatch[1];
  }

  return '';
}

function exportSitesToCsv() {
  const rows = [SITE_CSV_TEMPLATE_HEADERS.join(',')];

  sites.forEach(site => {
    const rowValues = [
      toStringValue(site.country),
      getSiteNumberFromSite(site),
      toStringValue(site.site),
      toStringValue(site.activation ? formatDateForDisplay(site.activation) : ''),
      toStringValue(site.siteErMode || 'Global'),
      toStringValue(site.er),
      toStringValue(site.max),
      toStringValue(site.currentEnrollment || 0),
      site.include ? 'true' : 'false'
    ];

    rows.push(rowValues.map(toCsvCell).join(','));
  });

  const csvText = rows.join('\n');
  const blob = new Blob([csvText], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'site-export.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importSitesFromCsvText(csvText) {
  const parsed = parseCsvRows(csvText);

  if (!parsed.headerMap) {
    window.alert('CSV must include a header row and at least one data row.');
    return;
  }

  if (parsed.rows.length === 0) {
    window.alert('No site rows were found in the CSV file.');
    return;
  }

  const hasCountry = parsed.headerMap.country !== undefined;
  const hasSiteNumber = parsed.headerMap.site_number !== undefined;
  const hasSiteKey = parsed.headerMap.site_key !== undefined;

  if ((!hasCountry || !hasSiteNumber) && !hasSiteKey) {
    window.alert('CSV must include either "site_key" or both "country" and "site_number" columns.');
    return;
  }

  const siteMap = new Map(
    sites.map(site => [toStringValue(site.siteKey).trim(), site])
  );

  let updatedCount = 0;
  const errors = [];

  parsed.rows.forEach(row => {
    const rowValues = row.values;
    const rowNumber = row.rowNumber;

    const siteKeyFromFile = readCsvField(rowValues, parsed.headerMap, ['site_key']);
    const countryValue = readCsvField(rowValues, parsed.headerMap, ['country']);
    const siteNumberValue = readCsvField(rowValues, parsed.headerMap, ['site_number', 'site_index']);
    const derivedSiteKey = siteKeyFromFile || (
      countryValue && siteNumberValue
        ? `${countryValue}|${siteNumberValue}`
        : ''
    );

    if (!derivedSiteKey) {
      errors.push(`Row ${rowNumber}: Missing site identifier. Provide site_key or country + site_number.`);
      return;
    }

    const targetSite = siteMap.get(derivedSiteKey);
    if (!targetSite) {
      errors.push(`Row ${rowNumber}: Site "${derivedSiteKey}" not found in current setup.`);
      return;
    }

    const piName = readCsvField(rowValues, parsed.headerMap, ['pi_site_name', 'site_name', 'site']);
    if (piName) {
      targetSite.site = piName;
    }

    const activationValue = readCsvField(rowValues, parsed.headerMap, ['activation_date', 'activation']);
    if (activationValue) {
      targetSite.activation = normalizeDateInputValue(activationValue);
    }

    const erModeValue = readCsvField(rowValues, parsed.headerMap, ['er_mode', 'site_er_mode']).toLowerCase();
    if (erModeValue) {
      const normalizedMode = erModeValue === 'global'
        ? 'Global'
        : erModeValue === 'country'
          ? 'Country'
          : erModeValue === 'custom'
            ? 'Custom'
            : '';

      if (!normalizedMode) {
        errors.push(`Row ${rowNumber}: Invalid er_mode value "${erModeValue}". Use Global, Country, or Custom.`);
      } else {
        targetSite.siteErMode = normalizedMode;
      }
    }

    const erValue = parseImportNumber(
      readCsvField(rowValues, parsed.headerMap, ['enrollment_rate', 'er']),
      'enrollment_rate',
      rowNumber,
      errors
    );
    if (erValue !== null) {
      targetSite.er = erValue;
    }

    const maxValue = parseImportNumber(
      readCsvField(rowValues, parsed.headerMap, ['max_participants', 'max']),
      'max_participants',
      rowNumber,
      errors
    );
    if (maxValue !== null) {
      targetSite.max = maxValue;
    }

    const currentEnrollmentValue = parseImportNumber(
      readCsvField(rowValues, parsed.headerMap, ['current_enrollment', 'current']),
      'current_enrollment',
      rowNumber,
      errors
    );
    if (currentEnrollmentValue !== null) {
      targetSite.currentEnrollment = currentEnrollmentValue;
    }

    const includeValue = readCsvField(rowValues, parsed.headerMap, ['include']);
    if (includeValue) {
      const parsedInclude = parseImportBoolean(includeValue);
      if (parsedInclude === null) {
        errors.push(`Row ${rowNumber}: Invalid include value "${includeValue}". Use true/false or yes/no.`);
      } else {
        targetSite.include = parsedInclude;
      }
    }

    updatedCount += 1;
  });

  renderSiteTable();
  runForecast();

  const skippedCount = parsed.rows.length - updatedCount;
  const firstErrors = errors.slice(0, 5);
  const errorText = firstErrors.length > 0
    ? `\n\nIssues:\n- ${firstErrors.join('\n- ')}${errors.length > 5 ? '\n- ...' : ''}`
    : '';

  window.alert(
    `Site CSV import complete.\nUpdated: ${updatedCount}\nSkipped: ${skippedCount}${errorText}`
  );
}

function getScreenFailRatePercent() {
  return getNumberValue('screenFailRateKPI', 0);
}

function calculateParticipantsWithScreenFail(participantsPerCountry) {
  const rate = getScreenFailRatePercent() / 100;
  return Math.round(participantsPerCountry * (1 - rate));
}

function formatWholeNumber(value) {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) {
    return '0';
  }
  return Math.round(numericValue).toLocaleString('en-US');
}

function updateParticipantSummaryCards() {
  const countryBeforeScreenFail = countryAssumptions.reduce((sum, country) => {
    return sum + Number(country.participantsPerCountry || 0);
  }, 0);
  const countryAfterScreenFail = countryAssumptions.reduce((sum, country) => {
    return sum + calculateParticipantsWithScreenFail(Number(country.participantsPerCountry || 0));
  }, 0);

  const siteAfterScreenFail = sites.reduce((sum, site) => {
    return sum + Number(site.max || 0);
  }, 0);
  const screenFailRate = getScreenFailRatePercent() / 100;
  const siteBeforeScreenFail = screenFailRate >= 1
    ? 0
    : siteAfterScreenFail / (1 - screenFailRate);

  setTextIfExists('dashboardParticipantsBeforeScreenFail', formatWholeNumber(countryBeforeScreenFail));
  setTextIfExists('dashboardParticipantsAfterScreenFail', formatWholeNumber(countryAfterScreenFail));

  setTextIfExists('countryParticipantsBeforeScreenFail', formatWholeNumber(countryBeforeScreenFail));
  setTextIfExists('countryParticipantsAfterScreenFail', formatWholeNumber(countryAfterScreenFail));

  setTextIfExists('siteParticipantsBeforeScreenFail', formatWholeNumber(siteBeforeScreenFail));
  setTextIfExists('siteParticipantsAfterScreenFail', formatWholeNumber(siteAfterScreenFail));
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
  const previousSitesByKey = new Map();

  (sites || []).forEach(site => {
    if (!site) {
      return;
    }

    const explicitKey = toStringValue(site.siteKey).trim();
    if (explicitKey) {
      previousSitesByKey.set(explicitKey, site);
    }

    const legacyMatch = toStringValue(site.site).match(/(\d+)$/);
    if (legacyMatch) {
      const legacyIndex = Number(legacyMatch[1]);
      if (legacyIndex > 0) {
        previousSitesByKey.set(`${site.country}|${legacyIndex}`, site);
      }
    }

    previousSitesByKey.set(`${site.country}|${site.site}`, site);
  });

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
      const key = `${country.country}|${siteNumber}`;
      const previousSite = previousSitesByKey.get(key);
      const siteName = previousSite?.site || `${country.country} Site ${siteNumber}`;

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
        previousSite && previousSite.max !== undefined
          ? toFiniteNumber(previousSite.max, 0)
          : calculateSiteMaxParticipants(
              country,
              siteIndex,
              siteCount
            );

      nextSites.push({
        siteKey: key,
        include: previousSite ? Boolean(previousSite.include) : Boolean(country.initialCountry),
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

function resetSiteMaxParticipants() {
  buildSiteRows();

  const countriesByName = new Map(
    countryAssumptions
      .filter(country => toStringValue(country.country).trim())
      .map(country => [toStringValue(country.country).trim(), country])
  );

  sites.forEach(site => {
    const countryName = toStringValue(site.country).trim();
    const countryItem = countriesByName.get(countryName);

    if (!countryItem) {
      return;
    }

    const siteCount = Math.max(0, Number(countryItem.siteCount || 0));
    const siteNumber = Number(getSiteNumberFromSite(site));

    if (!siteCount || !Number.isFinite(siteNumber) || siteNumber < 1 || siteNumber > siteCount) {
      return;
    }

    site.max = calculateSiteMaxParticipants(
      countryItem,
      siteNumber - 1,
      siteCount
    );
  });

  renderSiteTable();
  runForecast();
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

  if (field === 'initialCountry' && value === false) {
    const countryName = toStringValue(currentItem.country).trim();
    sites.forEach(site => {
      if (toStringValue(site.country).trim() === countryName) {
        site.include = false;
      }
    });
  }

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
    class="input-required"
    value="${country.country}"
    data-field="country"
    data-index="${index}" />
</td>
    <td>
      <select class="input-required" data-field="initialCountry" data-index="${index}">
        <option value="true" ${country.initialCountry ? 'selected' : ''}>Yes</option>
        <option value="false" ${!country.initialCountry ? 'selected' : ''}>No</option>
      </select>
    </td>
    <td><input type="number" step="0.01" value="${country.countryEr}" data-field="countryEr" data-index="${index}" /></td>
    <td><input class="input-required" type="number" step="1" value="${country.participantsPerCountry}" data-field="participantsPerCountry" data-index="${index}" /></td>
    <td data-derived="participantsWithScreenFail">${participantsWithScreenFail}</td>
    <td><input class="input-required" type="number" step="1" value="${country.siteCount}" data-field="siteCount" data-index="${index}" /></td>
    <td><input class="input-required" type="number" step="1" value="${country.averageTimeToActivateSite || ''}" data-field="averageTimeToActivateSite" data-index="${index}" /></td>
    <td><input class="input-required" type="text" value="${country.submissionDate ? formatDateForDisplay(country.submissionDate) : ''}" placeholder="DD-MMM-YYYY" data-field="submissionDate" data-index="${index}" /></td>
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
  updateParticipantSummaryCards();
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

function buildIncludedSitesWithAdditionalCountries(additionalCountries) {
  const additionalCountrySet = new Set(additionalCountries);

  return sites
    .filter(site => site.include || additionalCountrySet.has(site.country))
    .map(site => ({
      ...site,
      include: site.include || additionalCountrySet.has(site.country)
    }));
}

function evaluateCountryAddOnCombination(additionalCountries, target, targetLpi) {
  const includedSites = buildIncludedSitesWithAdditionalCountries(additionalCountries);
  const forecastMonths = generateForecastMonths(includedSites, targetLpi);
  const forecast = calculateForecastForSites(includedSites, forecastMonths, target);
  const lpiRow = forecast.find(row => row.cumulative >= target) || null;
  const projected = forecast.length > 0
    ? Number(forecast[forecast.length - 1].cumulative || 0)
    : includedSites.reduce((sum, site) => sum + Number(site.currentEnrollment || 0), 0);

  return {
    countries: additionalCountries,
    countryCount: additionalCountries.length,
    forecast,
    lpiRow,
    reachesTarget: Boolean(lpiRow),
    lpiTime: lpiRow ? new Date(`${lpiRow.month}T00:00:00`).getTime() : Number.POSITIVE_INFINITY,
    projected
  };
}

function compareCombinationQuality(a, b) {
  if (a.reachesTarget && !b.reachesTarget) return 1;
  if (!a.reachesTarget && b.reachesTarget) return -1;

  if (a.reachesTarget && b.reachesTarget) {
    if (a.lpiTime < b.lpiTime) return 1;
    if (a.lpiTime > b.lpiTime) return -1;
  } else {
    if (a.projected > b.projected) return 1;
    if (a.projected < b.projected) return -1;
  }

  if (a.countryCount < b.countryCount) return 1;
  if (a.countryCount > b.countryCount) return -1;

  if (a.projected > b.projected) return 1;
  if (a.projected < b.projected) return -1;

  return 0;
}

function findBestCountryAddOnCombination(candidateCountries, target, targetLpi) {
  if (candidateCountries.length === 0) {
    return null;
  }

  let best = null;

  if (candidateCountries.length <= 12) {
    const totalCombinations = (2 ** candidateCountries.length) - 1;

    for (let mask = 1; mask <= totalCombinations; mask += 1) {
      const selected = candidateCountries.filter((_, index) => (mask & (1 << index)) !== 0);
      const evaluation = evaluateCountryAddOnCombination(selected, target, targetLpi);

      if (!best || compareCombinationQuality(evaluation, best) > 0) {
        best = evaluation;
      }
    }

    return best;
  }

  let selectedCountries = [];
  let remainingCountries = [...candidateCountries];
  let currentBest = evaluateCountryAddOnCombination(selectedCountries, target, targetLpi);

  while (remainingCountries.length > 0) {
    let bestStep = null;

    remainingCountries.forEach(country => {
      const trialCountries = [...selectedCountries, country];
      const trialEvaluation = evaluateCountryAddOnCombination(trialCountries, target, targetLpi);

      if (!bestStep || compareCombinationQuality(trialEvaluation, bestStep) > 0) {
        bestStep = trialEvaluation;
      }
    });

    if (!bestStep || compareCombinationQuality(bestStep, currentBest) <= 0) {
      break;
    }

    currentBest = bestStep;
    selectedCountries = bestStep.countries;
    remainingCountries = remainingCountries.filter(country => !selectedCountries.includes(country));

    if (currentBest.reachesTarget) {
      break;
    }
  }

  return currentBest.countryCount > 0 ? currentBest : null;
}

function generateBestAddOnScenario() {
  buildSiteRows();

  const target = getNumberValue('targetEnrollmentKPI', 0);
  const targetLpi = getTextValue('targetLpiKPI', '');
  const includedCountrySet = new Set(
    sites.filter(site => site.include).map(site => site.country)
  );

  const candidateCountries = [...new Set(
    countryAssumptions
      .map(country => toStringValue(country.country).trim())
      .filter(country => country && !includedCountrySet.has(country))
  )];

  if (candidateCountries.length === 0) {
    window.alert('No additional countries are available to generate an add-on scenario.');
    return;
  }

  const baseline = evaluateCountryAddOnCombination([], target, targetLpi);
  const best = findBestCountryAddOnCombination(candidateCountries, target, targetLpi);

  if (!best || best.countryCount === 0) {
    window.alert('No beneficial country add-on combination was found.');
    return;
  }

  if (compareCombinationQuality(best, baseline) <= 0) {
    window.alert('Current included countries are already as effective as the tested add-on combinations.');
    return;
  }

  scenarios = scenarios.filter(scenario => !toStringValue(scenario.name).startsWith('Generated - Fastest Add-On'));

  scenarios.push({
    id: nextScenarioId++,
    name: `Generated - Fastest Add-On (${best.countryCount})`,
    enabled: true,
    screenFailRate: 0,
    enrollmentRate: 0,
    activationTimingAdjustment: 0,
    selectedCountries: best.countries
  });

  renderScenarioList();
  runForecast();

  const baselineLpiLabel = baseline.reachesTarget ? formatDate(baseline.lpiRow.month) : 'Target Not Met';
  const bestLpiLabel = best.reachesTarget ? formatDate(best.lpiRow.month) : 'Target Not Met';
  const countryListLabel = best.countries.join(', ');

  window.alert(
    `Generated best add-on scenario.\nCountries: ${countryListLabel}\nBaseline LPI: ${baselineLpiLabel}\nGenerated LPI: ${bestLpiLabel}`
  );
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
      class="input-required"
      data-field="include"
      data-index="${index}" />
  </td>

  <td>${site.country}</td>

  <td>
    <input
      type="text"
      class="input-required"
      value="${site.site}"
      data-field="site"
      data-index="${index}" />
  </td>

  <td>
    <input
      type="text"
      class="input-required"
      value="${site.activation ? formatDateForDisplay(site.activation) : ''}"
      placeholder="DD-MMM-YYYY"
      data-field="activation"
      data-index="${index}" />
  </td>

  <td>
    <select
      class="input-required"
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
      class="input-required"
      value="${site.er}"
      data-field="er"
      data-index="${index}"
      ${(site.siteErMode || 'Global') !== 'Custom' ? 'readonly style="background:#f8fafc;color:#667085;"' : ''} />
  </td>

  <td>
    <input
      type="number"
      class="input-required"
      value="${site.max}"
      data-field="max"
      data-index="${index}" />
  </td>

  <td>
    <input
      type="number"
      class="input-required"
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

  updateParticipantSummaryCards();
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

function getMonthlyEnrollmentTarget(activeSiteStates) {
  const totalEnrollmentRate = activeSiteStates.reduce((sum, siteState) => {
    return sum + Number(siteState.er || 0);
  }, 0);

  if (totalEnrollmentRate <= 0) {
    return 0;
  }

  if (totalEnrollmentRate < 1) {
    return 1;
  }

  return Math.round(totalEnrollmentRate);
}

function isSiteActiveForMonth(siteState, monthDate) {
  return (
    siteState.startMonth &&
    siteState.startMonth <= monthDate &&
    siteState.enrolled < siteState.max
  );
}

function distributeMonthlyEnrollment(siteStates, monthDate, monthlyTarget, startCursor) {
  const breakdown = {};
  let remainingToAssign = Math.max(0, Number(monthlyTarget || 0));
  if (siteStates.length === 0) {
    return {
      breakdown,
      nextCursor: 0
    };
  }

  let cursor = Math.max(0, Number(startCursor || 0)) % siteStates.length;
  let safetyCounter = 0;
  const safetyLimit = Math.max(siteStates.length * Math.max(remainingToAssign, 1) * 4, 200);

  while (remainingToAssign > 0 && safetyCounter < safetyLimit) {
    const siteState = siteStates[cursor];
    cursor = (cursor + 1) % siteStates.length;
    safetyCounter += 1;

    if (!isSiteActiveForMonth(siteState, monthDate)) {
      continue;
    }

    siteState.enrolled += 1;
    remainingToAssign -= 1;
    breakdown[siteState.country] = (breakdown[siteState.country] || 0) + 1;
  }

  return {
    breakdown,
    nextCursor: cursor
  };
}

function buildEnrollmentSimulation(siteList, forecastMonths) {
  const includedSites = siteList.filter(site => site.include);
  const siteStates = includedSites.map((site, index) => ({
    siteId: toStringValue(site.siteKey).trim() || `${toStringValue(site.country)}|${toStringValue(site.site)}|${index}`,
    country: toStringValue(site.country),
    er: Number(site.er || 0),
    max: Number(site.max || 0),
    enrolled: Number(site.currentEnrollment || 0),
    initialEnrollment: Number(site.currentEnrollment || 0),
    startMonth: getSiteEnrollmentStartMonth(site)
  }));

  const monthlyTotals = [];
  const monthlyByCountry = [];
  let assignmentCursor = 0;

  forecastMonths.forEach(month => {
    const monthDate = new Date(`${month}T00:00:00`);
    const activeSiteStates = siteStates.filter(siteState => {
      return isSiteActiveForMonth(siteState, monthDate);
    });

    const monthlyTarget = getMonthlyEnrollmentTarget(activeSiteStates);
    const totalRemainingCapacity = activeSiteStates.reduce((sum, siteState) => {
      return sum + Math.max(0, siteState.max - siteState.enrolled);
    }, 0);
    const cappedMonthlyTarget = Math.min(monthlyTarget, totalRemainingCapacity);
    const distributionResult = distributeMonthlyEnrollment(
      siteStates,
      monthDate,
      cappedMonthlyTarget,
      assignmentCursor
    );
    const breakdown = distributionResult.breakdown;
    assignmentCursor = distributionResult.nextCursor;

    const monthlyTotal = Object.values(breakdown).reduce((sum, value) => {
      return sum + Number(value || 0);
    }, 0);

    monthlyTotals.push(monthlyTotal);
    monthlyByCountry.push({ month, breakdown });
  });

  const countryTotals = {};
  siteStates.forEach(siteState => {
    countryTotals[siteState.country] = (countryTotals[siteState.country] || 0) + Number(siteState.enrolled || 0);
  });

  const initialCumulative = siteStates.reduce((sum, siteState) => {
    return sum + Number(siteState.initialEnrollment || 0);
  }, 0);

  return {
    monthlyTotals,
    monthlyByCountry,
    countryTotals,
    initialCumulative
  };
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

function getTargetFpsMonthStart() {
  const targetFpsDateValue = getTextValue('targetFpsDateKPI', '');
  const parsedTargetFpsDate = parseDateInput(targetFpsDateValue);

  if (!parsedTargetFpsDate) {
    return null;
  }

  return new Date(
    parsedTargetFpsDate.getFullYear(),
    parsedTargetFpsDate.getMonth(),
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

  const firstSiteForecastMonth =
    new Date(
      Math.min(
        ...siteStartDates.map(date =>
          date.getTime()
        )
      )
    );

  const targetFpsMonth = getTargetFpsMonthStart();
  const firstForecastMonth =
    targetFpsMonth && targetFpsMonth > firstSiteForecastMonth
      ? targetFpsMonth
      : firstSiteForecastMonth;

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

  if (currentMonth > lastForecastMonth) {
    return forecastMonths;
  }

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
  const simulation = buildEnrollmentSimulation(sites, forecastMonths);

  return Object.entries(simulation.countryTotals)
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
  const simulation = buildEnrollmentSimulation(siteList, forecastMonths);
  const forecast = forecastMonths.map(month => ({
    month,
    monthly: 0,
    cumulative: 0,
    remaining: target
  }));

  forecast.forEach((row, index) => {
    row.monthly = Number(simulation.monthlyTotals[index] || 0);
  });

  let cumulative = simulation.initialCumulative;

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

 
function flashRunForecastButtons(success) {
  document.querySelectorAll('[data-global-action="runForecast"], #runForecastTop, #runForecastSites').forEach(btn => {
    btn.classList.remove('btn-running');
    void btn.offsetWidth;
    btn.classList.add('btn-running');
    btn.textContent = success === false ? '⚠️ Fix Inputs' : '⏳ Running…';
    setTimeout(() => {
      btn.classList.remove('btn-running');
      if (success !== false) {
        btn.textContent = '✓ Done';
        setTimeout(() => { btn.textContent = 'Run Forecast'; }, 1200);
      } else {
        btn.textContent = 'Run Forecast';
      }
    }, 600);
  });
}

function validateForecastInputs(highlightErrors = true) {
  const issues = [];

  // Clear previous error highlights
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  const targetEl = document.getElementById('targetEnrollmentKPI');
  if (!targetEl || !targetEl.value || Number(targetEl.value) <= 0) {
    issues.push('Target Enrollment must be greater than 0');
    if (highlightErrors && targetEl) targetEl.classList.add('input-error');
  }

  const fpsEl = document.getElementById('targetFpsDateKPI');
  if (!fpsEl || !fpsEl.value.trim()) {
    issues.push('Target FPS Date is required');
    if (highlightErrors && fpsEl) fpsEl.classList.add('input-error');
  } else if (!parseDateInput(fpsEl.value.trim())) {
    issues.push('Target FPS Date format is not recognized (try DD-Mon-YYYY or YYYY-MM-DD)');
    if (highlightErrors) fpsEl.classList.add('input-error');
  }

  const includedSites = sites.filter(s => s.include);
  if (includedSites.length === 0) {
    issues.push('At least one site must be included (check Site Information)');
  } else {
    const missingActivation = includedSites.filter(s => !s.activation);
    if (missingActivation.length > 0) {
      issues.push(`${missingActivation.length} included site(s) are missing an Activation Date`);
    }
  }

  if (issues.length > 0) {
    if (highlightErrors) {
      const list = document.getElementById('validationToastList');
      const toast = document.getElementById('validationToast');
      if (list && toast) {
        list.innerHTML = issues.map(i => `<li>${i}</li>`).join('');
        toast.classList.add('visible');
      }
    }
    return false;
  }

  // Hide any previous toast
  const toast = document.getElementById('validationToast');
  if (toast) toast.classList.remove('visible');
  return true;
}

function runForecast(highlightErrors = true) {
  if (!validateForecastInputs(highlightErrors)) {
    if (highlightErrors) {
      flashRunForecastButtons(false);
    }
    return;
  }
  if (highlightErrors) {
    flashRunForecastButtons(true);
  }

  buildSiteRows();

  const target = getNumberValue('targetEnrollmentKPI', 0);
  const screenFailRate = getNumberValue('screenFailRateKPI', 0);
  const screeningWindow = getNumberValue('screeningWindowKPI', 0);
  const averagePricePerParticipant = getNumberValue('averagePricePerParticipantKPI', 0);
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
setValueIfExists(
  'totalEnrollmentCost',
  formatCurrency(target * averagePricePerParticipant)
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
  renderCurrentStateSummary({
    forecast: [],
    target,
    lpiRow: null,
    parsedTargetLpiDate,
    includedSites
  });
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
renderCurrentStateSummary({
  forecast,
  target,
  lpiRow,
  parsedTargetLpiDate,
  includedSites
});
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

function formatPercent(value) {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) {
    return '0.0%';
  }
  return `${numericValue.toFixed(1)}%`;
}

function formatEnrollmentRate(value) {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) {
    return '0.00';
  }
  return numericValue.toFixed(2);
}

function formatCurrency(value) {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) {
    return '$0';
  }

  return numericValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

function renderCurrentStateChart(forecast, currentEnrollmentTotal) {
  const chart = document.getElementById('currentStateChart');
  if (!chart) {
    return;
  }

  chart.innerHTML = '';

  if (!forecast || forecast.length === 0) {
    chart.innerHTML = '<p class="empty-chart-message">No forecast data to compare yet. Add site details and run the forecast.</p>';
    return;
  }

  const width = Math.max(900, forecast.length * 55);
  const height = 360;
  const padding = { top: 28, right: 24, bottom: 72, left: 64 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxY = Math.max(
    1,
    Number(currentEnrollmentTotal || 0),
    ...forecast.map(row => Number(row.cumulative || 0))
  );

  const xStep = chartWidth / Math.max(1, forecast.length - 1);
  const getX = index => padding.left + (index * xStep);
  const getY = value => padding.top + chartHeight - ((Number(value || 0) / maxY) * chartHeight);

  const forecastPoints = forecast
    .map((row, index) => `${getX(index)},${getY(row.cumulative)}`)
    .join(' ');

  const currentY = getY(currentEnrollmentTotal);
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const value = Math.round((maxY / tickCount) * i);
    const y = getY(value);
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#f0f4f8" stroke-width="1"></line>
      <text x="${padding.left - 8}" y="${y + 4}" font-size="11" fill="#667085" text-anchor="end">${value}</text>
    `;
  }).join('');

  const labelStep = Math.max(1, Math.ceil(forecast.length / 12));
  const xLabels = forecast
    .map((row, index) => {
      if (index % labelStep !== 0 && index !== forecast.length - 1) {
        return '';
      }

      const x = getX(index);
      const y = height - 28;
      return `
        <text x="${x}" y="${y}" font-size="11" fill="#667085" text-anchor="end" transform="rotate(-45 ${x} ${y})">
          ${formatMonthLabel(row.month)}
        </text>
      `;
    })
    .join('');

  chart.innerHTML = `
    <svg class="current-state-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Current enrollment versus forecast baseline">
      ${yTicks}
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#98a2b3" stroke-width="1"></line>
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" stroke="#98a2b3" stroke-width="1"></line>

      <line x1="${padding.left}" y1="${currentY}" x2="${width - padding.right}" y2="${currentY}" stroke="#b42318" stroke-width="2" stroke-dasharray="6 4"></line>
      <text x="${width - padding.right}" y="${currentY - 8}" font-size="12" fill="#b42318" text-anchor="end">Current: ${formatEnrollment(currentEnrollmentTotal)}</text>

      <polyline points="${forecastPoints}" fill="none" stroke="#2563eb" stroke-width="3"></polyline>
      ${forecast.map((row, index) => `
        <circle cx="${getX(index)}" cy="${getY(row.cumulative)}" r="3.5" fill="#2563eb"></circle>
      `).join('')}

      ${xLabels}
      <text x="${padding.left}" y="16" font-size="13" fill="#172033" font-weight="700">Baseline Forecast vs Current Enrollment</text>
      <text x="${padding.left + 260}" y="16" font-size="12" fill="#2563eb" font-weight="600">— Forecast Cumulative</text>
      <text x="${padding.left + 460}" y="16" font-size="12" fill="#b42318" font-weight="600">- - Current Baseline</text>
    </svg>
  `;
}

function renderCurrentStateSummary({ forecast, target, lpiRow, parsedTargetLpiDate, includedSites }) {
  const currentEnrollmentTotal = includedSites.reduce(
    (sum, site) => sum + Number(site.currentEnrollment || 0),
    0
  );
  const activeSites = includedSites.length;
  const averageEnrollmentRate = activeSites > 0
    ? includedSites.reduce((sum, site) => sum + Number(site.er || 0), 0) / activeSites
    : 0;

  const progressPercent = target > 0
    ? (currentEnrollmentTotal / target) * 100
    : 0;

  const forecastLpiLabel = lpiRow ? formatDate(lpiRow.month) : 'Target Not Met';
  const targetLpiLabel = parsedTargetLpiDate ? formatDate(parsedTargetLpiDate) : 'No Target';

  setTextIfExists(
    'currentStateLpiComparison',
    `${forecastLpiLabel} vs ${targetLpiLabel}`
  );
  setTextIfExists(
    'currentStateEnrollmentProgress',
    `${formatEnrollment(currentEnrollmentTotal)}/${formatEnrollment(target)} (${formatPercent(progressPercent)})`
  );
  setTextIfExists('currentStateActiveSites', String(activeSites));
  setTextIfExists('currentStateEnrollmentRate', formatEnrollmentRate(averageEnrollmentRate));

  let paceStatusText = '--';
  let paceStatusClass = '';

  const asOfInputValue = getTextValue('currentStateAsOfDate', '');
  const parsedAsOfDate = parseDateInput(asOfInputValue);
  const effectiveAsOfDate = parsedAsOfDate || new Date();
  const asOfMonthStart = new Date(
    effectiveAsOfDate.getFullYear(),
    effectiveAsOfDate.getMonth(),
    1
  );

  if (forecast && forecast.length > 0) {
    if (parsedAsOfDate) {
      setValueIfExists('currentStateAsOfDate', formatDate(parsedAsOfDate));
    }

    const expectedRow = forecast
      .filter(row => {
        const rowMonth = new Date(`${row.month}T00:00:00`);
        return rowMonth <= asOfMonthStart;
      })
      .slice(-1)[0];

    const expectedEnrollmentNow = expectedRow ? Number(expectedRow.cumulative || 0) : 0;
    const tolerance = Math.max(1, expectedEnrollmentNow * 0.05);
    const delta = currentEnrollmentTotal - expectedEnrollmentNow;

    if (expectedEnrollmentNow <= 0) {
      paceStatusText = `On Track as of ${formatDate(effectiveAsOfDate)}`;
      paceStatusClass = 'status-good';
    } else if (delta >= -tolerance) {
      paceStatusText = `On Track as of ${formatDate(effectiveAsOfDate)} (${formatEnrollment(currentEnrollmentTotal)} vs ${formatEnrollment(expectedEnrollmentNow)} expected)`;
      paceStatusClass = 'status-good';
    } else {
      paceStatusText = `Behind Pace as of ${formatDate(effectiveAsOfDate)} (${formatEnrollment(currentEnrollmentTotal)} vs ${formatEnrollment(expectedEnrollmentNow)} expected)`;
      paceStatusClass = 'status-risk';
    }
  }

  const paceElement = document.getElementById('currentStatePaceStatus');
  if (paceElement) {
    paceElement.textContent = paceStatusText;
    paceElement.className = paceStatusClass || '';
  }

  renderCurrentStateChart(forecast, currentEnrollmentTotal);
}

function calculateMonthlyByCountry(includedSites, forecastMonths) {
  const simulation = buildEnrollmentSimulation(includedSites, forecastMonths);
  return simulation.monthlyByCountry;
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
    top: 42,
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
    const x = Math.max(
      padding.left + 2,
      getX(index) - barWidth / 2
    );

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

  const legendItems = [
    { label: '■ Monthly Enrollment', className: 'chart-legend-bar' },
    { label: '— Cumulative', className: 'chart-legend-line' },
    ...scenarioForecasts.map((sf, i) => ({
      label: `- - ${sf.name || 'Scenario ' + (i + 1)}`,
      fill: sf.color
    }))
  ];

  const legendItemPadding = 28;
  const legendY = 16;
  const plotLeft = padding.left;
  const plotRight = width - padding.right;
  const legendMeasurementCanvas = document.createElement('canvas');
  const legendMeasurementContext = legendMeasurementCanvas.getContext('2d');
  if (legendMeasurementContext) {
    legendMeasurementContext.font = '600 12px Inter, sans-serif';
  }
  const legendTotalWidth = legendItems.reduce((sum, item) => {
    const measuredWidth = legendMeasurementContext
      ? legendMeasurementContext.measureText(item.label).width
      : item.label.length * 7;
    return sum + measuredWidth;
  }, 0) + (legendItemPadding * Math.max(legendItems.length - 1, 0));

  let legendX = Math.max(
    plotLeft,
    plotLeft + ((plotRight - plotLeft - legendTotalWidth) / 2)
  );

  const centeredLegendItems = legendItems.map((item, index) => {
    const x = legendX;
    const measuredWidth = legendMeasurementContext
      ? legendMeasurementContext.measureText(item.label).width
      : item.label.length * 7;
    legendX += measuredWidth;
    if (index < legendItems.length - 1) {
      legendX += legendItemPadding;
    }

    if (item.className) {
      return `<text x="${x}" y="${legendY}" class="${item.className}">${item.label}</text>`;
    }

    return `<text x="${x}" y="${legendY}" font-size="12" fill="${item.fill}" font-weight="600">${item.label}</text>`;
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

      ${centeredLegendItems}

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

      const parentGroup = button.closest('.nav-group');
      if (parentGroup) {
        parentGroup.classList.add('expanded');
      }
    });
  });
}

function setupNavHierarchy() {
  document.querySelectorAll('[data-nav-group-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const group = toggle.closest('.nav-group');

      if (group) {
        group.classList.toggle('expanded');
      }
    });
  });
}

function setupDateAutoFormat() {
  // Selector covers the static dashboard/current-state date inputs
  // and the dynamic per-site activation date cells (data-field="activation")
  const DATE_INPUT_SELECTOR = '#targetFpsDateKPI, #targetLpiKPI, #currentStateAsOfDate, [data-field="activation"]';

  // focusout bubbles (unlike blur), so one listener on document handles
  // both static inputs and dynamically rendered site-table inputs
  document.addEventListener('focusout', event => {
    const el = event.target;
    if (!el.matches(DATE_INPUT_SELECTOR)) return;

    const raw = el.value.trim();
    if (!raw) return;

    const parsed = parseDateInput(raw);
    if (parsed && !Number.isNaN(parsed.getTime())) {
      el.value = formatDate(parsed);   // DD-Mmm-YYYY
    }
  });
}

function setupGlobalActionButtons() {
  document.querySelectorAll('[data-global-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.globalAction;

      if (action === 'save') {
        saveStateToFile();
        return;
      }

      if (action === 'load') {
        const loadStateFileInput = document.getElementById('loadStateFile');
        if (!loadStateFileInput) {
          return;
        }

        loadStateFileInput.value = '';
        loadStateFileInput.click();
        return;
      }

      if (action === 'runForecast') {
        runForecast();
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
    'averagePricePerParticipantKPI',
    'targetFpsDateKPI',
    'targetLpiKPI',
    'currentStateAsOfDate'
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

  const saveStateButton = document.getElementById('saveStateBtn');
  if (saveStateButton) {
    saveStateButton.addEventListener('click', saveStateToFile);
  }

  const loadStateButton = document.getElementById('loadStateBtn');
  const loadStateFileInput = document.getElementById('loadStateFile');

  if (loadStateButton && loadStateFileInput) {
    loadStateButton.addEventListener('click', () => {
      loadStateFileInput.value = '';
      loadStateFileInput.click();
    });

    loadStateFileInput.addEventListener('change', event => {
      const selectedFile = event.target.files && event.target.files[0];

      if (!selectedFile) {
        window.alert('Please select a JSON file to load.');
        return;
      }

      readFileAsText(
        selectedFile,
        fileText => {
          loadStateFromText(fileText);
        },
        message => {
          window.alert(message);
        }
      );
    });
  }

  const downloadSiteCsvTemplateBtn = document.getElementById('downloadSiteCsvTemplateBtn');
  if (downloadSiteCsvTemplateBtn) {
    downloadSiteCsvTemplateBtn.addEventListener('click', downloadSiteCsvTemplate);
  }

  const importSiteCsvBtn = document.getElementById('importSiteCsvBtn');
  const siteCsvFileInput = document.getElementById('siteCsvFileInput');

  if (importSiteCsvBtn && siteCsvFileInput) {
    importSiteCsvBtn.addEventListener('click', () => {
      siteCsvFileInput.value = '';
      siteCsvFileInput.click();
    });

    siteCsvFileInput.addEventListener('change', event => {
      const selectedFile = event.target.files && event.target.files[0];

      if (!selectedFile) {
        window.alert('Please select a CSV file to import.');
        return;
      }

      readFileAsText(
        selectedFile,
        fileText => {
          importSitesFromCsvText(fileText);
        },
        message => {
          window.alert(message);
        }
      );
    });
  }

  const exportSiteCsvBtn = document.getElementById('exportSiteCsvBtn');
  if (exportSiteCsvBtn) {
    exportSiteCsvBtn.addEventListener('click', exportSitesToCsv);
  }

  const resetSiteMaxBtn = document.getElementById('resetSiteMaxBtn');
  if (resetSiteMaxBtn) {
    resetSiteMaxBtn.addEventListener('click', resetSiteMaxParticipants);
  }
}

function initializeCurrentStateAsOfDate() {
  const existingValue = getTextValue('currentStateAsOfDate', '').trim();
  if (!existingValue) {
    setValueIfExists('currentStateAsOfDate', formatDate(new Date()));
  }
}

setupNavigation();
setupNavHierarchy();
setupInputListeners();
setupGlobalActionButtons();
setupDateAutoFormat();
initializeCurrentStateAsOfDate();
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

const generateBestScenarioBtn = document.getElementById('generateBestScenarioBtn');
if (generateBestScenarioBtn) {
  generateBestScenarioBtn.addEventListener('click', generateBestAddOnScenario);
}

runForecast(false);
