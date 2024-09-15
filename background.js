// background.js

// Function to check HaveIBeenPwned
async function checkHaveIBeenPwned(email) {
    const hibpApiKey = 'YOUR_HIBP_API_KEY'; // Replace with your actual API key
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'hibp-api-key': hibpApiKey,
          'Accept': 'application/json'
        }
      });
  
      if (response.status === 200) {
        const data = await response.json();
        return data; // Array of breaches
      } else if (response.status === 404) {
        return { message: 'No breaches found for this email.' };
      } else {
        return { message: 'Error fetching data from HaveIBeenPwned.' };
      }
    } catch (error) {
      console.error("Error in checkHaveIBeenPwned:", error);
      return { error: 'Failed to fetch data from HaveIBeenPwned.' };
    }
  }
  
  // Function to get current active tab URL
  function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let activeTab = tabs[0];
      let activeTabUrl = activeTab.url;
      callback(activeTabUrl);
    });
  }
  
  // Function to check what user data the current website collects
  async function checkWebsiteDataUsage(tabUrl) {
    try {
      const response = await fetch(tabUrl, {
        method: 'GET'
      });
      const headers = [...response.headers.entries()];  // Extract headers
      const cookies = document.cookie;                 // Extract cookies
      const localStorageData = Object.entries(localStorage); // Extract local storage
      const sessionStorageData = Object.entries(sessionStorage); // Extract session storage
  
      return {
        headers,
        cookies,
        localStorageData,
        sessionStorageData
      };
    } catch (error) {
      console.error("Error fetching website data:", error);
      return { error: 'Error fetching website data' };
    }
  }
  
  // Enable/disable document design mode
  function toggleDesignMode(tabId, enable) {
    const code = `document.designMode = "${enable ? 'on' : 'off'}";`;
    chrome.tabs.executeScript(tabId, { code });
  }
  
  // Get CSS of selected element in the active tab
  function getElementCss(tabId) {
    const code = `
      document.addEventListener("click", function(event) {
        const selectedElement = event.target;
        const computedStyle = window.getComputedStyle(selectedElement);
        const cssText = Array.from(computedStyle).map(key => \`\${key}: \${computedStyle.getPropertyValue(key)}\`).join('; ');
  
        chrome.runtime.sendMessage({ action: 'elementCss', cssText });
      });
    `;
    chrome.tabs.executeScript(tabId, { code });
  }
  
  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'checkDataLeaks') {
      const { email } = message;
      const hibpData = await checkHaveIBeenPwned(email);
  
      getCurrentTabUrl(async (tabUrl) => {
        const websiteDataUsage = await checkWebsiteDataUsage(tabUrl);
  
        sendResponse({
          hibpData,
          websiteDataUsage
        });
      });
      return true;
    } else if (message.action === 'toggleDesignMode') {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTabId = tabs[0].id;
        toggleDesignMode(activeTabId, message.enable);
      });
    } else if (message.action === 'toggleCSSInspector') {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTabId = tabs[0].id;
        getElementCss(activeTabId);
      });
    }
  });
  
  