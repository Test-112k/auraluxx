
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, User, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXAljTKnDI7MfiuV7oCQx7UZ86GxeQAyc",
  authDomain: "auraluxx-3d5c7.firebaseapp.com",
  projectId: "auraluxx-3d5c7",
  storageBucket: "auraluxx-3d5c7.firebasestorage.app",
  messagingSenderId: "753111617143",
  appId: "1:753111617143:web:4c7c750c4821ea68c04072",
  measurementId: "G-751HDJH783"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

interface UserData {
  email: string;
  adFreeUntil?: Date;
  createdAt?: Date;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdFree: boolean;
  adFreeTimeLeft: number;
  logout: () => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  updateUserPassword: (newPassword: string, currentPassword: string) => Promise<void>;
  addAdFreeTime: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdFree: false,
  adFreeTimeLeft: 0,
  logout: async () => {},
  updateUserEmail: async () => {},
  updateUserPassword: async () => {},
  addAdFreeTime: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdFree, setIsAdFree] = useState(false);
  const [adFreeTimeLeft, setAdFreeTimeLeft] = useState(0);

  // Initialize user data in Firestore
  const initializeUserData = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // New user gets 1 hour of free ad-free time
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      const initialData: UserData = {
        email: user.email || '',
        createdAt: new Date(),
        lastLogin: new Date(),
        adFreeUntil: new Date(Date.now() + oneHour),
      };
      await setDoc(userDocRef, initialData);
      setUserData(initialData);
      console.log('New user initialized with 1 hour ad-free time');
    } else {
      const data = userDoc.data() as UserData;
      if (data.adFreeUntil) {
        data.adFreeUntil = data.adFreeUntil instanceof Date ? data.adFreeUntil : new Date((data.adFreeUntil as any).seconds * 1000);
      }
      setUserData(data);
      
      // Update last login
      await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
    }
  };

  // Check ad-free status
  const checkAdFreeStatus = () => {
    if (userData?.adFreeUntil) {
      const now = new Date();
      const adFreeTime = new Date(userData.adFreeUntil);
      const timeLeft = Math.max(0, adFreeTime.getTime() - now.getTime());
      
      const hasAdFreeTime = timeLeft > 0;
      setIsAdFree(hasAdFreeTime);
      setAdFreeTimeLeft(Math.floor(timeLeft / 1000)); // in seconds
      
      console.log('Ad-free status check:', { hasAdFreeTime, timeLeft: Math.floor(timeLeft / 1000) });
    } else {
      setIsAdFree(false);
      setAdFreeTimeLeft(0);
      console.log('No ad-free time data available');
    }
  };

  // Refresh user data from Firestore
  const refreshUserData = async () => {
    if (!user) return;
    
    console.log('Refreshing user data...');
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      if (data.adFreeUntil) {
        data.adFreeUntil = data.adFreeUntil instanceof Date ? data.adFreeUntil : new Date((data.adFreeUntil as any).seconds * 1000);
      }
      setUserData(data);
      console.log('User data refreshed:', data);
    }
  };

  // Add 30 minutes of ad-free time
  const addAdFreeTime = async () => {
    if (!user) throw new Error('User not logged in');
    
    console.log('Adding 30 minutes of ad-free time...');
    const userDocRef = doc(db, 'users', user.uid);
    const now = new Date();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    let newAdFreeUntil: Date;
    
    if (userData?.adFreeUntil && new Date(userData.adFreeUntil) > now) {
      // Add 30 minutes to existing time
      newAdFreeUntil = new Date(new Date(userData.adFreeUntil).getTime() + thirtyMinutes);
      console.log('Adding to existing time. New end time:', newAdFreeUntil);
    } else {
      // Set new 30 minutes from now
      newAdFreeUntil = new Date(now.getTime() + thirtyMinutes);
      console.log('Setting new 30 minutes from now. End time:', newAdFreeUntil);
    }
    
    try {
      await updateDoc(userDocRef, { adFreeUntil: newAdFreeUntil });
      console.log('Successfully updated adFreeUntil in Firestore');
      await refreshUserData();
    } catch (error) {
      console.error('Error updating adFreeUntil:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
  };

  // Update email
  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!user || !user.email) throw new Error('User not logged in');
    
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { email: newEmail });
    await refreshUserData();
  };

  // Update password
  const updateUserPassword = async (newPassword: string, currentPassword: string) => {
    if (!user || !user.email) throw new Error('User not logged in');
    
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'logged in' : 'logged out');
      setUser(user);
      if (user) {
        await initializeUserData(user);
      } else {
        setUserData(null);
        setIsAdFree(false);
        setAdFreeTimeLeft(0);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    checkAdFreeStatus();
  }, [userData]);

  useEffect(() => {
    // Update ad-free timer every second
    if (isAdFree && adFreeTimeLeft > 0) {
      const timer = setInterval(() => {
        setAdFreeTimeLeft((prev) => {
          if (prev <= 1) {
            setIsAdFree(false);
            console.log('Ad-free time expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAdFree, adFreeTimeLeft]);

  const value = {
    user,
    userData,
    loading,
    isAdFree,
    adFreeTimeLeft,
    logout,
    updateUserEmail,
    updateUserPassword,
    addAdFreeTime,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
