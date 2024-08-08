import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss";

const root = createRoot(document.body as HTMLElement);
root.render(<App />);
