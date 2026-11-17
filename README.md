# Vanilla To-Do App

A clean, modern, and responsive To-Do application built strictly with vanilla **HTML5**, **CSS3**, and **JavaScript** (no frameworks, no Tailwind, no external database dependencies).

## ✨ Features

- **Dynamic CRUD Operations**:
  - Add new tasks (Enter key or Add button).
  - Toggle completion status with custom animated checkboxes.
  - Inline editing (click the edit icon or double-click any task; Enter to save, Esc to cancel).
  - Delete individual tasks.
- **Local Storage Persistence**:
  - Tasks and completion status automatically persist across browser reloads.
  - Theme preference (Dark / Light mode) is also remembered.
- **Filtering & Counter**:
  - Filter tasks by **All**, **Active**, and **Completed**.
  - Dynamic active task counter (`X items left`).
  - "Clear Completed" button that appears whenever completed tasks exist.
  - Dynamic empty state messages for each filter view.
- **Polished Vanilla CSS UI**:
  - Light & Dark mode support with toggle.
  - Smooth transitions and micro-interactions.
  - Fully responsive on mobile, tablet, and desktop devices.
  - Accessible focus states and keyboard navigation.

## 🚀 How to Run

Simply open [index.html](file:///Users/Ibukun.a/Desktop/Thragg/index.html) in any modern web browser:

- Double-click `index.html` from Finder, or
- Run a simple local server if preferred:
  ```bash
  python3 -m http.server 8000
  ```
  Then visit `http://localhost:8000`.

## 📁 File Structure

- [index.html](file:///Users/Ibukun.a/Desktop/Thragg/index.html): Semantic HTML structure.
- [style.css](file:///Users/Ibukun.a/Desktop/Thragg/style.css): Vanilla CSS styling, responsive layout, custom components, and color variables.
- [app.js](file:///Users/Ibukun.a/Desktop/Thragg/app.js): Core application logic, event listeners, dynamic DOM rendering, and `localStorage` integration.
