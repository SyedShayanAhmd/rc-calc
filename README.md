# RC Plane Sizing & Analysis Suite

A comprehensive, client-side web application for sizing, designing, and analyzing remote-controlled (RC) fixed-wing aircraft. Built entirely with HTML, CSS, and JavaScript, this engineering suite requires no backend server and runs directly in the browser, maintaining a persistent synchronized state across all modules via `localStorage`.

## Features

*   **Sizer:** Calculates wing area, span, chord lengths, and empennage dimensions based on Target Weight, Aspect Ratio, and Wing Cubic Loading.
*   **Airfoil Analysis:** Generates precise NACA 4-digit profiles and estimates lift, drag, and transition points using thin airfoil theory.
*   **Electronics & Powertrain:** Estimates static thrust, power draw, and flight times using empirical APC propeller formulas and non-linear throttle mapping.
*   **CG Analysis:** Datum-based moment calculator with a 2D visualizer to track Center of Gravity versus the aerodynamic Neutral Point for static margin verification.
*   **Landing Gear:** Validates ground clearance, tip-back (rotation) authority, and lateral overturn angles for tricycle and taildragger configurations.
*   **3D Viewer:** A fully parametric, interactive CAD-style 3D render of the aircraft geometry (powered by Three.js), featuring an X-Ray mode to inspect internal component packaging.

## Tech Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **3D Rendering:** Three.js
*   **Data Visualization:** Chart.js
*   **State Management:** Native Browser `localStorage`

## Usage

This tool operates completely client-side. There is no installation required. 
Access the live suite here: **[Insert Your GitHub Pages URL Here]**

## Author

**Syed Shayan Ahmed**
*Mechanical Engineer | AI IOT AND AUTOMATION | SMART MANUFACTURING | CAD DESIGNER*
