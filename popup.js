// popup.js

// // Toggle for checking website data
// let checkWebsiteDataEnabled = false;
// document.getElementById('toggleWebsiteData').addEventListener('click', () => {
//   checkWebsiteDataEnabled = !checkWebsiteDataEnabled;

//   if (checkWebsiteDataEnabled) {
//     const email = document.getElementById('emailInput').value;

//     chrome.runtime.sendMessage({ action: 'checkDataLeaks', email }, (response) => {
//       const { hibpData, websiteDataUsage } = response;

//       // Display HaveIBeenPwned data
//       document.getElementById('hibpResults').innerHTML = formatData(hibpData);

//       // Display website data usage (headers, cookies, local and session storage)
//       if (websiteDataUsage.error) {
//         document.getElementById('websiteDataUsage').innerHTML = `<p style="color:red;">${websiteDataUsage.error}</p>`;
//       } else {
//         const headerEntries = websiteDataUsage.headers.map(([key, value]) => `${key}: ${value}`).join('<br>');
//         const localStorageEntries = websiteDataUsage.localStorageData.map(([key, value]) => `${key}: ${value}`).join('<br>');
//         const sessionStorageEntries = websiteDataUsage.sessionStorageData.map(([key, value]) => `${key}: ${value}`).join('<br>');

//         document.getElementById('websiteDataUsage').innerHTML = `
//           <strong>Cookies:</strong> ${websiteDataUsage.cookies || 'No cookies found'}<br>
//           <strong>Headers:</strong> <br>${headerEntries}<br>
//           <strong>Local Storage:</strong> <br>${localStorageEntries}<br>
//           <strong>Session Storage:</strong> <br>${sessionStorageEntries}
//         `;
//       }
//     });
//   } else {
//     document.getElementById('websiteDataUsage').innerHTML = ''; // Clear data when toggle is off
//   }
// });

// Toggle for document design mode
// let designModeEnabled = false;
// document.getElementById('toggleDesignMode').addEventListener('click', () => {
//   designModeEnabled = true;
//   chrome.runtime.sendMessage({ action: 'toggleDesignMode', enable: designModeEnabled });
// });

// Toggle for CSS of selected element
// let cssModeEnabled = false;
// document.getElementById('toggleCSSInspector').addEventListener('click', () => {
//   cssModeEnabled = true;

//   if (cssModeEnabled) {
//     chrome.runtime.sendMessage({ action: 'toggleCSSInspector' });
//     chrome.runtime.onMessage.addListener((message) => {
//       if (message.action === 'elementCss') {
//         document.getElementById('selectedCss').innerHTML = `<pre>${message.cssText}</pre>`;
//       }
//     });
//   } else {
//     document.getElementById('selectedCss').innerHTML = ''; // Clear CSS data when toggle is off
//   }
// });

/*function formatData(data) {
  if (data.error) {
    return `<p style="color: red;">${data.error}</p>`;
  }
  if (data.message) {
    return `<p>${data.message}</p>`;
  }
  return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}*/


// Toggle for checking website data
let checkWebsiteDataEnabled = false;
document.getElementById('toggleWebsiteData').addEventListener('click', () => {
  checkWebsiteDataEnabled = !checkWebsiteDataEnabled;

  if (checkWebsiteDataEnabled) {
    const email = document.getElementById('emailInput').value;
    const websiteUrl = document.getElementById('websiteInput').value;

    chrome.runtime.sendMessage({ action: 'checkDataLeaks', email, websiteUrl }, (response) => {
      const { hibpData, websiteDataUsage } = response;

      // Display HaveIBeenPwned data
      document.getElementById('hibpResults').innerHTML = formatData(hibpData);

      // Display website data usage (headers, cookies, local and session storage)
      if (websiteDataUsage.error) {
        document.getElementById('websiteDataUsage').innerHTML = `<p style="color:red;">${websiteDataUsage.error}</p>`;
      } else {
        const headerEntries = websiteDataUsage.headers.map(([key, value]) => `${key}: ${value}`).join('<br>');
        const localStorageEntries = websiteDataUsage.localStorageData.map(([key, value]) => `${key}: ${value}`).join('<br>');
        const sessionStorageEntries = websiteDataUsage.sessionStorageData.map(([key, value]) => `${key}: ${value}`).join('<br>');

        document.getElementById('websiteDataUsage').innerHTML = `
          <strong>Cookies:</strong> ${websiteDataUsage.cookies || 'No cookies found'}<br>
          <strong>Headers:</strong> <br>${headerEntries}<br>
          <strong>Local Storage:</strong> <br>${localStorageEntries}<br>
          <strong>Session Storage:</strong> <br>${sessionStorageEntries}
        `;
      }
    });
  } else {
    document.getElementById('websiteDataUsage').innerHTML = ''; // Clear data when toggle is off
  }
});

// Toggle for document design mode
// Function to toggle document design mode
document.getElementById('toggleDesignMode').addEventListener('click', () => {
  if (document.designMode === 'off') {
    document.designMode = 'on';
  } else {
    document.designMode = 'off';
  }
});

// Function to enable CSS inspection on element click
document.getElementById('toggleCSSInspector').addEventListener('click', () => {
  document.body.addEventListener('click', function handleClick(event) {
    const element = event.target;
    const computedStyle = window.getComputedStyle(element);
    
    let cssText = '';
    for (let property of computedStyle) {
      cssText += `${property}: ${computedStyle.getPropertyValue(property)};\n`;
    }
    
    // Display CSS in the popup
    document.getElementById('cssInspectorResults').textContent = cssText;

    // Prevent the click event from triggering other elements
    event.preventDefault();
    event.stopPropagation();
    
    // Remove the event listener to prevent re-triggering after inspection
    document.body.removeEventListener('click', handleClick);
  });
});

function formatData(data) {
  if (data.error) {
    return `<p style="color: red;">${data.error}</p>`;
  }
  if (data.message) {
    return `<p>${data.message}</p>`;
  }
  return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}