
export enum Category {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transport',
  RENT = 'Rent',
  INTERNET = 'Internet',
  TEXTBOOKS = 'Textbooks',
  ENTERTAINMENT = 'Entertainment',
  OTHER = 'Other'
}

export interface Expense {
  id: string;
  user_id?: string; // Optional in frontend, required in DB
  amount: number;
  category: Category;
  date: string;
  note: string;
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export interface User {
  name: string;
  email: string;
  plan: string;
  avatar: string;
}
