import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./bootstrap";

console.log("app.tsx loading...");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    console.log("React root created:", root);
    root.render(<App />);
    console.log("App rendered");
} else {
    console.error("Root element not found!");
}
