// ==UserScript==
// @name         GitHub Contributions Customizer - 4nu81x
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Permanently replace the default GitHub green square contribution graph with red/yellow stars spelling 4nu81x.
// @author       4nu81x
// @match        https://github.com/4nu81x*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // SVG representation of custom star contributions spelling 4nu81x
    const customSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 185" width="100%" height="100%">
<style>
  .bg { fill: #0d1117; stroke: #30363d; stroke-width: 1px; rx: 6px; }
  .label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 11px; fill: #8b949e; }
  .header { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; fill: #adbac7; }
  .star-empty { fill: #21262d; }
  .star-red { fill: #ff453a; }
  .star-yellow { fill: #ffd60a; }
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
  <!-- Generated Stars from script -->
  ${generateStars()}
  <!-- Bottom Legend (Less -> More) -->
  <text x="25" y="171" class="label">Learn how we count contributions</text>
  <text x="580" y="171" class="label">Less</text>
  <g transform="translate(610, 162)"><path d="M 6,0 L 7.8,3.6 L 11.8,4.2 L 8.9,7 L 9.6,11 L 6,9.1 L 2.4,11 L 3.1,7 L 0.2,4.2 L 4.2,3.6 Z" class="star-empty" /></g>
  <g transform="translate(625, 162)"><path d="M 6,0 L 7.8,3.6 L 11.8,4.2 L 8.9,7 L 9.6,11 L 6,9.1 L 2.4,11 L 3.1,7 L 0.2,4.2 L 4.2,3.6 Z" class="star-yellow" /></g>
  <g transform="translate(640, 162)"><path d="M 6,0 L 7.8,3.6 L 11.8,4.2 L 8.9,7 L 9.6,11 L 6,9.1 L 2.4,11 L 3.1,7 L 0.2,4.2 L 4.2,3.6 Z" class="star-red" /></g>
  <text x="659" y="171" class="label">More</text>
</svg>`;

    function generateStars() {
        const width_cols = 46;
        const height_rows = 7;
        const active_pixels = new Set();
        
        // Coordinates for '4nu81x' spelling (word start at col 9)
        // Letter '4' (col 0)
        [0,1,2,3].forEach(y => active_pixels.add(`0,${y}`));
        active_pixels.add(`1,3`);
        active_pixels.add(`2,3`);
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add(`3,${y}`));
        
        // Letter 'n' (col 5)
        [2,3,4,5,6].forEach(y => active_pixels.add(`5,${y}`));
        active_pixels.add(`6,2`);
        active_pixels.add(`7,2`);
        [2,3,4,5,6].forEach(y => active_pixels.add(`8,${y}`));
        
        // Letter 'u' (col 10)
        [2,3,4,5,6].forEach(y => active_pixels.add(`10,${y}`));
        active_pixels.add(`11,6`);
        active_pixels.add(`12,6`);
        [2,3,4,5,6].forEach(y => active_pixels.add(`13,${y}`));
        
        // Letter '8' (col 15)
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add(`15,${y}`));
        active_pixels.add(`16,0`); active_pixels.add(`16,3`); active_pixels.add(`16,6`);
        active_pixels.add(`17,0`); active_pixels.add(`17,3`); active_pixels.add(`17,6`);
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add(`18,${y}`));
        
        // Letter '1' (col 20)
        active_pixels.add(`20,1`);
        [0,1,2,3,4,5,6].forEach(y => active_pixels.add(`21,${y}`));
        active_pixels.add(`22,6`);
        
        // Letter 'x' (col 24)
        active_pixels.add(`24,2`); active_pixels.add(`24,6`);
        active_pixels.add(`25,3`); active_pixels.add(`25,5`);
        active_pixels.add(`26,4`);
        active_pixels.add(`27,3`); active_pixels.add(`27,5`);
        active_pixels.add(`28,2`); active_pixels.add(`28,6`);

        const word_start_col = 9;
        const spelled_pixels = new Set();
        active_pixels.forEach(coord => {
            const [x_rel, y] = coord.split(',').map(Number);
            spelled_pixels.add(`${word_start_col + x_rel},${y}`);
        });

        const star_path = "M 6,0 L 7.8,3.6 L 11.8,4.2 L 8.9,7 L 9.6,11 L 6,9.1 L 2.4,11 L 3.1,7 L 0.2,4.2 L 4.2,3.6 Z";
        const grid_start_x = 40;
        const grid_start_y = 68;
        const cell_size = 12;
        const gap = 3;

        let starsSVG = "";
        for (let x = 0; x < width_cols; x++) {
            for (let y = 0; y < height_rows; y++) {
                const pos_x = grid_start_x + x * (cell_size + gap);
                const pos_y = grid_start_y + y * (cell_size + gap);
                const is_active = spelled_pixels.has(`${x},${y}`);
                
                let cls = "star-empty";
                if (is_active) {
                    cls = (x + y) % 2 === 0 ? "star-red" : "star-yellow";
                }
                
                starsSVG += `<g transform="translate(${pos_x}, ${pos_y})"><path d="${star_path}" class="${cls}" /></g>`;
            }
        }
        return starsSVG;
    }

    // Function to perform the replacement
    function replaceGraph() {
        const container = document.querySelector('.js-calendar-graph');
        if (container) {
            // Replace the default graph wrapper with our custom stars graph
            container.innerHTML = customSVG;
        }
    }

    // Use a mutation observer to handle dynamic navigation (GitHub's client-side loading)
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.js-calendar-graph')) {
            replaceGraph();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check on load
    replaceGraph();
})();
