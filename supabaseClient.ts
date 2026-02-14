
import { createClient } from '@supabase/supabase-js';

const sanitize = (val: any): string => {
  if (typeof val !== 'string') return '';
  return val.replace(/^["'](.+)["']$/, '$1').trim();
};

const getEnv = (key: string): string => {
  const sources = [
    typeof import.meta !== 'undefined' ? (import.meta as any).env?.[key] : null,
    typeof process !== 'undefined' ? process.env?.[key] : null,
    typeof window !== 'undefined' ? (window as any).env?.[key] : null,
    key.startsWith('VITE_') ? getEnv(key.replace('VITE_', '')) : null
  ];
  for (const value of sources) {
    if (value) return sanitize(value);
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && !supabaseUrl.includes('placeholder') && supabaseUrl.length > 10;

/**
 * MOCK SUPABASE IMPLEMENTATION
 * Fixed role persistence and added unique IDs per email
 */
const createMockSupabase = () => {
  const listeners: Set<(event: string, session: any) => void> = new Set();
  
  let storage: Record<string, any[]>;
  try {
    const defaultData = {
      profiles: [],
      products: [],
      stores: [],
      sales: [
        { id: 'sale-1', productId: 'p1', productName: 'Stealth Bomber Jacket', sellerId: 'm-demo-seller', resellerId: 'reseller-1', resellerName: 'UrbanElite Store', amount: 129, commission: 19.35, status: 'pending', createdAt: new Date().toISOString() },
        { id: 'sale-2', productId: 'p2', productName: 'Vortex Mesh Sneakers', sellerId: 'm-demo-seller', resellerId: 'reseller-2', resellerName: 'SneakerHeadz', amount: 159, commission: 23.85, status: 'approved', createdAt: new Date(Date.now() - 86400000).toISOString() }
      ]
    };
    storage = JSON.parse(localStorage.getItem('sellarmy_mock_db') || JSON.stringify(defaultData));
  } catch {
    storage = { profiles: [], products: [], stores: [], sales: [] };
  }
  
  const save = () => {
    try {
      localStorage.setItem('sellarmy_mock_db', JSON.stringify(storage));
    } catch (e) {
      console.warn("Storage quota exceeded, using session fallback");
    }
  };
  
  const notifyListeners = (event: string, session: any) => {
    listeners.forEach(cb => cb(event, session));
  };

  const mockClient = {
    auth: {
      getSession: async () => ({ 
        data: { session: JSON.parse(localStorage.getItem('sellarmy_mock_session') || 'null') }, 
        error: null 
      }),
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        listeners.add(callback);
        const session = JSON.parse(localStorage.getItem('sellarmy_mock_session') || 'null');
        setTimeout(() => callback('INITIAL_SESSION', session), 0);
        return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
      },
      signInWithPassword: async ({ email, role }: any) => {
        // Create a semi-unique ID based on email
        const id = 'm-' + btoa(email).substring(0, 8);
        
        let profile = storage.profiles.find(p => p.email === email);
        if (!profile) {
          profile = { id, email, name: email.split('@')[0], role: role || 'RESELLER' };
          storage.profiles.push(profile);
        } else {
          // Force update role to what was selected on login screen
          if (role) profile.role = role;
        }
        save();
        
        const session = { user: { id: profile.id, email: profile.email }, access_token: 'mock-token' };
        localStorage.setItem('sellarmy_mock_session', JSON.stringify(session));
        notifyListeners('SIGNED_IN', session);
        return { data: { session }, error: null };
      },
      signUp: async ({ email, options }: any) => {
        const role = options?.data?.role || 'RESELLER';
        const id = 'm-' + btoa(email).substring(0, 8);
        const profile = { id, email, name: email.split('@')[0], role };
        storage.profiles.push(profile);
        save();
        const session = { user: { id: profile.id, email: profile.email }, access_token: 'mock-token' };
        localStorage.setItem('sellarmy_mock_session', JSON.stringify(session));
        notifyListeners('SIGNED_UP', session);
        return { data: { user: session.user, session }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('sellarmy_mock_session');
        notifyListeners('SIGNED_OUT', null);
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: (query: string = '*') => ({
        eq: (col: string, val: any) => ({
          single: async () => ({ 
            data: storage[table]?.find(i => i[col] === val) || null, 
            error: storage[table]?.find(i => i[col] === val) ? null : { message: 'Not found' } 
          }),
          async then(cb: any) { 
            cb({ data: storage[table]?.filter(i => i[col] === val) || [], error: null }) 
          }
        }),
        order: () => ({ async then(cb: any) { cb({ data: [...(storage[table] || [])].reverse(), error: null }) } }),
        async then(cb: any) { cb({ data: storage[table] || [], error: null }) }
      }),
      insert: (items: any[]) => ({
        async then(cb: any) {
          const newItems = items.map(i => ({ ...i, id: i.id || Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() }));
          storage[table] = [...(storage[table] || []), ...newItems];
          save();
          cb({ data: newItems, error: null });
        }
      }),
      update: (updates: any) => ({
        eq: (col: string, val: any) => ({
          async then(cb: any) {
            storage[table] = (storage[table] || []).map(i => i[col] === val ? { ...i, ...updates } : i);
            save();
            cb({ data: updates, error: null });
          }
        })
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          async then(cb: any) {
            storage[table] = (storage[table] || []).filter(i => i[col] !== val);
            save();
            cb({ error: null });
          }
        })
      })
    }),
    storage: {
      from: () => ({
        upload: async (path: string, file: File) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              let mockFiles: Record<string, any>;
              try { mockFiles = JSON.parse(localStorage.getItem('sellarmy_mock_files') || '{}'); } catch { mockFiles = {}; }
              mockFiles[path] = reader.result;
              localStorage.setItem('sellarmy_mock_files', JSON.stringify(mockFiles));
              resolve({ data: { path }, error: null });
            };
            reader.readAsDataURL(file);
          });
        },
        getPublicUrl: (path: string) => {
          let mockFiles: Record<string, any>;
          try { mockFiles = JSON.parse(localStorage.getItem('sellarmy_mock_files') || '{}'); } catch { mockFiles = {}; }
          return { data: { publicUrl: mockFiles[path] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400' } };
        }
      })
    }
  };

  return mockClient as any;
};

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockSupabase();

export const uploadImage = async (bucket: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const clearMockStorage = () => {
  localStorage.removeItem('sellarmy_mock_db');
  localStorage.removeItem('sellarmy_mock_files');
  localStorage.removeItem('sellarmy_mock_session');
  window.location.reload();
};
