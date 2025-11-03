import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export function useMyReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setData([]);
        setLoading(false);
        return;
      }
      const { data: rows, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false });
      if (!mounted) return;
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load reports', error);
        setData([]);
      } else {
        setData(rows || []);
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  return { data, loading };
}
