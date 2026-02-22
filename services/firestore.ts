import { db } from '@/constants/firebase';
import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';

export type GoalStatus = 'active' | 'completed' | 'failed';

export interface Goal {
  id: string;
  userId?: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  priority?: 'low' | 'medium' | 'high';
  status?: GoalStatus;
  progress?: number;
  isFavorite?: boolean;
  featured?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Strategy {
  id: string;
  userId: string;
  goalId: string;
  title?: string;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PlanTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Timestamp | null;
}

export interface PdcaReview {
  whatWorked: string;
  whatDidnt: string;
  whatShouldChange: string;
  reviewedAt: Timestamp;
}

export interface Plan {
  id: string;
  userId: string;
  goalId: string;
  weekStart: Timestamp;
  priorities: string[];
  tasks: PlanTask[];
  status: 'active' | 'archived';
  pdcaReview?: PdcaReview;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SmartPlan {
  id: string;
  userId: string;
  goalId: string;
  title?: string;
  content?: any;
  createdAt: Timestamp;
}

export interface DailyCheckInItem {
  done: boolean;
  at?: Timestamp;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  dateKey: string; // YYYY-MM-DD
  exercise?: DailyCheckInItem;
  healthyEating?: DailyCheckInItem;
  hydration?: DailyCheckInItem;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  isPremium?: boolean;
  premiumExpiresAt?: Timestamp | null;
  featuredGoalId?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const goalsCol = collection(db, 'goals');
const strategiesCol = collection(db, 'strategies');
const plansCol = collection(db, 'plans');
const smartPlansCol = collection(db, 'smartPlans');
const dailyCheckinsCol = collection(db, 'dailyCheckins');

const usersDoc = (uid: string) => doc(db, 'users', uid);

const now = () => Timestamp.now();

const toGoal = (id: string, data: any): Goal => ({ id, ...(data || {}) });

export const getUserGoals = async (uid: string): Promise<Goal[]> => {
  const q = query(goalsCol, where('userId', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toGoal(d.id, d.data()));
};

export const getGoalsByTimeline = async (uid: string, years: number): Promise<Goal[]> => {
  const ms = years * 365 * 24 * 60 * 60 * 1000;
  const cutoff = Timestamp.fromDate(new Date(Date.now() + ms));
  const q = query(
    goalsCol,
    where('userId', '==', uid),
    where('endDate', '<=', cutoff),
    orderBy('endDate', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toGoal(d.id, d.data()));
};

export const createGoal = async (uid: string, goal: Partial<Goal>): Promise<string> => {
  const payload = {
    ...goal,
    userId: uid,
    createdAt: now(),
    updatedAt: now(),
  };
  const ref = await addDoc(goalsCol, payload);
  return ref.id;
};

export const getGoal = async (goalId: string): Promise<Goal | null> => {
  const snap = await getDoc(doc(goalsCol, goalId));
  if (!snap.exists()) return null;
  return toGoal(snap.id, snap.data());
};

export const updateGoal = async (goalId: string, patch: Partial<Goal>): Promise<void> => {
  await updateDoc(doc(goalsCol, goalId), { ...patch, updatedAt: now() } as any);
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await deleteDoc(doc(goalsCol, goalId));
};

export const updateGoalProgress = async (goalId: string, progress: number): Promise<void> => {
  await updateGoal(goalId, { progress });
};

export const setFeaturedGoal = async (uid: string, goalId: string): Promise<void> => {
  await updateUserProfile(uid, { featuredGoalId: goalId });
};

export const setGoalFavorite = async (goalId: string, isFavorite: boolean): Promise<void> => {
  await updateGoal(goalId, { isFavorite });
};

export const createStrategy = async (uid: string, data: Omit<Strategy, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { goalId: string }): Promise<string> => {
  const payload = {
    ...data,
    userId: uid,
    createdAt: now(),
    updatedAt: now(),
  };
  const ref = await addDoc(strategiesCol, payload);
  return ref.id;
};

export const getStrategyByGoal = async (uid: string, goalId: string): Promise<Strategy | null> => {
  const q = query(strategiesCol, where('userId', '==', uid), where('goalId', '==', goalId), limit(1));
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  return { id: first.id, ...(first.data() as any) };
};

export const updateStrategy = async (strategyId: string, patch: Partial<Strategy>): Promise<void> => {
  await updateDoc(doc(strategiesCol, strategyId), { ...patch, updatedAt: now() } as any);
};

export const createPlan = async (
  uid: string,
  data: Pick<Plan, 'goalId' | 'weekStart' | 'priorities' | 'tasks' | 'status'>
): Promise<string> => {
  const payload = {
    ...data,
    userId: uid,
    createdAt: now(),
    updatedAt: now(),
  };
  const ref = await addDoc(plansCol, payload);
  return ref.id;
};

export const getCurrentWeekPlanForGoal = async (uid: string, goalId: string): Promise<Plan | null> => {
  const q = query(
    plansCol,
    where('userId', '==', uid),
    where('goalId', '==', goalId),
    orderBy('weekStart', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  return { id: first.id, ...(first.data() as any) } as Plan;
};

export const updatePlan = async (planId: string, patch: Partial<Plan>): Promise<void> => {
  await updateDoc(doc(plansCol, planId), { ...patch, updatedAt: now() } as any);
};

export const updatePlanTask = async (planId: string, taskId: string, patch: Partial<PlanTask>): Promise<void> => {
  const planSnap = await getDoc(doc(plansCol, planId));
  if (!planSnap.exists()) throw new Error('Plan not found');
  const plan = planSnap.data() as any;
  const tasks: PlanTask[] = Array.isArray(plan.tasks) ? plan.tasks : [];
  const next = tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
  await updatePlan(planId, { tasks: next } as any);
};

export const submitPDCAReview = async (planId: string, review: PdcaReview): Promise<void> => {
  await updatePlan(planId, { pdcaReview: review } as any);
};

export const getLatestPdcaReviewForGoal = async (uid: string, goalId: string): Promise<PdcaReview | null> => {
  const q = query(
    plansCol,
    where('userId', '==', uid),
    where('goalId', '==', goalId),
    orderBy('weekStart', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const data = d.data() as any;
    if (data?.pdcaReview) return data.pdcaReview as PdcaReview;
  }
  return null;
};

export const saveSmartPlan = async (uid: string, data: Omit<SmartPlan, 'id' | 'userId' | 'createdAt'> & { goalId: string }): Promise<string> => {
  const payload = {
    ...data,
    userId: uid,
    createdAt: now(),
  };
  const ref = await addDoc(smartPlansCol, payload);
  return ref.id;
};

export const getSmartPlans = async (uid: string): Promise<SmartPlan[]> => {
  const q = query(smartPlansCol, where('userId', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as SmartPlan);
};

export const getSmartPlansForGoal = async (uid: string, goalId: string): Promise<SmartPlan[]> => {
  const q = query(
    smartPlansCol,
    where('userId', '==', uid),
    where('goalId', '==', goalId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as SmartPlan);
};

export const getLatestSmartPlanForGoal = async (uid: string, goalId: string): Promise<SmartPlan | null> => {
  const q = query(
    smartPlansCol,
    where('userId', '==', uid),
    where('goalId', '==', goalId),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  return { id: first.id, ...(first.data() as any) } as SmartPlan;
};

const dailyKeyDocId = (uid: string, dateKey: string) => `${uid}_${dateKey}`;

export const getDailyCheckIn = async (uid: string, dateKey: string): Promise<DailyCheckIn | null> => {
  const id = dailyKeyDocId(uid, dateKey);
  const snap = await getDoc(doc(dailyCheckinsCol, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as DailyCheckIn;
};

export const upsertDailyCheckIn = async (uid: string, dateKey: string, patch: Partial<DailyCheckIn>): Promise<void> => {
  const id = dailyKeyDocId(uid, dateKey);
  const ref = doc(dailyCheckinsCol, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { id, userId: uid, dateKey, ...patch, createdAt: now(), updatedAt: now() } as any);
    return;
  }
  await updateDoc(ref, { ...patch, updatedAt: now() } as any);
};

export const getDailyCheckInHistory = async (uid: string, limitCount = 30): Promise<DailyCheckIn[]> => {
  const q = query(dailyCheckinsCol, where('userId', '==', uid), orderBy('dateKey', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as DailyCheckIn);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(usersDoc(uid));
  if (!snap.exists()) return null;
  return { uid, ...(snap.data() as any) } as UserProfile;
};

export const createUserProfile = async (uid: string, email: string, displayName: string, avatar?: string): Promise<void> => {
  const payload: UserProfile = {
    uid,
    email,
    displayName,
    avatar,
    isPremium: false,
    premiumExpiresAt: null,
    featuredGoalId: null,
    createdAt: now(),
    updatedAt: now(),
  };
  await setDoc(usersDoc(uid), payload as any);
};

export const updateUserProfile = async (uid: string, patch: Partial<UserProfile>): Promise<void> => {
  await setDoc(usersDoc(uid), { ...patch, updatedAt: now() } as any, { merge: true });
};

export const deleteUserData = async (uid: string): Promise<void> => {
  // Best-effort cleanup. If rules disallow deletes, ignore.
  try {
    await deleteDoc(usersDoc(uid));
  } catch {
    // ignore
  }
};
