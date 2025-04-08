declare module 'expo-router' {
  import { ComponentType } from 'react';
  import { NavigationProp } from '@react-navigation/native';

  export const Stack: ComponentType<any>;
  export const Tabs: ComponentType<any>;
  export const Slot: ComponentType<any>;
  export const SplashScreen: {
    preventAutoHideAsync(): Promise<void>;
    hideAsync(): Promise<void>;
  };

  export function useRouter(): {
    push: (route: string) => void;
    replace: (route: string) => void;
    back: () => void;
  };

  export function useNavigation(): NavigationProp<any>;
} 