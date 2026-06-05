/**
 * MB15 OS — Frontend Application Logic (Tailwind Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- APPLICATION STATE ---
  const state = {
    activeTab: 'search',
    quota: {
      used: 0,
      limit: 1000,
      remaining: 1000,
      percent: 0
    },
    plan: 'starter',
    lastSearchResults: [],
    activeLookupType: 'email',
    activeModalProfile: null,
    activeModalTab: 'identity'
  };

  // --- HTML ELEMENTS CACHE ---
  const el = {
    // Theme Switcher
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeToggleIcon: document.getElementById('theme-toggle-icon'),

    // Sidebar & Navigation
    menuItems: document.querySelectorAll('#sidebar-menu a[data-tab]'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    healthDot: document.getElementById('health-dot'),
    healthText: document.getElementById('health-text'),
    sidebarQuotaPercent: document.getElementById('quota-percent'),
    sidebarQuotaFillBar: document.getElementById('quota-fill-bar'),
    sidebarQuotaNumerical: document.getElementById('quota-numerical'),
    
    // Top Bar Header Widgets
    currentPageTitle: document.getElementById('current-page-title'),
    currentPageSubtitle: document.getElementById('current-page-subtitle'),
    headerPlanName: document.getElementById('header-plan-name'),
    headerQuotaRemaining: document.getElementById('header-quota-remaining'),

    // Search Console Form
    searchForm: document.getElementById('search-form'),
    btnResetForm: document.getElementById('btn-reset-form'),
    accordionHeaders: document.querySelectorAll('.accordion-header'),
    searchFlexible: document.getElementById('search-flexible'),
    searchPerPage: document.getElementById('search-per-page'),
    searchPage: document.getElementById('search-page'),
    btnSearchSubmit: document.getElementById('btn-search-submit'),

    // Search Console Results Viewport
    resultsViewport: document.getElementById('results-viewport'),
    resultsStatsBanner: document.getElementById('results-stats-banner'),
    resultsCountBadge: document.getElementById('results-count-badge'),
    resultsTookBadge: document.getElementById('results-took-badge'),
    resultsPaginationControls: document.getElementById('search-pagination-controls'),
    resultsTbody: document.getElementById('search-results-tbody'),
    btnViewCards: document.getElementById('btn-view-cards'),
    btnViewTable: document.getElementById('btn-view-table'),
    searchResultsCards: document.getElementById('search-results-cards'),
    searchResultsTableContainer: document.getElementById('search-results-table-container'),

    // Viewport States
    stateEmpty: document.getElementById('state-empty'),
    stateLoading: document.getElementById('state-loading'),
    stateError: document.getElementById('state-error'),
    stateNoResults: document.getElementById('state-no-results'),
    stateResults: document.getElementById('state-results'),
    errorTitle: document.getElementById('error-title'),
    errorDescription: document.getElementById('error-description'),
    btnErrorRetry: document.getElementById('btn-error-retry'),

    // Reverse Lookup Console
    lookupForm: document.getElementById('lookup-form'),
    lookupQueryInput: document.getElementById('lookup-query'),
    lookupTabBtns: document.querySelectorAll('.lookup-tab-btn'),
    lookupInputIcon: document.getElementById('lookup-input-icon'),
    lookupHelpText: document.getElementById('lookup-help-text'),
    lookupResultsViewport: document.getElementById('lookup-results-viewport'),
    
    // Reverse Lookup States
    lookupStateEmpty: document.getElementById('lookup-state-empty'),
    lookupStateLoading: document.getElementById('lookup-state-loading'),
    lookupStateError: document.getElementById('lookup-state-error'),
    lookupErrorDesc: document.getElementById('lookup-error-desc'),
    lookupProfileCard: document.getElementById('lookup-profile-card'),
    
    // Reverse Lookup Profile Data Fields
    lookupProfileFullname: document.getElementById('lookup-profile-fullname'),
    lookupConfidenceBadge: document.getElementById('lookup-confidence-badge'),
    lookupConfidenceValue: document.getElementById('lookup-confidence-value'),
    lookupDetailsIdentity: document.getElementById('lookup-details-identity'),
    lookupDetailsContact: document.getElementById('lookup-details-contact'),
    lookupDetailsLocation: document.getElementById('lookup-details-location'),
    lookupSourcesPills: document.getElementById('lookup-sources-pills'),
    btnLookupExport: document.getElementById('btn-lookup-export'),

    // Stats & Clé Panel
    statsPlanName: document.getElementById('stats-plan-name'),
    statsQuotaLimit: document.getElementById('stats-quota-limit'),
    statsPerQuery: document.getElementById('stats-per-query'),
    statsPaginationStatus: document.getElementById('stats-pagination-status'),
    statsLogsStatus: document.getElementById('stats-logs-status'),
    statsUsedReq: document.getElementById('stats-used-req'),
    statsRemainingReq: document.getElementById('stats-remaining-req'),
    gaugeCircleFill: document.getElementById('gauge-circle-fill'),
    gaugeTextPercent: document.getElementById('gauge-text-percent'),
    diagApiDot: document.getElementById('diag-api-dot'),
    diagApiText: document.getElementById('diag-api-text'),
    diagLatencyVal: document.getElementById('diag-latency-val'),
    diagKeyObfuscated: document.getElementById('diag-key-obfuscated'),
    btnRefreshStats: document.getElementById('btn-refresh-stats'),

    // Developer Sandbox
    btnSandboxTemplate: document.getElementById('btn-sandbox-template'),
    btnSandboxRun: document.getElementById('btn-sandbox-run'),
    sandboxReqBody: document.getElementById('sandbox-req-body'),
    sandboxResStatus: document.getElementById('sandbox-res-status'),
    sandboxResBody: document.getElementById('sandbox-res-body'),
    btnSandboxCopy: document.getElementById('btn-sandbox-copy'),

    // Profile Modal
    profileDetailModal: document.getElementById('profile-detail-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    modalFullname: document.getElementById('modal-fullname'),
    modalSub: document.getElementById('modal-sub'),
    modalConfidenceBar: document.getElementById('modal-confidence-bar'),
    modalConfidenceVal: document.getElementById('modal-confidence-val'),
    modalTabBtns: document.querySelectorAll('.modal-tab-btn'),
    modalTabPanels: document.querySelectorAll('.modal-tab-panel'),
    modalTableIdentity: document.getElementById('modal-table-identity'),
    modalTableContact: document.getElementById('modal-table-contact'),
    modalTableAddress: document.getElementById('modal-table-address'),
    modalTableExtra: document.getElementById('modal-table-extra'),
    modalSourcesPills: document.getElementById('modal-sources-pills'),
    btnModalCopyJson: document.getElementById('btn-modal-copy-json'),
    btnModalExport: document.getElementById('btn-modal-export')
  };

  // --- INITIALIZATION ---
  initTheme();
  loadCachedQuota(); // Load cached quotas to avoid extra API request on reload
  initSearchView(); // Setup double view switcher
  initMobileNavHider(); // Hide bottom nav on mobile when inputs are focused

  // --- LOCALSTORAGE QUOTA CACHING ---
  function loadCachedQuota() {
    const cached = localStorage.getItem('mb15_quota');
    const cachedPlan = localStorage.getItem('mb15_plan');
    const cachedDetails = localStorage.getItem('mb15_plan_details');
    
    if (cached && cachedPlan) {
      state.quota = JSON.parse(cached);
      state.plan = cachedPlan;
      const details = cachedDetails ? JSON.parse(cachedDetails) : null;
      
      // Update UI widgets using cached details
      updateQuotaUI({
        plan: state.plan,
        daily_used: state.quota.used,
        daily_quota: state.quota.limit,
        daily_remaining: state.quota.remaining,
        results_per_query: details?.results_per_query || 10,
        pagination_enabled: details?.pagination_enabled || false
      });
      
      // Set operational status by default from cache
      el.healthDot.className = 'w-2 h-2 rounded-full bg-success';
      el.healthText.textContent = 'Service Opérationnel';

      // Fetch fresh data in the background to ensure it is up-to-date
      fetchAccountDetails();
      fetchHealthStatus();
    } else {
      // First load: query the API to setup UI counters
      fetchAccountDetails();
      fetchHealthStatus();
    }
  }

  function saveQuotaToCache(details = null) {
    localStorage.setItem('mb15_quota', JSON.stringify(state.quota));
    localStorage.setItem('mb15_plan', state.plan);
    if (details) {
      localStorage.setItem('mb15_plan_details', JSON.stringify({
        results_per_query: details.results_per_query,
        pagination_enabled: details.pagination_enabled
      }));
    }
  }

  // --- SEARCH VIEW TOGGLE & DIODES ---
  function initSearchView() {
    state.searchView = localStorage.getItem('mb15_search_view') || 'cards';
    updateSearchViewUI();

    if (el.btnViewCards && el.btnViewTable) {
      el.btnViewCards.addEventListener('click', () => {
        state.searchView = 'cards';
        localStorage.setItem('mb15_search_view', 'cards');
        updateSearchViewUI();
      });
      el.btnViewTable.addEventListener('click', () => {
        state.searchView = 'table';
        localStorage.setItem('mb15_search_view', 'table');
        updateSearchViewUI();
      });
    }

    if (el.searchForm) {
      el.searchForm.addEventListener('input', updateAccordionStatus);
      // Run once initially to display indicator lights if there's prefilled data
      updateAccordionStatus();
    }
  }

  function updateSearchViewUI() {
    if (!el.searchResultsCards || !el.searchResultsTableContainer) return;
    
    if (state.searchView === 'cards') {
      el.searchResultsCards.classList.remove('hidden');
      el.searchResultsTableContainer.classList.add('hidden');
      if (el.btnViewCards && el.btnViewTable) {
        el.btnViewCards.className = "px-2 py-0.5 text-[10px] rounded-md flex items-center gap-xs transition-all bg-primary-container text-on-primary-container font-bold";
        el.btnViewTable.className = "px-2 py-0.5 text-[10px] rounded-md flex items-center gap-xs transition-all text-on-surface-variant hover:text-on-surface";
      }
    } else {
      el.searchResultsCards.classList.add('hidden');
      el.searchResultsTableContainer.classList.remove('hidden');
      if (el.btnViewCards && el.btnViewTable) {
        el.btnViewCards.className = "px-2 py-0.5 text-[10px] rounded-md flex items-center gap-xs transition-all text-on-surface-variant hover:text-on-surface";
        el.btnViewTable.className = "px-2 py-0.5 text-[10px] rounded-md flex items-center gap-xs transition-all bg-primary-container text-on-primary-container font-bold";
      }
    }
  }

  function updateAccordionStatus() {
    el.accordionHeaders.forEach(header => {
      const item = header.closest('.accordion-item');
      if (!item) return;
      const inputs = item.querySelectorAll('input, select');
      let hasValue = false;
      inputs.forEach(input => {
        if (input.type === 'checkbox') {
          // Skip
        } else if (input.value && input.value.trim() !== '') {
          hasValue = true;
        }
      });
      
      let dot = header.querySelector('.accordion-status-dot');
      if (hasValue) {
        if (!dot) {
          dot = document.createElement('span');
          dot.className = 'accordion-status-dot w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00f0ff] ml-sm transition-all duration-300';
          header.querySelector('div').appendChild(dot);
        }
      } else {
        if (dot) dot.remove();
      }
    });
  }

  // --- MOBILE NAV HIDE ON INPUT FOCUS ---
  function initMobileNavHiding() {
    const mobileNav = document.querySelector('nav.fixed');
    document.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        if (window.innerWidth < 768 && mobileNav) {
          mobileNav.classList.add('mobile-nav-hidden');
        }
      }
    });
    document.addEventListener('focusout', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        if (window.innerWidth < 768 && mobileNav) {
          mobileNav.classList.remove('mobile-nav-hidden');
        }
      }
    });
  }
  
  // --- THEME MANAGEMENT ---
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      el.themeToggleIcon.textContent = 'light_mode';
    } else {
      document.documentElement.classList.remove('dark');
      el.themeToggleIcon.textContent = 'dark_mode';
    }
    
    el.themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        el.themeToggleIcon.textContent = 'dark_mode';
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        el.themeToggleIcon.textContent = 'light_mode';
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- INIT ALL ---
  initTheme();
  initMobileNavHiding();

  // --- ROUTING / NAVIGATION ---
  el.menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tabName = item.getAttribute('data-tab');
      state.activeTab = tabName;

      // Update active links styling using Tailwind classes
      el.menuItems.forEach(link => {
        link.className = "flex flex-col md:flex-row items-center gap-1 md:gap-md px-3 py-1.5 md:px-md md:py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 transition-colors duration-200 w-full rounded-xl md:rounded-none text-center md:text-left";
        // Reset symbols fill variant
        const symbol = link.querySelector('.material-symbols-outlined');
        if (symbol) symbol.style.fontVariationSettings = "";
      });

      // Highlight active link
      item.className = "flex flex-col md:flex-row items-center gap-1 md:gap-md px-3 py-1.5 md:px-md md:py-sm bg-primary-container/10 md:bg-surface-variant/30 text-primary-container border-b-2 md:border-b-0 md:border-l-2 border-primary-container shadow-[0_0_15px_rgba(0,240,255,0.12)] border border-primary-container/20 w-full rounded-xl md:rounded-none text-center md:text-left";
      const activeSymbol = item.querySelector('.material-symbols-outlined');
      if (activeSymbol) activeSymbol.style.fontVariationSettings = "'FILL' 1";

      // Update active panels
      el.tabPanels.forEach(panel => {
        panel.classList.add('hidden');
        if (panel.id === `tab-content-${tabName}`) {
          panel.classList.remove('hidden');
        }
      });

      // Update page headers
      updateHeaderTitles(tabName);
    });
  });

  function updateHeaderTitles(tab) {
    const titles = {
      search: {
        title: "Recherche Multi-Critères",
        sub: "Recherchez à travers toutes nos sources de données à l'aide de filtres combinés."
      },
      lookup: {
        title: "Reverse Lookup",
        sub: "Identifiez le titulaire d'une adresse email, d'un numéro de téléphone ou d'un IBAN."
      },
      stats: {
        title: "Statistiques & Clé API",
        sub: "Suivez votre consommation journalière et analysez les limites de votre plan."
      },
      sandbox: {
        title: "Console Développeur",
        sub: "Testez directement des requêtes MB15 en syntaxe JSON brute et analysez le flux."
      }
    };
    
    if (titles[tab]) {
      el.currentPageTitle.textContent = titles[tab].title;
      el.currentPageSubtitle.textContent = titles[tab].sub;
    }
  }

  // --- ACCORDIONS IN SEARCH FORM ---
  el.accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const chevron = item.querySelector('.accordion-chevron');
      
      const isOpen = !content.classList.contains('hidden');
      
      // Close all accordions in search form first to keep it clean (optional but recommended for UX)
      // We will just toggle the clicked one for flexibility
      if (isOpen) {
        content.classList.add('hidden');
        chevron.textContent = 'expand_more';
        header.querySelector('div').className = "flex items-center gap-sm text-on-surface";
        item.classList.remove('active');
      } else {
        content.classList.remove('hidden');
        chevron.textContent = 'expand_less';
        header.querySelector('div').className = "flex items-center gap-sm text-primary-container";
        item.classList.add('active');
      }
    });
  });

  // --- ACCOUNT INFO & CONSUMPTION FETCH ---
  async function fetchAccountDetails() {
    try {
      const response = await fetch('/api/me');
      if (!response.ok) throw new Error('Erreur de récupération des informations de clé.');
      
      const resData = await response.json();
      if (resData.status === 200 && resData.data) {
        const info = resData.data;
        
        // Update stats state
        state.plan = info.plan;
        state.quota.used = info.daily_used;
        state.quota.limit = info.daily_quota;
        state.quota.remaining = info.daily_remaining;
        state.quota.percent = Math.min(100, Math.round((info.daily_used / info.daily_quota) * 100));

        updateQuotaUI(info);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function updateQuotaUI(info) {
    const cleanPlan = info.plan.toUpperCase().replace('_', ' ');
    
    // Top-bar Widgets
    el.headerPlanName.textContent = cleanPlan;
    el.headerQuotaRemaining.textContent = info.daily_remaining.toLocaleString();
    
    // Sidebar quota monitor - Calculate remaining quota percentage
    const remainingPercent = info.daily_quota > 0 ? Math.max(0, Math.min(100, Math.round((info.daily_remaining / info.daily_quota) * 100))) : 100;
    el.sidebarQuotaPercent.textContent = `${remainingPercent}%`;
    el.sidebarQuotaFillBar.style.width = `${remainingPercent}%`;
    el.sidebarQuotaNumerical.textContent = `${info.daily_used.toLocaleString()} / ${info.daily_quota.toLocaleString()} reqs`;

    // Apply warn status to progress bars if remaining quota is low
    if (remainingPercent <= 15) {
      el.sidebarQuotaFillBar.className = "h-full bg-error transition-all duration-500";
    } else if (remainingPercent <= 40) {
      el.sidebarQuotaFillBar.className = "h-full bg-warning transition-all duration-500";
    } else {
      el.sidebarQuotaFillBar.className = "h-full bg-primary-container transition-all duration-500";
    }

    // Stats page widgets
    if (el.statsPlanName) {
      el.statsPlanName.textContent = cleanPlan;
      el.statsQuotaLimit.textContent = info.daily_quota.toLocaleString();
      el.statsPerQuery.textContent = info.results_per_query;
      el.statsPaginationStatus.textContent = info.pagination_enabled ? 'Activée (Illimitée)' : 'Page 1 uniquement';
      el.statsLogsStatus.textContent = ['pro', 'enterprise', 'max_10k', 'max_100k'].includes(info.plan) ? 'Disponible' : 'Non incluse';
      el.statsUsedReq.textContent = info.daily_used.toLocaleString();
      el.statsRemainingReq.textContent = info.daily_remaining.toLocaleString();
      
      // Animate circular progress gauge
      // circumference = 2 * PI * r = 2 * 3.14159 * 52 = 326.7
      const maxOffset = 326.7;
      const offset = maxOffset - (maxOffset * state.quota.percent) / 100;
      el.gaugeCircleFill.style.strokeDashoffset = offset;
      el.gaugeTextPercent.textContent = `${state.quota.percent}%`;
    }
    saveQuotaToCache(info);
  }

  // --- HEALTH CHECK FETCH ---
  async function fetchHealthStatus() {
    const startTime = Date.now();
    try {
      const response = await fetch('/api/health');
      const latency = Date.now() - startTime;
      
      if (!response.ok) throw new Error();
      
      const resData = await response.json();
      const status = resData.message || 'operational';
      
      const isOperational = status === 'operational';
      
      // Sidebar indicator
      el.healthDot.className = `w-2 h-2 rounded-full ${isOperational ? 'bg-success' : 'bg-error animate-pulse'}`;
      el.healthText.textContent = isOperational ? 'Service Opérationnel' : 'Service Dégradé';

      // Stats Diagnostic Dashboard
      if (el.diagApiDot) {
        el.diagApiDot.className = `w-3 h-3 rounded-full ${isOperational ? 'bg-success' : 'bg-error animate-pulse'}`;
        el.diagApiText.textContent = isOperational ? 'Opérationnel' : 'Dégradé / Hors-ligne';
        el.diagLatencyVal.textContent = `${latency} ms`;
        el.diagKeyObfuscated.textContent = "brix_********************************";
      }
    } catch (err) {
      el.healthDot.className = 'w-2 h-2 rounded-full bg-error animate-pulse';
      el.healthText.textContent = 'Indisponible';
      
      if (el.diagApiDot) {
        el.diagApiDot.className = 'w-3 h-3 rounded-full bg-error animate-pulse';
        el.diagApiText.textContent = 'Bases inaccessibles';
        el.diagLatencyVal.textContent = 'Timeout';
      }
    }
  }

  if (el.btnRefreshStats) {
    el.btnRefreshStats.addEventListener('click', () => {
      el.btnRefreshStats.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span>Actualisation...`;
      Promise.all([fetchAccountDetails(), fetchHealthStatus()]).finally(() => {
        el.btnRefreshStats.innerHTML = `<span class="material-symbols-outlined text-[18px]">sync</span>Actualiser les données`;
      });
    });
  }

  // Helper to parse rate limits from headers
  function updateQuotaFromHeaders(headers) {
    const remaining = headers.get('x-ratelimit-remaining-day');
    const limit = headers.get('x-ratelimit-limit-day');
    if (remaining !== null && limit !== null) {
      const remNum = parseInt(remaining, 10);
      const limNum = parseInt(limit, 10);
      const usedNum = limNum - remNum;
      const percent = Math.min(100, Math.round((usedNum / limNum) * 100));
      const remainingPercent = limNum > 0 ? Math.max(0, Math.min(100, Math.round((remNum / limNum) * 100))) : 100;

      state.quota.remaining = remNum;
      state.quota.limit = limNum;
      state.quota.used = usedNum;
      state.quota.percent = percent;

      // Update UI widgets
      el.headerQuotaRemaining.textContent = remNum.toLocaleString();
      el.sidebarQuotaPercent.textContent = `${remainingPercent}%`;
      el.sidebarQuotaFillBar.style.width = `${remainingPercent}%`;
      el.sidebarQuotaNumerical.textContent = `${usedNum.toLocaleString()} / ${limNum.toLocaleString()} reqs`;

      // Apply warn status to progress bars if remaining quota is low
      if (remainingPercent <= 15) {
        el.sidebarQuotaFillBar.className = "h-full bg-error transition-all duration-500";
      } else if (remainingPercent <= 40) {
        el.sidebarQuotaFillBar.className = "h-full bg-warning transition-all duration-500";
      } else {
        el.sidebarQuotaFillBar.className = "h-full bg-primary-container transition-all duration-500";
      }

      saveQuotaToCache();
    }
  }

  // --- SEARCH/LOOKUP CACHING CONTROLLER ---
  function getSearchCacheKey(query) {
    const keys = Object.keys(query).filter(k => k !== 'force').sort();
    const parts = keys.map(k => `${k}:${query[k]}`);
    return parts.join('|');
  }

  // Helper to filter out blocked names (Bouzoumita, Marzoug) from frontend rendering
  function clientFilterBlockedNames(results) {
    if (!results) return results;
    const isArray = Array.isArray(results);
    const list = isArray ? results : [results];
    
    const filtered = list.filter(profile => {
      const fields = [
        profile.nom_famille,
        profile.prenom,
        profile.nom_naissance,
        profile.nom_affichage,
        profile.nom_utilisateur
      ];
      for (const field of fields) {
        if (typeof field === 'string') {
          const lower = field.toLowerCase();
          if (lower.includes('bouzoumita') || lower.includes('marzoug')) {
            return false;
          }
        }
      }
      return true;
    });
    
    return isArray ? filtered : (filtered[0] || null);
  }

  function getCachedSearch(query) {
    try {
      const cacheStr = localStorage.getItem('mb15_search_cache');
      if (!cacheStr) return null;
      const cache = JSON.parse(cacheStr);
      const key = getSearchCacheKey(query);
      const cachedItem = cache[key];
      if (!cachedItem) return null;
      
      const age = Date.now() - cachedItem.timestamp;
      if (age > 259200000) { // 72 hours expiry
        delete cache[key];
        localStorage.setItem('mb15_search_cache', JSON.stringify(cache));
        return null;
      }
      
      if (cachedItem.results) {
        cachedItem.results = clientFilterBlockedNames(cachedItem.results);
      }
      
      return cachedItem;
    } catch (e) {
      return null;
    }
  }

  function saveSearchToCache(query, results, meta) {
    try {
      let cache = {};
      const cacheStr = localStorage.getItem('mb15_search_cache');
      if (cacheStr) cache = JSON.parse(cacheStr);
      
      const key = getSearchCacheKey(query);
      cache[key] = {
        results,
        meta,
        timestamp: Date.now()
      };
      
      const cachedKeys = Object.keys(cache);
      if (cachedKeys.length > 50) {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const k of cachedKeys) {
          if (cache[k].timestamp < oldestTime) {
            oldestTime = cache[k].timestamp;
            oldestKey = k;
          }
        }
        if (oldestKey) delete cache[oldestKey];
      }
      
      localStorage.setItem('mb15_search_cache', JSON.stringify(cache));
    } catch (e) {
      console.error(e);
    }
  }

  function getLookupCacheKey(type, value) {
    return `${type}:${value.trim().toLowerCase()}`;
  }

  function getCachedLookup(type, value) {
    try {
      const cacheStr = localStorage.getItem('mb15_lookup_cache');
      if (!cacheStr) return null;
      const cache = JSON.parse(cacheStr);
      const key = getLookupCacheKey(type, value);
      const cachedItem = cache[key];
      if (!cachedItem) return null;
      
      const age = Date.now() - cachedItem.timestamp;
      if (age > 259200000) { // 72 hours
        delete cache[key];
        localStorage.setItem('mb15_lookup_cache', JSON.stringify(cache));
        return null;
      }
      
      if (cachedItem.profile) {
        const filtered = clientFilterBlockedNames(cachedItem.profile);
        if (!filtered) return null;
        cachedItem.profile = filtered;
      }
      
      return cachedItem;
    } catch (e) {
      return null;
    }
  }

  // Cache lookup profiles
  function saveLookupToCache(type, value, profile) {
    try {
      let cache = {};
      const cacheStr = localStorage.getItem('mb15_lookup_cache');
      if (cacheStr) cache = JSON.parse(cacheStr);
      
      const key = getLookupCacheKey(type, value);
      cache[key] = {
        profile,
        timestamp: Date.now()
      };
      
      const cachedKeys = Object.keys(cache);
      if (cachedKeys.length > 100) {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const k of cachedKeys) {
          if (cache[k].timestamp < oldestTime) {
            oldestTime = cache[k].timestamp;
            oldestKey = k;
          }
        }
        if (oldestKey) delete cache[oldestKey];
      }
      
      localStorage.setItem('mb15_lookup_cache', JSON.stringify(cache));
    } catch (e) {
      console.error(e);
    }
  }

  // --- SEARCH CONSOLE ACTIONS ---
  el.btnResetForm.addEventListener('click', (e) => {
    e.preventDefault();
    el.searchForm.reset();
  });

  el.searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Gather all fields
    const formData = new FormData(el.searchForm);
    const searchBody = {};

    formData.forEach((value, key) => {
      if (value.trim() !== '') {
        // Convert numbers
        if (['jour_naissance', 'mois_naissance', 'page', 'per_page'].includes(key)) {
          searchBody[key] = parseInt(value, 10);
        } else if (key === 'flexible') {
          // Checkbox is handled separately
        } else {
          searchBody[key] = value;
        }
      }
    });

    // Flexible switch
    searchBody.flexible = el.searchFlexible.checked;
    
    // Pagination & limits override
    searchBody.per_page = parseInt(el.searchPerPage.value, 10);
    searchBody.page = parseInt(el.searchPage.value, 10);

    // Empty validation (excluding options keys)
    const queryKeys = Object.keys(searchBody).filter(k => !['flexible', 'page', 'per_page'].includes(k));
    if (queryKeys.length === 0) {
      alert("Veuillez saisir au moins un critère de recherche.");
      return;
    }

    executeSearch(searchBody);
  });

  async function executeSearch(searchQuery, forceReload = false) {
    const hasBlockedName = Object.values(searchQuery).some(val => {
      if (typeof val === 'string') {
        const lower = val.toLowerCase();
        return lower.includes('bouzoumita') || lower.includes('marzoug');
      }
      return false;
    });

    if (hasBlockedName) {
      setTimeout(() => {
        showSearchBlockedMessage();
      }, 100);
      return;
    }

    toggleSearchState('loading');
    
    // Check search cache
    if (!forceReload) {
      const cachedData = getCachedSearch(searchQuery);
      if (cachedData) {
        // Brief artificial loader delay for organic feel
        setTimeout(() => {
          state.lastSearchResults = cachedData.results;
          toggleSearchState('results');
          renderSearchResultsTable(cachedData.results, cachedData.meta, true); // true = cache load
        }, 200);
        return;
      }
    }
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchQuery)
      });

      updateQuotaFromHeaders(response.headers);

      const resJson = await response.json();
      
      if (response.status !== 200) {
        showSearchError(resJson.status, resJson.message || "Erreur de serveur");
        return;
      }

      const results = resJson.data?.results || [];
      const meta = resJson.meta || {};

      state.lastSearchResults = results;

      if (results.length === 0) {
        toggleSearchState('no-results');
      } else {
        saveSearchToCache(searchQuery, results, meta);
        toggleSearchState('results');
        renderSearchResultsTable(results, meta, false); // false = API load
      }

    } catch (err) {
      console.error(err);
      showSearchError(500, "Erreur de connexion au proxy local. Assurez-vous que le serveur tourne.");
    }
  }

  function toggleSearchState(stateName) {
    // Hide all viewports
    el.stateEmpty.classList.add('hidden');
    el.stateLoading.classList.add('hidden');
    el.stateError.classList.add('hidden');
    el.stateNoResults.classList.add('hidden');
    el.stateResults.classList.add('hidden');

    // Remove viewport alignments
    el.resultsViewport.classList.remove('items-center', 'justify-center');

    if (stateName === 'empty') {
      el.stateEmpty.classList.remove('hidden');
      el.resultsViewport.classList.add('items-center', 'justify-center');
    }
    if (stateName === 'loading') {
      el.stateLoading.classList.remove('hidden');
      el.resultsViewport.classList.add('items-center', 'justify-center');
    }
    if (stateName === 'error') {
      el.stateError.classList.remove('hidden');
      el.resultsViewport.classList.add('items-center', 'justify-center');
    }
    if (stateName === 'no-results') {
      el.stateNoResults.classList.remove('hidden');
      el.resultsViewport.classList.add('items-center', 'justify-center');
    }
    if (stateName === 'results') {
      el.stateResults.classList.remove('hidden');
    }

    // Mobile smooth scroll to results viewport
    if (stateName !== 'empty' && window.innerWidth < 768 && el.resultsViewport) {
      setTimeout(() => {
        el.resultsViewport.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function showSearchError(code, message) {
    toggleSearchState('error');
    el.errorTitle.textContent = `Erreur ${code || ''}`;
    
    let advice = "Vérifiez vos paramètres.";
    if (code === 401) advice = "La clé API MB15 est invalide ou expirée.";
    if (code === 429) advice = "Votre quota journalier a été dépassé ou vous subissez une limite de requêtes par minute.";
    if (code === 403) advice = "Cette fonctionnalité nécessite un plan supérieur.";
    if (code === 400) advice = "Paramètres de recherche invalides. Modifiez vos critères.";

    el.errorDescription.innerHTML = `${message}<br><small class="opacity-70">${advice}</small>`;
  }

  function showSearchBlockedMessage() {
    toggleSearchState('error');
    el.errorTitle.textContent = "Accès Refusé";
    el.errorDescription.innerHTML = `<span class="text-error font-bold text-lg">Cherche pas mon nom, enculé. Par contre, tu peux rechercher keryne, ça ce n'est pas bloqué.</span>`;
    if (el.btnErrorRetry) {
      el.btnErrorRetry.textContent = "Retour";
    }
  }

  el.btnErrorRetry.addEventListener('click', () => {
    toggleSearchState('empty');
  });

  function renderSearchResultsTable(results, meta, isFromCache = false) {
    el.resultsCountBadge.textContent = `${meta.total} résultat${meta.total > 1 ? 's' : ''}`;
    el.resultsTookBadge.textContent = `${meta.took_ms} ms`;
    
    // Clear old cache indicators
    const oldIndicator = document.getElementById('cache-indicator');
    if (oldIndicator) oldIndicator.remove();
    const oldRefresh = document.getElementById('btn-force-refresh-search');
    if (oldRefresh) oldRefresh.remove();

    if (isFromCache) {
      // 1. Cache badge
      const cacheIndicator = document.createElement('span');
      cacheIndicator.id = 'cache-indicator';
      cacheIndicator.className = 'bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm';
      cacheIndicator.innerHTML = '<span class="material-symbols-outlined text-[12px]">database</span>Données en cache';
      el.resultsCountBadge.parentNode.appendChild(cacheIndicator);
      
      // 2. Force refresh button
      const forceRefreshBtn = document.createElement('button');
      forceRefreshBtn.id = 'btn-force-refresh-search';
      forceRefreshBtn.className = 'text-xs text-primary-container hover:text-primary underline flex items-center gap-xs ml-md transition-colors';
      forceRefreshBtn.innerHTML = '<span class="material-symbols-outlined text-[14px]">sync</span>Forcer l\'actualisation';
      forceRefreshBtn.addEventListener('click', () => {
        executeSearch(meta.query, true); // Force reload
      });
      el.resultsCountBadge.parentNode.appendChild(forceRefreshBtn);
    }
    
    el.resultsTbody.innerHTML = '';
    if (el.searchResultsCards) el.searchResultsCards.innerHTML = '';
    
    // Filter results on the client side before rendering
    const cleanResults = clientFilterBlockedNames(results);
    
    cleanResults.forEach((profile, index) => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-surface-variant/20 transition-colors";
      
      // Confidence score styling
      const confidence = profile._confidence || 0;
      let confColorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_8px_rgba(251,113,133,0.15)]';
      let confDotColor = 'bg-rose-500 shadow-[0_0_6px_#f43f5e]';
      if (confidence >= 80) {
        confColorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.15)]';
        confDotColor = 'bg-emerald-500 shadow-[0_0_6px_#10b981]';
      } else if (confidence >= 50) {
        confColorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_8px_rgba(251,191,36,0.15)]';
        confDotColor = 'bg-amber-500 shadow-[0_0_6px_#f59e0b]';
      }

      // Fullname builder
      let fullName = "- Sans nom -";
      if (profile.prenom || profile.nom_famille) {
        fullName = `${profile.prenom || ''} ${profile.nom_famille || ''}`.trim();
      } else if (profile.nom_affichage) {
        fullName = profile.nom_affichage;
      } else if (profile.nom_utilisateur) {
        fullName = `@${profile.nom_utilisateur}`;
      }

      // Contact snippet builder
      const contactBits = [];
      if (profile.email) contactBits.push(`<span class="flex items-center gap-xs text-xs" title="Email"><span class="material-symbols-outlined text-[12px] text-on-surface-variant">mail</span>${profile.email}</span>`);
      if (profile.telephone) contactBits.push(`<span class="flex items-center gap-xs text-xs" title="Téléphone"><span class="material-symbols-outlined text-[12px] text-on-surface-variant">call</span>${profile.telephone}</span>`);
      const contactHtml = contactBits.length > 0 ? `<div class="space-y-0.5">${contactBits.join('')}</div>` : '<span class="text-on-surface-variant/40 text-xs">Aucune coordonnée</span>';

      // Location builder
      let location = '';
      if (profile.ville && profile.code_postal) {
        location = `${profile.ville} (${profile.code_postal})`;
      } else {
        location = profile.ville || profile.pays || '<span class="text-on-surface-variant/40">—</span>';
      }

      // Sources badges builder
      const sources = profile._sources || [];
      const sourcesHtml = sources.length > 0
        ? sources.slice(0, 2).map(s => `<span class="px-1.5 py-0.5 text-[10px] bg-surface-variant/50 text-on-surface-variant rounded border border-outline-variant/30">${s}</span>`).join('') + (sources.length > 2 ? `<span class="px-1.5 py-0.5 text-[10px] bg-surface-variant/50 text-on-surface-variant rounded border border-outline-variant/30" title="${sources.slice(2).join(', ')}">+${sources.length - 2}</span>` : '')
        : '<span class="text-on-surface-variant/40 text-[10px]">Aucune</span>';

      // --- 1. RENDER TABLE ROW ---
      tr.innerHTML = `
        <td class="p-md">
          <span class="px-2.5 py-0.5 text-xs font-bold font-mono rounded-full border ${confColorClass}">${confidence}%</span>
        </td>
        <td class="p-md font-bold text-on-surface">${fullName}</td>
        <td class="p-md text-on-surface-variant">${contactHtml}</td>
        <td class="p-md text-on-surface-variant text-sm">${location}</td>
        <td class="p-md">
          <div class="flex flex-wrap gap-xs">${sourcesHtml}</div>
        </td>
        <td class="p-md text-right">
          <button class="px-3 py-1.5 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container text-xs font-bold rounded-xl border border-primary-container/30 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] btn-inspect-profile" data-index="${index}">
            Analyser
          </button>
        </td>
      `;
      el.resultsTbody.appendChild(tr);

      // --- 2. RENDER GRID CARD ---
      if (el.searchResultsCards) {
        // Initials avatar builder
        let initials = '';
        if (profile.prenom) initials += profile.prenom.charAt(0).toUpperCase();
        if (profile.nom_famille) initials += profile.nom_famille.charAt(0).toUpperCase();
        if (!initials && profile.nom_affichage) initials = profile.nom_affichage.substring(0, 2).toUpperCase();
        if (!initials) initials = '??';

        let subName = profile.nom_utilisateur ? `@${profile.nom_utilisateur}` : 'Fiche consolidée';
        
        let cardEmail = profile.email 
          ? `<span class="flex items-center gap-xs text-[11px] text-on-surface/90 truncate w-full" title="${profile.email}"><span class="material-symbols-outlined text-[13px] text-on-surface-variant shrink-0">mail</span><span class="truncate min-w-0 flex-1">${profile.email}</span></span>` 
          : '';
        let cardPhone = profile.telephone || profile.mobile
          ? `<span class="flex items-center gap-xs text-[11px] text-on-surface/90 truncate w-full" title="Téléphone"><span class="material-symbols-outlined text-[13px] text-on-surface-variant shrink-0">call</span><span class="truncate min-w-0 flex-1">${profile.telephone || profile.mobile}</span></span>` 
          : '';
        let cardContacts = cardEmail || cardPhone
          ? `${cardEmail}${cardPhone}`
          : '<span class="text-on-surface-variant/40 italic block text-[11px]">Aucune coordonnée</span>';

        const cardDiv = document.createElement('div');
        cardDiv.className = "glass-panel rounded-2xl p-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/30 hover:border-primary-container/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,240,255,0.1)] w-full min-w-0";
        cardDiv.innerHTML = `
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>
          
          <div class="flex items-start justify-between mb-sm min-w-0">
            <div class="flex items-center gap-md min-w-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-container/15 to-secondary/15 border border-primary-container/30 flex items-center justify-center text-primary-container font-black text-sm shadow-[0_0_12px_rgba(0,240,255,0.1)] shrink-0">
                ${initials}
              </div>
              <div class="min-w-0">
                <h4 class="font-bold text-on-surface text-sm tracking-tight truncate">${fullName}</h4>
                <span class="text-[10px] text-on-surface-variant font-mono block truncate">${subName}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full border ${confColorClass} flex items-center gap-xs shrink-0">
              <span class="w-1.5 h-1.5 rounded-full ${confDotColor}"></span>
              ${confidence}%
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-sm text-[11px] border-t border-b border-outline-variant/20 py-2.5 my-2 min-w-0">
            <div class="space-y-1 min-w-0">
              <span class="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Contact</span>
              <div class="space-y-0.5 truncate w-full min-w-0">${cardContacts}</div>
            </div>
            <div class="space-y-1 min-w-0">
              <span class="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Localisation</span>
              <span class="flex items-center gap-xs text-on-surface/90 truncate min-w-0 w-full" title="${location.replace(/<[^>]*>/g, '')}">
                <span class="material-symbols-outlined text-[13px] text-primary-container shrink-0">location_on</span>
                <span class="truncate min-w-0 flex-1">${location}</span>
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-sm">
            <div class="flex flex-wrap gap-xs">
              ${sourcesHtml}
            </div>
            <button class="px-3 py-1.5 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container text-xs font-black rounded-xl border border-primary-container/30 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] btn-inspect-profile flex items-center gap-xs" data-index="${index}">
              <span class="material-symbols-outlined text-[13px]">visibility</span>Analyser
            </button>
          </div>
        `;
        el.searchResultsCards.appendChild(cardDiv);
      }
    });

    // Attach inspect click handlers to both tables and cards
    document.querySelectorAll('.btn-inspect-profile').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-index');
        openProfileModal(state.lastSearchResults[idx]);
      });
    });

    // Handle pagination drawing
    renderPagination(meta);
  }

  function renderPagination(meta) {
    el.resultsPaginationControls.innerHTML = '';
    
    if (!meta.pages || meta.pages <= 1) return;

    // Helper button builder
    const createBtn = (html, isDisabled, clickHandler, isActive = false) => {
      const btn = document.createElement('button');
      btn.className = `w-7 h-7 flex items-center justify-center rounded border border-outline-variant/60 font-mono text-xs transition-colors ${isActive ? 'bg-primary-container text-on-primary-container border-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`;
      btn.innerHTML = html;
      btn.disabled = isDisabled;
      if (isDisabled) btn.style.opacity = "0.4";
      btn.addEventListener('click', clickHandler);
      return btn;
    };

    // Previous Button
    const prevBtn = createBtn('<span class="material-symbols-outlined text-[16px]">chevron_left</span>', meta.page <= 1, () => {
      el.searchPage.value = meta.page - 1;
      el.searchForm.requestSubmit();
    });
    el.resultsPaginationControls.appendChild(prevBtn);

    // Draw smart page numbers
    const startPage = Math.max(1, meta.page - 2);
    const endPage = Math.min(meta.pages, meta.page + 2);

    if (startPage > 1) {
      el.resultsPaginationControls.appendChild(createBtn('1', false, () => {
        el.searchPage.value = 1;
        el.searchForm.requestSubmit();
      }));
      
      if (startPage > 2) {
        const dots = document.createElement('span');
        dots.className = "text-on-surface-variant px-1 font-mono text-xs";
        dots.textContent = '...';
        el.resultsPaginationControls.appendChild(dots);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      el.resultsPaginationControls.appendChild(createBtn(p, false, () => {
        el.searchPage.value = p;
        el.searchForm.requestSubmit();
      }, p === meta.page));
    }

    if (endPage < meta.pages) {
      if (endPage < meta.pages - 1) {
        const dots = document.createElement('span');
        dots.className = "text-on-surface-variant px-1 font-mono text-xs";
        dots.textContent = '...';
        el.resultsPaginationControls.appendChild(dots);
      }
      
      el.resultsPaginationControls.appendChild(createBtn(meta.pages, false, () => {
        el.searchPage.value = meta.pages;
        el.searchForm.requestSubmit();
      }));
    }

    // Next Button
    const nextBtn = createBtn('<span class="material-symbols-outlined text-[16px]">chevron_right</span>', meta.page >= meta.pages, () => {
      el.searchPage.value = meta.page + 1;
      el.searchForm.requestSubmit();
    });
    el.resultsPaginationControls.appendChild(nextBtn);
  }

  // --- REVERSE LOOKUP CONTROLLER ---
  el.lookupTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      el.lookupTabBtns.forEach(b => {
        b.classList.remove('bg-primary-container/10', 'border-primary-container/30', 'text-primary-container', 'font-semibold');
        b.classList.add('border-transparent', 'hover:bg-surface-variant/30', 'text-on-surface-variant', 'hover:text-on-surface');
      });
      btn.classList.add('bg-primary-container/10', 'border-primary-container/30', 'text-primary-container', 'font-semibold');
      btn.classList.remove('border-transparent', 'hover:bg-surface-variant/30', 'text-on-surface-variant', 'hover:text-on-surface');

      const lookupType = btn.getAttribute('data-lookup-type');
      state.activeLookupType = lookupType;

      // Update labels & placeholders dynamically
      if (lookupType === 'email') {
        el.lookupInputIcon.textContent = 'mail';
        el.lookupQueryInput.placeholder = "Saisissez une adresse email (ex: jean.dupont@gmail.com)";
        el.lookupHelpText.textContent = "Retrouvez le nom, prénom, téléphone, et adresse d'un individu à partir de son email.";
      } else if (lookupType === 'phone') {
        el.lookupInputIcon.textContent = 'call';
        el.lookupQueryInput.placeholder = "Saisissez un numéro de téléphone (ex: 0612345678)";
        el.lookupHelpText.textContent = "Tous les formats FR sont supportés (06..., +33..., 0033...).";
      } else if (lookupType === 'iban') {
        el.lookupInputIcon.textContent = 'credit_card';
        el.lookupQueryInput.placeholder = "Saisissez un numéro IBAN bancaire (ex: FR763000...)";
        el.lookupHelpText.textContent = "Retourne le titulaire officiel du compte avec ses coordonnées et le code BIC.";
      }
      
      el.lookupQueryInput.value = '';
      if (window.innerWidth >= 768) {
        el.lookupQueryInput.focus();
      }
    });
  });

  el.lookupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const queryVal = el.lookupQueryInput.value.trim();
    if (!queryVal) return;

    toggleLookupState('loading');

    // Check lookup cache
    const cachedProfile = getCachedLookup(state.activeLookupType, queryVal);
    if (cachedProfile) {
      setTimeout(() => {
        toggleLookupState('results');
        renderLookupProfile(cachedProfile, true, queryVal); // true = cache load
      }, 200);
      return;
    }

    executeLookup(queryVal);
  });

  async function executeLookup(queryVal, forceReload = false) {
    const hasBlockedName = queryVal.toLowerCase().includes('bouzoumita') || queryVal.toLowerCase().includes('marzoug');
    if (hasBlockedName) {
      setTimeout(() => {
        toggleLookupState('error');
        el.lookupErrorDesc.innerHTML = `<span class="text-error font-bold text-lg">Cherche pas mon nom, enculé. Par contre, tu peux rechercher keryne, ça ce n'est pas bloqué.</span>`;
      }, 100);
      return;
    }

    toggleLookupState('loading');
    try {
      const response = await fetch(`/api/lookup/${state.activeLookupType}/${encodeURIComponent(queryVal)}`);
      
      updateQuotaFromHeaders(response.headers);
      const resJson = await response.json();

      if (response.status !== 200) {
        toggleLookupState('error');
        el.lookupErrorDesc.innerHTML = `${resJson.message || "Erreur de lookup"}<br><small class="opacity-70">Identifiant introuvable ou limites de requêtes dépassées.</small>`;
        return;
      }

      let profile = resJson.data;
      if (profile && profile.results && Array.isArray(profile.results)) {
        profile = profile.results[0];
      }

      if (!profile) {
        toggleLookupState('error');
        el.lookupErrorDesc.textContent = "Aucun profil lié trouvé pour cet identifiant.";
        return;
      }

      // Save lookup to cache
      saveLookupToCache(state.activeLookupType, queryVal, profile);

      toggleLookupState('results');
      renderLookupProfile(profile, false, queryVal); // false = API load

    } catch (err) {
      console.error(err);
      toggleLookupState('error');
      el.lookupErrorDesc.textContent = "Erreur de connexion avec le serveur proxy.";
    }
  }

  function toggleLookupState(stateName) {
    el.lookupStateEmpty.classList.add('hidden');
    el.lookupStateLoading.classList.add('hidden');
    el.lookupStateError.classList.add('hidden');
    el.lookupProfileCard.classList.add('hidden');

    if (stateName === 'empty') el.lookupStateEmpty.classList.remove('hidden');
    if (stateName === 'loading') el.lookupStateLoading.classList.remove('hidden');
    if (stateName === 'error') el.lookupStateError.classList.remove('hidden');
    if (stateName === 'results') el.lookupProfileCard.classList.remove('hidden');
  }

  function renderLookupProfile(profile, isFromCache = false, queryVal = '') {
    // Client-side block check
    const cleanProfile = clientFilterBlockedNames(profile);
    if (!cleanProfile) {
      toggleLookupState('error');
      el.lookupErrorDesc.textContent = "Aucun profil lié trouvé pour cet identifiant (nom exclu).";
      return;
    }
    state.activeLookupProfile = cleanProfile;

    // Fullname
    let fullName = "Fiche Profil Anonyme";
    if (profile.prenom || profile.nom_famille) {
      fullName = `${profile.prenom || ''} ${profile.nom_famille || ''}`.trim();
    } else if (profile.nom_affichage) {
      fullName = profile.nom_affichage;
    }
    el.lookupProfileFullname.textContent = fullName;
    
    // Inject cache badge on profile card
    const cacheIndicatorId = 'lookup-cache-indicator';
    const oldIndicator = document.getElementById(cacheIndicatorId);
    if (oldIndicator) oldIndicator.remove();
    
    if (isFromCache) {
      const container = document.createElement('div');
      container.id = cacheIndicatorId;
      container.className = 'flex items-center gap-md mt-sm';
      container.innerHTML = `
        <span class="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs px-2 py-0.5 rounded flex items-center gap-xs">
          <span class="material-symbols-outlined text-[12px]">database</span>Cache Local
        </span>
        <button id="btn-force-refresh-lookup" class="text-xs text-primary-container hover:text-primary underline flex items-center gap-xs transition-colors">
          <span class="material-symbols-outlined text-[14px]">sync</span>Forcer l'actualisation
        </button>
      `;
      el.lookupProfileFullname.parentNode.appendChild(container);
      
      document.getElementById('btn-force-refresh-lookup').addEventListener('click', () => {
        executeLookup(queryVal, true); // Force reload lookup
      });
    }

    // Confidence
    const confidence = profile._confidence || 0;
    el.lookupConfidenceValue.textContent = `${confidence}%`;
    
    // Identity fields
    let identityHtml = '';
    const addIdRow = (label, val) => {
      if (val) identityHtml += `<li><span class="text-xs text-on-surface-variant block">${label}</span><span class="font-bold text-on-surface">${val}</span></li>`;
    };
    addIdRow("Prénom", profile.prenom);
    addIdRow("Nom de famille", profile.nom_famille);
    addIdRow("Nom de naissance", profile.nom_naissance);
    addIdRow("Nom d'affichage", profile.nom_affichage);
    addIdRow("Pseudonyme", profile.nom_utilisateur);
    addIdRow("Genre", profile.genre === 'M' ? 'Homme' : profile.genre === 'F' ? 'Femme' : null);
    addIdRow("Civilité", profile.civilite);
    addIdRow("Date de naissance", profile.date_naissance);
    el.lookupDetailsIdentity.innerHTML = identityHtml || '<li><span class="text-on-surface-variant/40 text-sm">Aucune info d\'identité</span></li>';

    // Contact fields
    let contactHtml = '';
    const addContactRow = (label, val) => {
      if (val) contactHtml += `<li><span class="text-xs text-on-surface-variant block">${label}</span><span class="font-bold text-on-surface">${val}</span></li>`;
    };
    addContactRow("Adresse email", profile.email);
    addContactRow("Téléphone portable", profile.mobile);
    addContactRow("Téléphone fixe", profile.telephone);
    addContactRow("Adresse IP", profile.adresse_ip);
    el.lookupDetailsContact.innerHTML = contactHtml || '<li><span class="text-on-surface-variant/40 text-sm">Aucun contact trouvé</span></li>';

    // Location fields
    let locationHtml = '';
    const addLocRow = (label, val) => {
      if (val) locationHtml += `<li><span class="text-xs text-on-surface-variant block">${label}</span><span class="font-bold text-on-surface">${val}</span></li>`;
    };
    addLocRow("Adresse", profile.adresse);
    addLocRow("Complément", profile.complement_adresse);
    addLocRow("Code postal", profile.code_postal);
    addLocRow("Ville", profile.ville);
    addLocRow("Département", profile.departement);
    addLocRow("Région", profile.region);
    addLocRow("Pays", profile.pays);
    addLocRow("Ville de naissance", profile.ville_naissance);
    el.lookupDetailsLocation.innerHTML = locationHtml || '<li class="col-span-2"><span class="text-on-surface-variant/40 text-sm">Aucune coordonnée géographique</span></li>';

    // Sources
    el.lookupSourcesPills.innerHTML = '';
    const sources = profile._sources || [];
    if (sources.length > 0) {
      sources.forEach(source => {
        const span = document.createElement('span');
        span.className = 'px-2 py-1 text-xs bg-surface-variant/50 text-on-surface-variant rounded border border-outline-variant/30';
        span.textContent = source;
        el.lookupSourcesPills.appendChild(span);
      });
    } else {
      el.lookupSourcesPills.innerHTML = '<span class="text-on-surface-variant/40 text-xs">Aucune source listée</span>';
    }
  }

  // Export Lookup Profile
  if (el.btnLookupExport) {
    el.btnLookupExport.addEventListener('click', () => {
      if (!state.activeLookupProfile) return;
      downloadProfileJson(state.activeLookupProfile);
    });
  }


  // --- PROFILE DETAIL MODAL CONTROLLER ---
  function openProfileModal(profile) {
    state.activeModalProfile = profile;
    
    // Name details
    let fullName = "Fiche Profil Consolidée";
    if (profile.prenom || profile.nom_famille) {
      fullName = `${profile.prenom || ''} ${profile.nom_famille || ''}`.trim();
    } else if (profile.nom_affichage) {
      fullName = profile.nom_affichage;
    }
    el.modalFullname.textContent = fullName;
    el.modalSub.textContent = profile.nom_utilisateur ? `@${profile.nom_utilisateur}` : "ID BrixHub consolidé";

    // Confidence index
    const confidence = profile._confidence || 0;
    el.modalConfidenceVal.textContent = `${confidence}%`;
    el.modalConfidenceBar.style.width = `${confidence}%`;

    // Reset tab panels
    setModalTab('identity');
    populateModalData(profile);
    
    // Open Modal
    el.profileDetailModal.classList.remove('hidden');
  }

  function setModalTab(tabName) {
    state.activeModalTab = tabName;
    
    el.modalTabBtns.forEach(btn => {
      btn.className = "modal-tab-btn px-4 py-2 hover:bg-surface-variant/20 text-on-surface-variant hover:text-on-surface rounded-md text-xs transition-all";
      if (btn.getAttribute('data-m-tab') === tabName) {
        btn.className = "modal-tab-btn px-4 py-2 bg-surface-variant/40 text-primary-container font-semibold rounded-md text-xs transition-all";
      }
    });

    el.modalTabPanels.forEach(panel => {
      panel.classList.add('hidden');
      if (panel.id === `m-panel-${tabName}`) panel.classList.remove('hidden');
    });
  }

  el.modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setModalTab(btn.getAttribute('data-m-tab'));
    });
  });

  function populateModalData(p) {
    // Helper row builder
    const getRowHtml = (lbl, val) => {
      if (!val) return '';
      return `
        <tr>
          <td class="py-2.5 pr-4 text-on-surface-variant font-medium w-1/3">${lbl}</td>
          <td class="py-2.5 text-on-surface font-bold break-all">${val}</td>
        </tr>
      `;
    };

    // Identity Tab
    let idRows = '';
    idRows += getRowHtml("Prénom", p.prenom);
    idRows += getRowHtml("Nom de famille", p.nom_famille);
    idRows += getRowHtml("Nom de naissance", p.nom_naissance);
    idRows += getRowHtml("Nom d'affichage", p.nom_affichage);
    idRows += getRowHtml("Login / Utilisateur", p.nom_utilisateur);
    idRows += getRowHtml("Date de naissance", p.date_naissance);
    idRows += getRowHtml("Année de naissance", p.annee_naissance);
    idRows += getRowHtml("Mois de naissance", p.mois_naissance);
    idRows += getRowHtml("Jour de naissance", p.jour_naissance);
    idRows += getRowHtml("Genre", p.genre);
    idRows += getRowHtml("Civilité", p.civilite);
    el.modalTableIdentity.innerHTML = idRows || '<tr><td colspan="2" class="text-on-surface-variant/40 text-center py-6 text-sm">Aucune donnée disponible</td></tr>';

    // Contacts Tab
    let contactRows = '';
    contactRows += getRowHtml("Adresse email principal", p.email);
    contactRows += getRowHtml("Téléphone fixe / portable", p.telephone);
    contactRows += getRowHtml("Mobile", p.mobile);
    contactRows += getRowHtml("Adresse IP", p.adresse_ip);
    el.modalTableContact.innerHTML = contactRows || '<tr><td colspan="2" class="text-on-surface-variant/40 text-center py-6 text-sm">Aucune donnée disponible</td></tr>';

    // Address Tab
    let addrRows = '';
    addrRows += getRowHtml("Rue", p.adresse);
    addrRows += getRowHtml("Complément", p.complement_adresse);
    addrRows += getRowHtml("Code postal", p.code_postal);
    addrRows += getRowHtml("Ville", p.ville);
    addrRows += getRowHtml("Département", p.departement);
    addrRows += getRowHtml("Région", p.region);
    addrRows += getRowHtml("Pays", p.pays);
    addrRows += getRowHtml("Lieu de naissance", p.lieu_naissance);
    addrRows += getRowHtml("Ville de naissance", p.ville_naissance);
    el.modalTableAddress.innerHTML = addrRows || '<tr><td colspan="2" class="text-on-surface-variant/40 text-center py-6 text-sm">Aucune donnée disponible</td></tr>';

    // Extras Tab
    let extraRows = '';
    extraRows += getRowHtml("Véhicule (Plaque/VIN)", p.vin_plaque || p.immatriculation);
    extraRows += getRowHtml("Numéro de série / VIN", p.numero_serie);
    extraRows += getRowHtml("Marque du véhicule", p.marque);
    extraRows += getRowHtml("Modèle de véhicule", p.modele);
    extraRows += getRowHtml("Société", p.societe);
    extraRows += getRowHtml("Profession", p.profession);
    extraRows += getRowHtml("Fonction", p.fonction);
    extraRows += getRowHtml("Discord ID", p.discord_id);
    extraRows += getRowHtml("Steam ID", p.steam_id);
    extraRows += getRowHtml("FiveM ID", p.fivem_id);
    extraRows += getRowHtml("Licence FiveM 1", p.fivem_license);
    extraRows += getRowHtml("Licence FiveM 2", p.fivem_license2);
    extraRows += getRowHtml("Xbox Live ID", p.xbox_live_id);
    extraRows += getRowHtml("Live ID", p.live_id);
    el.modalTableExtra.innerHTML = extraRows || '<tr><td colspan="2" class="text-on-surface-variant/40 text-center py-6 text-sm">Aucune donnée disponible</td></tr>';

    // Sources pills
    el.modalSourcesPills.innerHTML = '';
    const sources = p._sources || [];
    if (sources.length > 0) {
      sources.forEach(s => {
        const span = document.createElement('span');
        span.className = 'px-2 py-1 text-xs bg-surface-variant/50 text-on-surface-variant rounded border border-outline-variant/30';
        span.textContent = s;
        el.modalSourcesPills.appendChild(span);
      });
    } else {
      el.modalSourcesPills.innerHTML = '<span class="text-on-surface-variant/40 text-xs">Aucune source répertoriée</span>';
    }
  }

  function closeModal() {
    el.profileDetailModal.classList.add('hidden');
    state.activeModalProfile = null;
  }

  el.btnCloseModal.addEventListener('click', closeModal);
  el.profileDetailModal.addEventListener('click', (e) => {
    if (e.target === el.profileDetailModal) closeModal();
  });

  // Modal actions
  el.btnModalCopyJson.addEventListener('click', () => {
    if (!state.activeModalProfile) return;
    navigator.clipboard.writeText(JSON.stringify(state.activeModalProfile, null, 2))
      .then(() => {
        const originalText = el.btnModalCopyJson.innerHTML;
        el.btnModalCopyJson.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span>Copié !`;
        setTimeout(() => {
          el.btnModalCopyJson.innerHTML = originalText;
        }, 1500);
      });
  });

  el.btnModalExport.addEventListener('click', () => {
    if (!state.activeModalProfile) return;
    downloadProfileJson(state.activeModalProfile);
  });

  // Helper download function
  function downloadProfileJson(profile) {
    const prenom = profile.prenom || 'profil';
    const nom = profile.nom_famille || 'anonyme';
    const filename = `brixhub_export_${prenom.toLowerCase()}_${nom.toLowerCase()}.json`;
    
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- DEVELOPER SANDBOX CONTROLLER ---
  const defaultTemplate = {
    nom_famille: "Dupont",
    prenom: "Jean",
    ville: "Paris",
    flexible: true,
    per_page: 10
  };

  if (el.btnSandboxTemplate) {
    el.btnSandboxTemplate.addEventListener('click', () => {
      el.sandboxReqBody.value = JSON.stringify(defaultTemplate, null, 2);
    });
  }

  if (el.btnSandboxRun) {
    el.btnSandboxRun.addEventListener('click', async () => {
      const rawVal = el.sandboxReqBody.value.trim();
      if (!rawVal) return;
      
      let parsedBody;
      try {
        parsedBody = JSON.parse(rawVal);
      } catch (err) {
        el.sandboxResStatus.textContent = "JSON INVALIDE";
        el.sandboxResStatus.className = "bg-error-container/20 text-error border border-error/30 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono";
        el.sandboxResBody.textContent = `Erreur de syntaxe JSON :\n${err.message}`;
        return;
      }

      el.sandboxResStatus.textContent = "PENDING...";
      el.sandboxResStatus.className = "bg-surface-variant text-on-surface-variant text-[10px] font-bold px-2.5 py-0.5 rounded font-mono";
      el.sandboxResBody.textContent = "Envoi de la requête au proxy...";

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedBody)
        });

        updateQuotaFromHeaders(response.headers);
        
        const resJson = await response.json();
        
        el.sandboxResStatus.textContent = `${response.status} ${response.statusText || ''}`;
        if (response.status === 200) {
          el.sandboxResStatus.className = "bg-success-container/20 text-success border border-success/30 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono";
        } else {
          el.sandboxResStatus.className = "bg-error-container/20 text-error border border-error/30 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono";
        }

        el.sandboxResBody.textContent = JSON.stringify(resJson, null, 2);

      } catch (err) {
        console.error(err);
        el.sandboxResStatus.textContent = "ERROR";
        el.sandboxResStatus.className = "bg-error-container/20 text-error border border-error/30 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono";
        el.sandboxResBody.textContent = `Erreur lors de l'exécution de la requête :\n${err.message}`;
      }
    });
  }

  if (el.btnSandboxCopy) {
    el.btnSandboxCopy.addEventListener('click', () => {
      const text = el.sandboxResBody.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalHtml = el.btnSandboxCopy.innerHTML;
        el.btnSandboxCopy.innerHTML = `<span class="material-symbols-outlined text-[16px] text-success">check</span>`;
        setTimeout(() => {
          el.btnSandboxCopy.innerHTML = originalHtml;
        }, 1500);
      });
    });
  }

  function initMobileNavHider() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const bottomNav = document.querySelector('nav.fixed');
    if (!bottomNav) return;

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (window.innerWidth < 768) {
          bottomNav.classList.add('mobile-nav-hidden');
        }
      });
      input.addEventListener('blur', () => {
        if (window.innerWidth < 768) {
          bottomNav.classList.remove('mobile-nav-hidden');
        }
      });
    });
  }

});
