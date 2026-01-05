import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  deleteField,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/constants/firebase';

// Data Models
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  // Legacy field for older goals based on fixed year horizons
  timelineYears?: number;
  // New date-based scheduling
  startDate?: Timestamp;
  endDate?: Timestamp;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  createdAt: Timestamp;
  updatedAt: Timestamp;
  targetDate?: Timestamp;
  notes?: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Timestamp;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  avatar?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
  };
  stats: {
    totalGoals: number;
    completedGoals: number;
    currentStreak: number;
    longestStreak: number;
  };
}

// User Profile Functions
export const createUserProfile = async (userId: string, email: string, displayName: string, avatar?: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userProfile: UserProfile = {
    id: userId,
    email,
    displayName,
    avatar,
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
    preferences: {
      theme: 'auto',
      notifications: true,
      reminderFrequency: 'weekly',
    },
    stats: {
      totalGoals: 0,
      completedGoals: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
  };
  await setDoc(userRef, userProfile);
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() as UserProfile : null;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  // Use setDoc with merge so the profile is created if it doesn't exist yet, avoiding
  // the 'no documents to update' error from updateDoc.
  await setDoc(userRef, data, { merge: true });
};

// Goal Functions
export const createGoal = async (userId: string, goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const goalsRef = collection(db, 'goals');
  const newGoalRef = doc(goalsRef);
  const goal: Goal = {
    id: newGoalRef.id,
    userId,
    ...goalData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(newGoalRef, goal);
  
  // Update user stats
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    await updateDoc(userRef, {
      'stats.totalGoals': (userData.stats?.totalGoals ?? 0) + 1,
    });
  }
  
  return newGoalRef.id;
};

export const getUserGoals = async (userId: string): Promise<Goal[]> => {
  const goalsRef = collection(db, 'goals');
  const q = query(goalsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Goal);
};

export const getGoalsByTimeline = async (userId: string, timelineYears: number): Promise<Goal[]> => {
  const goalsRef = collection(db, 'goals');
  const q = query(
    goalsRef,
    where('userId', '==', userId),
    where('timelineYears', '==', timelineYears),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Goal);
};

export const getGoal = async (goalId: string): Promise<Goal | null> => {
  const goalRef = doc(db, 'goals', goalId);
  const goalSnap = await getDoc(goalRef);
  return goalSnap.exists() ? goalSnap.data() as Goal : null;
};

export const updateGoal = async (goalId: string, data: Partial<Goal>): Promise<void> => {
  const goalRef = doc(db, 'goals', goalId);
  await updateDoc(goalRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteGoal = async (goalId: string, userId: string): Promise<void> => {
  const goalRef = doc(db, 'goals', goalId);
  await deleteDoc(goalRef);
  
  // Update user stats
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    await updateDoc(userRef, {
      'stats.totalGoals': Math.max(0, (userData.stats?.totalGoals ?? 0) - 1),
    });
  }
};

export const deleteUserData = async (userId: string): Promise<void> => {
  // Delete all goals for the user
  const goalsRef = collection(db, 'goals');
  const q = query(goalsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  // Delete user profile
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
};

export const markGoalComplete = async (goalId: string, userId: string): Promise<void> => {
  const goalRef = doc(db, 'goals', goalId);
  await updateDoc(goalRef, {
    status: 'completed',
    progress: 100,
    updatedAt: Timestamp.now(),
  });
  
  // Update user stats
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    await updateDoc(userRef, {
      'stats.completedGoals': (userData.stats?.completedGoals ?? 0) + 1,
    });
  }
};

export const updateGoalProgress = async (goalId: string, progress: number): Promise<void> => {
  const goalRef = doc(db, 'goals', goalId);
  const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
  await updateDoc(goalRef, {
    progress,
    status,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAccount = async (userId: string): Promise<void> => {
  const batch = writeBatch(db);
  
  // Delete all user goals
  const goalsQuery = query(collection(db, 'goals'), where('userId', '==', userId));
  const goalsSnapshot = await getDocs(goalsQuery);
  goalsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Delete user profile
  const userRef = doc(db, 'users', userId);
  batch.delete(userRef);
  
  await batch.commit();
};
