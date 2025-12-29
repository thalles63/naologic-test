# Naologic Test - Manufacturing Timeline

A dynamic, interactive Gantt-chart style timeline application built with **Angular 18**. This application allows users to view, create, and manage Work Orders across different Work Centers with efficient state management and a modern UI.

## How to Run

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Start the Development Server**:

    ```bash
    npm start
    ```

    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 💡 Approach & Architecture

My main concern was to create the complete timeline functionality. I started with the basic structure and then added the features one by one. The tricky part was to create the timeline grid and the work orders on it. But in the end, I was able to create a timeline that is both functional and visually accurate to the example.

### **State Management with Angular Signals**

I chose **Angular Signals** (`signal`, `computed`, `effect`) as the core reactivity model.

-   **Why?** Signals provide granular updates, reducing unnecessary change detection cycles compared to `Zone.js` alone.
-   **Usage:** The timeline's grid calculations, today's marker position, and filtered lists are all derived using `computed` signals. This ensures high performance even with many DOM elements on the timeline.

### **Component Design**

-   **TimelineComponent**: The "smart" orchestrator. It handles the grid rendering, event propagation, and communication with the sidebar service.
-   **Reusability**:
    -   `RightSidebarComponent`: A generic wrapper for any side-panel content.
    -   `DateInputComponent`: A wrapper around `ng-bootstrap`'s datepicker to standardize ISO string handling and UI styling.
    -   `SelectInputComponent`: A wrapper around `ng-select` for consistent form control behavior.

## 🛠️ Extra Libraries Used

| Library        | Purpose         | Why?                                                                                                |
| :------------- | :-------------- | :-------------------------------------------------------------------------------------------------- |
| **ngx-toastr** | Notifications   | Simple, non-blocking toast notifications to inform users of error states (e.g., validation errors). |
| **prettier**   | Code Formatting | Ensures consistent code style and formatting.                                                       |
| **eslint**     | Code Quality    | Ensures consistent code quality and style.                                                          |
