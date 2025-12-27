import { supabase } from './supabase';

export interface UserSettings {
  id: string;
  user_id: string;
  monthly_budget: number;
  created_at?: string;
  updated_at?: string;
}

export const userSettingsService = {
  // Get user settings (creates default if doesn't exist)
  getSettings: async (): Promise<UserSettings> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call the database function to get or create settings
      const { data, error } = await supabase.rpc('get_or_create_user_settings', {
        p_user_id: user.id
      });

      if (error) {
        console.log('RPC function error, trying direct query:', error.message);
        // If function doesn't exist or fails, try direct query
        const { data: directData, error: directError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (directError) {
          console.log('Direct query error:', directError.code, directError.message);
          // If no settings exist (PGRST116 = no rows returned), create default
          if (directError.code === 'PGRST116') {
            console.log('No settings found, creating default...');
            const { data: newData, error: createError } = await supabase
              .from('user_settings')
              .insert({
                user_id: user.id,
                monthly_budget: 600.00,
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating settings:', createError);
              // If table doesn't exist, return default without saving
              if (createError.code === '42P01' || createError.message?.includes('does not exist')) {
                console.warn('user_settings table does not exist. Please run database/user_settings.sql');
                return {
                  id: 'temp',
                  user_id: user.id,
                  monthly_budget: 600.00,
                };
              }
              throw createError;
            }

            console.log('✅ Created default settings:', newData);
            return {
              id: newData.id,
              user_id: newData.user_id,
              monthly_budget: parseFloat(newData.monthly_budget),
              created_at: newData.created_at,
              updated_at: newData.updated_at,
            };
          }
          // If table doesn't exist, return default
          if (directError.code === '42P01' || directError.message?.includes('does not exist')) {
            console.warn('user_settings table does not exist. Please run database/user_settings.sql');
            return {
              id: 'temp',
              user_id: user.id,
              monthly_budget: 600.00,
            };
          }
          throw directError;
        }

        console.log('✅ Loaded existing settings:', directData);
        return {
          id: directData.id,
          user_id: directData.user_id,
          monthly_budget: parseFloat(directData.monthly_budget),
          created_at: directData.created_at,
          updated_at: directData.updated_at,
        };
      }

      return {
        id: data.id,
        user_id: data.user_id,
        monthly_budget: parseFloat(data.monthly_budget),
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error: any) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  // Update user budget
  updateBudget: async (budget: number): Promise<UserSettings> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (budget <= 0) {
        throw new Error('Budget must be greater than 0');
      }

      // Try to update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update({ monthly_budget: budget })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        // If settings don't exist, create them
        if (error.code === 'PGRST116') {
          const { data: newData, error: createError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              monthly_budget: budget,
            })
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          return {
            id: newData.id,
            user_id: newData.user_id,
            monthly_budget: parseFloat(newData.monthly_budget),
            created_at: newData.created_at,
            updated_at: newData.updated_at,
          };
        }
        throw error;
      }

      return {
        id: data.id,
        user_id: data.user_id,
        monthly_budget: parseFloat(data.monthly_budget),
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error: any) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },
};

