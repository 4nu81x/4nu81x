// ==UserScript==
// @name         GitHub Contributions Customizer - 4nu81x
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Permanently replace the default GitHub green square contribution graph with red/yellow stars spelling 4nu81x.
// @author       4nu81x
// @match        *://github.com/*
// @match        *://*.github.com/*
// @match        *://4nu81x.com/*
// @match        *://*.4nu81x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log("n0t381x Contributions Customizer: Script Loaded.");

    const flag_path = "M 2,1 L 3,1 L 3,2 L 10,2 L 10,7 L 3,7 L 3,11 L 2,11 Z";
    const parrot_path = "M 6,1 C 5,1 4,2 3,2.5 L 2.5,3.5 L 4,4 C 4.5,5.5 5,7 5.5,9 L 5,11 L 6.5,11 L 7.5,9 C 8.5,8 9.5,6 9.5,4 C 9.5,2 8,1 6,1 Z";

    function generateShapes() {
        const width_cols = 46;
        const height_rows = 7;
        const active_pixels = new Set();
        
        // Letter 'h' (starts at 0)
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add("0," + y));
        active_pixels.add("1,3");
        active_pixels.add("2,3");
        [3,4,5,6].forEach(y => active_pixels.add("3," + y));
        
        // Letter '4' (starts at 5)
        [0,1,2,3].forEach(y => active_pixels.add("5," + y));
        active_pixels.add("6,3");
        active_pixels.add("7,3");
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add("8," + y));
        
        // Letter 'k' (starts at 10)
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add("10," + y));
        active_pixels.add("11,3");
        active_pixels.add("12,2"); active_pixels.add("12,4");
        active_pixels.add("13,1"); active_pixels.add("13,5");
        active_pixels.add("14,0"); active_pixels.add("14,6");
        
        // Letter '0' (starts at 16)
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add("16," + y));
        active_pixels.add("17,0"); active_pixels.add("17,6");
        active_pixels.add("18,0"); active_pixels.add("18,6");
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add("19," + y));
        
        // Letter 'r' (starts at 21)
        [2,3,4,5,6].forEach(y => active_pixels.add("21," + y));
        active_pixels.add("22,2");
        active_pixels.add("23,2");

        const word_start_col = 11;
        const spelled_pixels = new Set();
        active_pixels.forEach(coord => {
            const parts = coord.split(",");
            const x_rel = Number(parts[0]);
            const y = Number(parts[1]);
            spelled_pixels.add((word_start_col + x_rel) + "," + y);
        });

        const grid_start_x = 40;
        const grid_start_y = 68;
        const cell_size = 12;
        const gap = 3;

        let shapesSVG = "";
        for (let x = 0; x < width_cols; x++) {
            for (let y = 0; y < height_rows; y++) {
                const pos_x = grid_start_x + x * (cell_size + gap);
                const pos_y = grid_start_y + y * (cell_size + gap);
                const is_active = spelled_pixels.has(x + "," + y);
                const is_flag = (x + y) % 2 === 0;
                const path = is_flag ? flag_path : parrot_path;
                
                let cls = is_flag ? "flag-empty" : "parrot-empty";
                if (is_active) {
                    cls = is_flag ? "flag-active" : "parrot-active";
                }
                
                shapesSVG += '<g transform="translate(' + pos_x + ', ' + pos_y + ')"><path d="' + path + '" class="' + cls + '" /></g>';
            }
        }
        return shapesSVG;
    }

    function getCustomSVG() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 185" width="100%" height="100%">
<style>
  .bg { fill: transparent; }
  .label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 11px; fill: var(--color-fg-muted, #8b949e); }
  .header { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; fill: var(--color-fg-default, #adbac7); }
  .flag-empty { fill: var(--color-calendar-graph-day-bg, #21262d); }
  .parrot-empty { fill: var(--color-calendar-graph-day-bg, #21262d); }
  .flag-active { animation: color-cycle-a 2.5s infinite linear; }
  .parrot-active { animation: color-cycle-b 2.5s infinite linear; }

  @keyframes color-cycle-a {
    0% { fill: #ff453a; }
    25% { fill: #39ff14; }
    50% { fill: #bf5af2; }
    75% { fill: #ffd60a; }
    100% { fill: #ff453a; }
  }

  @keyframes color-cycle-b {
    0% { fill: #bf5af2; }
    25% { fill: #ffd60a; }
    50% { fill: #ff453a; }
    75% { fill: #39ff14; }
    100% { fill: #bf5af2; }
  }
</style>
  <rect width="780" height="185" class="bg" />
  <text x="25" y="32" class="header">1,303 contributions in the last year</text>
  <text x="40" y="56" class="label">Jun</text>
  <text x="95" y="56" class="label">Jul</text>
  <text x="155" y="56" class="label">Aug</text>
  <text x="215" y="56" class="label">Sep</text>
  <text x="275" y="56" class="label">Oct</text>
  <text x="335" y="56" class="label">Nov</text>
  <text x="395" y="56" class="label">Dec</text>
  <text x="455" y="56" class="label">Jan</text>
  <text x="515" y="56" class="label">Feb</text>
  <text x="575" y="56" class="label">Mar</text>
  <text x="635" y="56" class="label">Apr</text>
  <text x="695" y="56" class="label">May</text>
  <text x="15" y="80" class="label">Mon</text>
  <text x="15" y="110" class="label">Wed</text>
  <text x="15" y="140" class="label">Fri</text>
  <!-- Generated Shapes from script -->` + generateShapes() + `
  <!-- Bottom Legend (Less -> More) -->
  <text x="25" y="171" class="label">Learn how we count contributions</text>
  <text x="580" y="171" class="label">Less</text>
  <g transform="translate(610, 162)"><path d="` + flag_path + `" class="flag-empty" /></g>
  <g transform="translate(625, 162)"><path d="` + parrot_path + `" class="parrot-active" /></g>
  <g transform="translate(640, 162)"><path d="` + flag_path + `" class="flag-active" /></g>
  <text x="659" y="171" class="label">More</text>
</svg>`;
    }

    function isProfilePage() {
        const username = '4nu81x';
        const hostname = window.location.hostname;
        if (hostname.includes('4nu81x.com')) {
            return true;
        }
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        return pathParts.length === 1 && pathParts[0].toLowerCase() === username;
    }

    // Function to perform the replacement
    function replaceGraph() {
        if (!isProfilePage()) {
            return;
        }

        // 1. Target the SVG container class first to preserve year selectors
        const calendarGraph = document.querySelector('.js-calendar-graph');
        if (calendarGraph) {
            if (calendarGraph.querySelector('.flag-active') || calendarGraph.querySelector('.parrot-active')) {
                return;
            }
            console.log("n0t381x Contributions Customizer: Replacing calendar graph...");
            calendarGraph.innerHTML = getCustomSVG();
            return;
        }

        // 2. Fallback to the full yearly contributions wrapper
        const yearlyContributions = document.querySelector('.js-yearly-contributions');
        if (yearlyContributions) {
            if (yearlyContributions.querySelector('.flag-active') || yearlyContributions.querySelector('.parrot-active')) {
                return;
            }
            console.log("n0t381x Contributions Customizer: Replacing yearly contributions wrapper...");
            yearlyContributions.innerHTML = getCustomSVG();
        }
    }

    // Global MutationObserver to handle dynamic page changes (SPA/Turbo load)
    const observer = new MutationObserver(() => {
        if (isProfilePage()) {
            replaceGraph();
        }
    });

    // Start observing the whole document immediately
    observer.observe(document, { childList: true, subtree: true });
    console.log("n0t381x Contributions Customizer: Global MutationObserver active.");

    // Initial check in case the script is injected after DOM elements are ready
    if (isProfilePage()) {
        replaceGraph();
    }
})();
