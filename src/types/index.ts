export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
}

export interface UserContextType {
  user: { uid: string; email: string | null } | null;
  loading: boolean;
}
