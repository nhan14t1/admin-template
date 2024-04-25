import { createContext, useEffect, useState } from 'react';

const AppContext = createContext({ loading: false});

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;