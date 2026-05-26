// --- STATE MANAGEMENT ---
let currentVideoId = null;
let dwellTimer = null;
let watchedShortsToday = new Set();

// Safely generate local date string
function getLocalDateString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}

// --- DEFENSIVE UI OVERLAY GENERATION ---
function createFlashOverlay() {
  // 1. Guard Clause: Don't recreate if it already exists
  if (document.getElementById('shorts-flash-overlay')) return;

  // 2. Guard Clause: If the document body isn't ready yet, abort and let the interval retry
  const targetContainer = document.body || document.documentElement;
  if (!targetContainer) return;

  const flashDiv = document.createElement('div');
  flashDiv.id = 'shorts-flash-overlay';
  
  flashDiv.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 45vw !important;  
    height: 45vh !important; 
    background-color: rgba(0, 0, 0, 0.00001) !important;
    color: #ffffff !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: min(20vw, 20vh) !important; 
    font-weight: 900 !important;
    font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif !important;
    z-index: 2147483647 !important; 
    pointer-events: none !important; 
    opacity: 0 !important;
    transition: opacity 0.5s ease-out !important;
  `;

  targetContainer.appendChild(flashDiv);
}

// --- SAFE ANIMATION CALLS ---
function flashTheNumber(count) {
  const flashDiv = document.getElementById('shorts-flash-overlay');
  if (!flashDiv) return; // Prevention: Avoids operating on null elements

  flashDiv.textContent = count;
  flashDiv.style.transition = 'none';
  flashDiv.style.opacity = '1';

  setTimeout(() => {
    // Re-verify the box still exists in case YouTube flushed the layout mid-timer
    const activeOverlay = document.getElementById('shorts-flash-overlay');
    if (activeOverlay) {
      activeOverlay.style.transition = 'opacity 0.3s ease-out';
      activeOverlay.style.opacity = '0';
    }
  }, 500);
}

// --- EVALUATE URL SAFELY ---
function evaluateCurrentShort() {
  // Use optional chaining/safety guards on window properties
  const currentUrl = window?.location?.href;
  if (!currentUrl) return;

  const urlMatches = currentUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (!urlMatches) return;

  const detectedId = urlMatches[1];

  if (detectedId !== currentVideoId) {
    currentVideoId = detectedId;
    
    if (dwellTimer) clearTimeout(dwellTimer);
    if (watchedShortsToday.has(currentVideoId)) return;

    dwellTimer = setTimeout(() => {
      executeCountIncrement(currentVideoId);
    }, 1000);
  }
}

function executeCountIncrement(videoId) {
  const today = getLocalDateString();
  
  // Verify extension runtime context is valid before executing storage lookups
  if (!chrome?.storage?.local) return;

  chrome.storage.local.get([today], (result) => {
    // Catch disconnected port errors caused by sudden browser reboots
    if (chrome.runtime.lastError) return; 

    let currentCount = result[today] || 0;
    let newCount = currentCount + 1;

    chrome.storage.local.set({ [today]: newCount }, () => {
      if (chrome.runtime.lastError) return;
      watchedShortsToday.add(videoId); 
      flashTheNumber(newCount);
    });
  });
}

// --- RESILIENT RUNNERS ---
// This safely watches the layout without crashing if elements change properties mid-render
const runEngineSafely = () => {
  createFlashOverlay();
  evaluateCurrentShort();
};

// Handle internal dynamic panel mutations safely via an anonymous guard wrapper
const safeObserver = new MutationObserver(() => {
  try {
    evaluateCurrentShort();
  } catch (e) {
    // Catches layout mutations silently without crashing the main worker engine thread
  }
});

// Listen to YouTube's native master navigation loop
window.addEventListener('yt-navigate-start', () => {
  if (window.location.href.includes('/shorts/')) {
    createFlashOverlay(); 
    evaluateCurrentShort();
  }
});

// Structural initialization loop
const verifyEngine = setInterval(() => {
  if (document.body) {
    clearInterval(verifyEngine);
    
    // Only run the setup if we are currently on a short
    if (window.location.href.includes('/shorts/')) {
      runEngineSafely();
    }

    // Always start observing the body so we catch when YouTube navigates to a Short!
    safeObserver.observe(document.body, { childList: true, subtree: true });
  }
}, 400);