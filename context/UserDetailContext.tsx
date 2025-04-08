import React, { createContext, useState } from 'react';

interface UserDetails {
  name: string;
  email: string;
  password: string;
  uid: string;
}

interface UserDetailsContextProps {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}

const userDetailsContext = createContext<UserDetailsContextProps>({
  userDetails: null,
  setUserDetails: () => {},
});

export const UserDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  return (
    <userDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </userDetailsContext.Provider>
  );
};

export default userDetailsContext;