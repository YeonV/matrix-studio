# YZ Matrix Studio

 [![creator](https://img.shields.io/badge/CREATOR-Yeon-blue.svg?logo=github&logoColor=white)](https://github.com/YeonV) [![creator](https://img.shields.io/badge/A.K.A-Blade-darkred.svg?logo=github&logoColor=white)](https://github.com/YeonV)

YZ Matrix Studio is a powerful, standalone 2D virtual mapping tool designed for lighting enthusiasts and developers. Built with a modern, high-performance tech stack, it provides an intuitive and feature-rich interface for creating and managing complex pixel layouts for physical LED installations.

This project was originally born from the needs of the [LedFx](https://github.com/LedFx/LedFx) project, aiming to provide a superior, decoupled, and reusable 2D mapping experience. It can be used as a standalone playground or integrated as a component into larger applications.

<!-- TODO: Add a GIF showcasing the editor in action -->
![MatrixStudio Screenshot](https://raw.githubusercontent.com/YeonV/LedFx-Frontend-v2/main/screenshots/yz-matrix-studio.png)

---

## ✨ Features

-   **High-Performance Canvas:** Buttery-smooth interaction even on large grids (60x60 and beyond) thanks to a highly optimized atomic state model with Jotai.
-   **Intuitive Tools:** A unified toolset for seamless creation:
    -   **Paint & Erase:** Click or drag to paint and erase pixels. A line-drawing algorithm ensures no pixels are skipped on fast mouse moves.
    -   **Auto-Increment/Decrement:** Automatically adjust pixel numbers as you paint, dramatically speeding up layout creation.
-   **Advanced Selection:**
    -   Click to select a single pixel.
    -   `Ctrl+Click` for multi-pixel selection.
    -   `Double-Click` to instantly select an entire pixel group.
-   **Powerful Batch Editing:**
    -   Select multiple pixels and edit their `Device ID` and `Group` simultaneously.
    -   **Sequential Renumbering:** Instantly re-sequence the pixel numbers of your entire selection from a new starting point.
-   **Robust Drag & Drop:**
    -   Move single pixels or entire selected groups around the canvas.
    -   **Real-time Collision Detection:** Get instant visual feedback (red/blue ghosting) to prevent overwriting existing pixels.
-   **Complete Workflow:**
    -   **Import:** Load complex layouts, including device definitions, from a `.json` file via a button or drag-and-drop.
    -   **Export:** Save your creations as a self-contained `.json` file, including a layout name, the pixel map, and the device list.
-   **Cross-Application Integration:**
    -   Can be launched from a parent application (like LedFx) with initial data sent via `postMessage`.
    -   Can securely send the finished layout back to the parent window with a single "Save & Return" click.
-   **Polished UX:**
    -   A clean, professional three-panel layout with responsive properties panels.
    -   Context-aware custom cursors for every action.
    -   Interactive controls for resizing the matrix on the fly.

## 🚀 Tech Stack

This project is built on a modern, high-performance, and type-safe foundation.

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **State Management:** [Jotai](https://jotai.org/) for a flexible and performant atomic state model.
-   **UI Library:** [Material-UI (MUI)](https://mui.com/) for a comprehensive and consistent design system.
-   **Canvas/Pan & Zoom:** [react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch) for robust and performant viewport manipulation.

## 📦 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/YeonV/matrix-studio.git
    cd matrix-studio
    ```

2.  Install the dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

To start the development server, run:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

## ⚙️ Usage

The application serves as a playground for the `MatrixStudio` component.

-   Use the **Toolbar** at the top to switch between `Paint` and `Erase` tools, load/export layouts, resize the matrix, and undo/redo actions.
-   Use the **Left Panel** to configure the properties of your paint brush.
-   Use the **Right Panel** to view and perform batch edits on selected pixels.
-   Drag and drop a valid `.json` layout file directly onto the grid to load it.

### File Format

The editor uses a simple, self-contained JSON format for importing and exporting layouts.

```json
{
  "name": "My Awesome Layout",
  "deviceList": [
    { "id": "my-led-strip", "count": 150 },
    { "id": "my-matrix", "count": 256 }
  ],
  "matrixData": [
    [
      { "deviceId": "my-led-strip", "pixel": 0, "group": "line-1" },
      { "deviceId": "my-led-strip", "pixel": 1, "group": "line-1" },
      {}
    ],
    [
      { "deviceId": "", "pixel": 0, "group": "" },
      { "deviceId": "my-matrix", "pixel": 0, "group": "corner" },
      {}
    ]
  ]
}
```

-   `name` (optional): The name of the layout.
-   `deviceList` (optional): An array of available devices and their pixel counts.
-   `matrixData`: A 2D array representing the grid. Empty cells can be represented by `{}` or an object with empty strings for `deviceId`.

## 🤝 Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute to the code, please feel free to open an issue or submit a pull request.

