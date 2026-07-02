import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Task } from '../types';

const TASKS_COLLECTION = 'tasks';

export const taskService = {
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = Date.now();
    const newTask = {
      ...taskData,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);
    return { id: docRef.id, ...newTask };
  },

  async getUserTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('ownerId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  },

  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'ownerId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async deleteTask(taskId: string): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(docRef);
  }
};
