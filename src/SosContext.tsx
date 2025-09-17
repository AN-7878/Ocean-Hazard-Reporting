import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type UserBasicDetails = {
	name: string;
	phone?: string;
	email?: string;
	role: "citizen" | "official" | "analyst";
};

export type SosEntry = {
	id: string;
	timestamp: number;
	user: UserBasicDetails;
	message?: string;
	location?: { lat: number; lng: number } | null;
};

export type SosContextValue = {
	sosList: SosEntry[];
	sendSos: (input: { user: UserBasicDetails; message?: string }) => Promise<SosEntry>;
};

const SosContext = createContext<SosContextValue | undefined>(undefined);

export const SosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [sosList, setSosList] = useState<SosEntry[]>([]);

	const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
		return new Promise((resolve) => {
			if (!navigator.geolocation) {
				resolve(null);
				return;
			}
			navigator.geolocation.getCurrentPosition(
				(pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
				() => resolve(null),
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
			);
		});
	};

	const sendSos = useCallback(async (input: { user: UserBasicDetails; message?: string }): Promise<SosEntry> => {
		const loc = await getLocation();
		const entry: SosEntry = {
			id: Math.random().toString(36).slice(2),
			timestamp: Date.now(),
			user: input.user,
			message: input.message,
			location: loc,
		};
		setSosList((prev) => [entry, ...prev]);
		return entry;
	}, []);

	const value = useMemo(() => ({ sosList, sendSos }), [sosList, sendSos]);

	return <SosContext.Provider value={value}>{children}</SosContext.Provider>;
};

export const useSos = (): SosContextValue => {
	const ctx = useContext(SosContext);
	if (!ctx) throw new Error("useSos must be used within a SosProvider");
	return ctx;
};
