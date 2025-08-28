import { useState, useEffect, useCallback } from 'react';
import { 
  getDashboardStats, 
  getRecentActivity, 
  getQuickActions, 
  executeQuickAction,
  type DashboardStats,
  type RecentActivity,
  type QuickAction
} from '@modules/dashboard/services/dashboard.service';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, activityData, actionsData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getQuickActions(),
      ]);
      
      setStats(statsData);
      setActivity(activityData);
      setQuickActions(actionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Execute quick action
  const handleQuickAction = useCallback(async (actionId: string) => {
    try {
      await executeQuickAction(actionId);
      toast.success('Action executed successfully');
      // Refresh dashboard data after action
      await fetchDashboardData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute action';
      toast.error(errorMessage);
    }
  }, [fetchDashboardData]);

  // Refresh dashboard data
  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Load data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    activity,
    quickActions,
    loading,
    error,
    refreshData,
    handleQuickAction,
  };
};
