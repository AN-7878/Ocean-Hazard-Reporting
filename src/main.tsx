import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { DarkModeProvider } from "./DarkModeContext";
import { SosProvider } from "./SosContext";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<DarkModeProvider>
			<SosProvider>
				<App />
			</SosProvider>
		</DarkModeProvider>
	</StrictMode>
);
