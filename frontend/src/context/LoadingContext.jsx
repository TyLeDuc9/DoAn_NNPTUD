import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [componentsLoading, setComponentsLoading] = useState(false);

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                setIsLoading,
                componentsLoading,
                setComponentsLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

// Hook dùng context
export const useLoading = () => useContext(LoadingContext);
