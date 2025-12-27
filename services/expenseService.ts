import { supabase } from './supabase';
import { Expense, Category } from '../types';

// Expense service for CRUD operations
export const expenseService = {
  // Fetch all expenses for the current user
  fetchExpenses: async (): Promise<Expense[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('🔍 Fetching expenses for user:', user.id);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching expenses:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        // User-friendly error messages
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          throw new Error('Expenses table not found. Please run database/schema.sql in Supabase.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check your account permissions.');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        
        throw new Error(error.message || 'Failed to load expenses. Please try again.');
      }

      console.log(`✅ Fetched ${data?.length || 0} expenses from database`);
      
      // Transform database format to Expense type
      return (data || []).map((expense: any) => ({
        id: expense.id,
        user_id: expense.user_id,
        amount: parseFloat(expense.amount),
        category: expense.category as Category,
        date: expense.date,
        note: expense.note || '',
        created_at: expense.created_at,
        updated_at: expense.updated_at,
      }));
    } catch (error: any) {
      console.error('Error in fetchExpenses:', error);
      throw error;
    }
  },

  // Fetch expenses for current month
  fetchCurrentMonthExpenses: async (): Promise<Expense[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching current month expenses:', error);
        throw error;
      }

      return (data || []).map((expense: any) => ({
        id: expense.id,
        user_id: expense.user_id,
        amount: parseFloat(expense.amount),
        category: expense.category as Category,
        date: expense.date,
        note: expense.note || '',
        created_at: expense.created_at,
        updated_at: expense.updated_at,
      }));
    } catch (error: any) {
      console.error('Error in fetchCurrentMonthExpenses:', error);
      throw error;
    }
  },

  // Add a new expense
  addExpense: async (
    amount: number,
    category: Category,
    date: string,
    note: string
  ): Promise<Expense> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate data
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!date) {
        throw new Error('Date is required');
      }

      console.log('💾 Adding expense:', { amount, category, date, note });
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: amount,
          category: category,
          date: date,
          note: note || null,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding expense:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        // User-friendly error messages
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          throw new Error('Expenses table not found. Please run database/schema.sql in Supabase.');
        } else if (error.code === '23505') {
          throw new Error('This expense already exists.');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check your account permissions.');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        
        throw new Error(error.message || 'Failed to add expense. Please try again.');
      }

      console.log('✅ Expense added successfully:', data);

      return {
        id: data.id,
        user_id: data.user_id,
        amount: parseFloat(data.amount),
        category: data.category as Category,
        date: data.date,
        note: data.note || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error: any) {
      console.error('Error in addExpense:', error);
      throw error;
    }
  },

  // Update an existing expense
  updateExpense: async (
    id: string,
    amount: number,
    category: Category,
    date: string,
    note: string
  ): Promise<Expense> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate data
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!date) {
        throw new Error('Date is required');
      }

      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: amount,
          category: category,
          date: date,
          note: note || null,
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own expenses
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Expense not found or you do not have permission to update it');
      }

      return {
        id: data.id,
        user_id: data.user_id,
        amount: parseFloat(data.amount),
        category: data.category as Category,
        date: data.date,
        note: data.note || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error: any) {
      console.error('Error in updateExpense:', error);
      throw error;
    }
  },

  // Delete an expense
  deleteExpense: async (id: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own expenses

      if (error) {
        console.error('Error deleting expense:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error in deleteExpense:', error);
      throw error;
    }
  },
};

