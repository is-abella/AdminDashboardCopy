import React, { createContext, useContext, ReactNode } from "react";

interface AppContextProps {
	selectedNamesList: string[];
	setNamesList: (namesList: string[]) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [selectedNamesList, setNamesList] = React.useState<string[]>([]);

	return (
		<AppContext.Provider value={{ selectedNamesList, setNamesList }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
