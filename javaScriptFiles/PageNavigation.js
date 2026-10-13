import { IS_DEBUG_MODE } from './javaScriptSettings.js';

const modules = import.meta.glob('/{javaScriptFiles,jQueryFiles,TypeScriptFiles,WebAPiFiles}/**/*.{js,ts}');

// Importér jQuery
import $ from 'jquery';

// Importér dit stylesheet
import '../StyleSheetFiles/StyleSheetLess1.css';

let links;
let cache;

// Funktionen HandleNavigationBar står for at sætte den/de fremhævede farve/farver
// på den nuværende aktive *.html fil => det nuværende aktive menupunkt.
function HandleNavigationBar(pageUrl) 
{
    // Fjerner 'active' klassen fra alle a-tags i navigationsbaren
    const navLinks = document.querySelectorAll('.navbar-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Fjerner 'MenuCurrentItemParent' klassen fra alle dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('MenuCurrentItemParent');
    });

    // Itererer over hvert nav-link
    for (const link of navLinks) 
    {
        // Vi kan have elementer, der ikke har dataset.htmlpageurl defineret. 
        // Så det tjekker vi lige på først.
        // Hvis ikke dataset.htmlpageurl er defineret, er det ikke en *.html side,
        // Så vi kan bare skippe dette element.
        if (link.dataset.htmlpageurl)
        {
            // Bemærk: 'textContent' eller 'innerText' erstatter $(this).text()
            if (link.dataset.htmlpageurl.trim() === pageUrl)
            {
                // Tilføjer 'active' klassen til det matchende link
                link.classList.add('active');

                // Tjekker, om den øvre forælder har 'dropdown-menu' klassen
                if (link.parentNode.parentNode.classList.contains('dropdown-menu')) 
                {
                    // Tilføjer 'MenuCurrentItemParent' til den korrekte forælder (den der har 'dropdown' klassen)
                    link.parentNode.parentNode.parentNode.classList.add('MenuCurrentItemParent');
                }
                // 'break' afslutter løkken, ligesom 'return false' i jQuery's .each()
                break;
            }
        }
    }
}

function RemovePathFromFileName(pageUrl)
{
  var SubString = pageUrl.substring(pageUrl.lastIndexOf('/') + 1);
  return SubString;
}

async function prefetchPages() {
    for (const link of links) {
        if (link.dataset.prefetch === 'true') {
            const url = link.dataset.htmlpageurl;
            if (!cache.has(url)) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Prefetch fejl for ${url}: ${response.statusText}`);
                    const text = await response.text();
                    cache.set(url, text);
                } catch (e) {
                    console.warn(e);
                }
            }
        }
    }
}

// Forsøger at parse data-callbackparams string til et passende JS objekt eller value
function parseCallbackParams(paramStr) {
    if (!paramStr) return undefined;
    try {
        // Hvis det er gyldig JSON, returneres det parsed JSON (objekt, array, tal, string)
        return JSON.parse(paramStr);
    } catch {
        // Hvis det fejler, returneres stringen som den er
        return paramStr;
    }
}

async function handlePageLoad(link) {
    const htmlPageUrl = link.dataset.htmlpageurl;
    const jsModuleUrl = link.dataset.jsmoduleurl;  
    const callbackFunctionName = link.dataset.callbackfunctionname;
    const targetClassName = link.dataset.targetclassname;
    const loadOnce = link.dataset.loadOnce === 'true';

    const target = document.querySelector(`.${targetClassName}`);
    if (!target) {
        console.error(`Kan ikke finde target med klasse '${targetClassName}'`);
        return;
    }

    if (loadOnce && target.dataset.loaded === 'true') {
        return;
    }

    try {
        let htmlContent;
        if (cache.has(htmlPageUrl)) {
            htmlContent = cache.get(htmlPageUrl);
        } else {
            const response = await fetch(htmlPageUrl);
            if (!response.ok) throw new Error(`Fejl ved hentning af ${htmlPageUrl}: ${response.statusText}`);
            htmlContent = await response.text();
            if (link.dataset.prefetch === 'true') {
                cache.set(htmlPageUrl, htmlContent);
            }
        }

        target.innerHTML = htmlContent;
        target.dataset.loaded = 'true';
        HandleNavigationBar(htmlPageUrl);

        let module;

        if (jsModuleUrl && callbackFunctionName) 
        {
            if (IS_DEBUG_MODE) 
            {
                module = await import(jsModuleUrl);
            }
            else
            {
                // Opret den korrekte relative sti til import.meta.glob
                const fullPath = jsModuleUrl;

                if (modules[fullPath]) 
                {
                    module = await modules[fullPath]();
                }
                else
                {
                    console.error(`Modul ikke fundet: ${fullPath}`);
                    return;
                }
            }

            const rawParams = link.dataset.callbackparams;
            const params = parseCallbackParams(rawParams);

            if (typeof module[callbackFunctionName] === 'function') {
                if (params !== undefined) {
                    module[callbackFunctionName](params);
                } else {
                    module[callbackFunctionName]();
                }
            } else {
                console.error(`Callback '${callbackFunctionName}' ikke fundet i modulet '${jsModuleUrl}'`);
            }
        }
    } catch (error) {
        console.error('Fejl ved load af side eller modul:', error);
    }
}

function setupLinksAndCache()
{
    links = document.querySelectorAll('[data-htmlpageurl]');
    cache = new Map(); // Cache til prefetch og load-once
}

document.addEventListener('DOMContentLoaded', () => {
    setupLinksAndCache();
    // links = document.querySelectorAll('[data-htmlpageurl]');
    // cache = new Map(); // Cache til prefetch og load-once

    links.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            await handlePageLoad(link);
        });
    });

    const defaultLink = document.querySelector('[data-default="true"]');
    if (defaultLink) {
        handlePageLoad(defaultLink);
    }

    prefetchPages();
});

// Tilføj kun dette i din udviklingskonfiguration
if (IS_DEBUG_MODE) {
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      setupLinksAndCache();  
      const defaultLink = document.querySelector('[data-default="true"]');
      if (defaultLink) {
        handlePageLoad(defaultLink);
      }
    });
  }
}

// if (IS_DEBUG_MODE) {
//     if (import.meta.hot) {
//     import.meta.hot.accept('../**/*.html', () => {
//         // Når en HTML-fil ændres, udløser vi en genindlæsning af den aktive side.
//         const defaultLink = document.querySelector('[data-default="true"]');
//         if (defaultLink) {
//         handlePageLoad(defaultLink);
//         }
//     });
//     }
// }



// Ny kode med mulighed for at blande parametere herunder. 
// Min ChatGPT limit er overskredet, så jeg må vente med denne implementering.
// document.addEventListener("DOMContentLoaded", () => {
//     const links = document.querySelectorAll("[data-htmlpageurl]");
//     const contentFrame = document.querySelector(".ContentFrameForHTMLFiles");
//     const pageCache = {};

//     async function loadPage(url, loadOnce, prefetch) {
//         if (loadOnce && pageCache[url]) {
//             contentFrame.innerHTML = pageCache[url];
//             return;
//         }
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Kunne ikke hente ${url}`);
//         const html = await response.text();
//         if (loadOnce || prefetch) {
//             pageCache[url] = html;
//         }
//         contentFrame.innerHTML = html;
//         HandleNavigationBar(url);
//     }

//     async function runCallback(jsmoduleurl, callbackFunctionName, rawParams) {
//         if (!callbackFunctionName) return;
//         //const fn = window[functionName];
//         const module = await import(jsmoduleurl);
//         const fn = module[callbackFunctionName]; 
//         if (typeof fn === "function") {
//             let params = [];
//             if (rawParams) {
//                 try {
//                     const parsed = JSON.parse(rawParams);
//                     if (Array.isArray(parsed)) {
//                         params = parsed; // Flere argumenter
//                     } else {
//                         params = [parsed]; // Én værdi pakkes i array
//                     }
//                 } catch {
//                     // Hvis ikke gyldig JSON, send som streng
//                     params = [rawParams];
//                 }
//             }
//             fn(...params); // Spread som separate argumenter
//         } else {
//             console.warn(`Callback-funktion "${functionName}" findes ikke.`);
//         }
//     }

//     // Prefetch sider
//     links.forEach(link => {
//         if (link.dataset.prefetch === "true") {
//             fetch(link.dataset.htmlpageurl)
//                 .then(res => res.ok ? res.text() : Promise.reject())
//                 .then(html => pageCache[link.dataset.htmlpageurl] = html)
//                 .catch(err => console.warn("Prefetch fejl:", err));
//         }
//     });

//     // Klik-håndtering
//     links.forEach(link => {
//         link.addEventListener("click", async (e) => {
//             e.preventDefault();
//             const { htmlpageurl, loadonce, prefetch, jsmoduleurl, callbackfunctionname, callbackparams } = link.dataset;
//             await loadPage(htmlpageurl, loadonce === "true", prefetch === "true");
//             //if (jsmoduleurl === "true") {
//             if (null != jsmoduleurl) {
//                 runCallback(jsmoduleurl, callbackfunctionname, callbackparams);
//             }
//         });
//     });

//     // Load default-side ved startup
//     const defaultLink = document.querySelector("[data-default='true']");
//     if (defaultLink) {
//         defaultLink.click();
//     }
// });
