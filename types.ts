
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
  amount: number;
  category: Category;
  date: string;
  note: string;
}

export interface User {
  name: string;
  email: string;
  plan: string;
  avatar: string;
}
