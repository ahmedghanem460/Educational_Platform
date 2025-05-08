import React, { createContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  userId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
interface UserDetails {
  role: string;
  name: string;
  email: string;
  password?: string;
  uid: string;
  displayName?: string;
  cartItems: CartItem[];
}

interface UserDetailsContextProps {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}

const UserDetailsContext = createContext<UserDetailsContextProps>({
  userDetails: null,
  setUserDetails: () => {}, // Default value
});

export const UserDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  let [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export default UserDetailsContext;
