import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [sharedValue, setSharedValue] = useState('coe');

    return (
        <AppContext.Provider value={{ sharedValue, setSharedValue }}>
            {children}
        </AppContext.Provider>
    );
};
