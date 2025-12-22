'use client';

import React, { createContext, ReactNode, useContext } from "react";

interface ActivityContextType {
    result: "correct" | "incorrect" | null;
    setResult: (result: "correct" | "incorrect" | null) => void;
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

interface ActivityProviderProps {
    children: ReactNode;
    result: "correct" | "incorrect" | null;
    setResult: (result: "correct" | "incorrect" | null) => void;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children, result, setResult }) => {
    return (
        <ActivityContext.Provider value={{ result, setResult }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivityContext = (): ActivityContextType => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error("useActivityContext must be used within an ActivityProvider");
    }
    return context;
};
