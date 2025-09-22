/**
 * Custom React hooks for API operations with loading and error states
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiService, DashboardData, UploadResult, AlertRequest } from '@/services/api';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for dashboard data with filtering
 */
export const useDashboardData = () => {
  const [state, setState] = useState<ApiState<DashboardData>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchDashboardData = useCallback(async (filters?: {
    class_filter?: string;
    risk_filter?: string;
    limit?: number;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.getDashboardData(filters);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Dashboard Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const refreshData = useCallback((filters?: any) => {
    return fetchDashboardData(filters);
  }, [fetchDashboardData]);

  return {
    ...state,
    fetchDashboardData,
    refreshData,
  };
};

/**
 * Hook for file upload operations
 */
export const useFileUpload = () => {
  const [state, setState] = useState<ApiState<UploadResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const uploadFiles = useCallback(async (files: FileList) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.uploadData(files);
      setState({ data, loading: false, error: null });
      
      // Show success toast
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Upload Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const clearUploadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await apiService.clearData();
      setState({ data: null, loading: false, error: null });
      toast.success('Upload data cleared successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear data';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(`Clear Error: ${errorMessage}`);
    }
  }, []);

  return {
    ...state,
    uploadFiles,
    clearUploadData,
  };
};

/**
 * Hook for risk detection operations
 */
export const useRiskDetection = () => {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const runRiskDetection = useCallback(async (refreshData = true) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.runRiskDetection(refreshData);
      setState({ data, loading: false, error: null });
      
      // Show success toast with summary
      if (data.risk_summary) {
        const { high_risk_count, medium_risk_count } = data.risk_summary;
        toast.success(
          `Risk analysis complete: ${high_risk_count} high-risk, ${medium_risk_count} medium-risk students identified`
        );
      }
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to run risk detection';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Risk Detection Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const getStudentDetails = useCallback(async (studentId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.getStudentRiskDetails(studentId);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get student details';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Student Details Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  return {
    ...state,
    runRiskDetection,
    getStudentDetails,
  };
};

/**
 * Hook for alert operations
 */
export const useAlerts = () => {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const sendEmailAlert = useCallback(async (alertRequest: AlertRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.sendEmailAlerts(alertRequest);
      setState({ data, loading: false, error: null });
      
      toast.success(`Email alert sent to ${data.sent_count} recipient(s)`);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email alert';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Email Alert Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const sendSMSAlert = useCallback(async (smsRequest: {
    student_id: string;
    student_name: string;
    phone_numbers: string[];
    message: string;
    alert_type?: string;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.sendSMSAlerts(smsRequest);
      setState({ data, loading: false, error: null });
      
      toast.success(`SMS alert sent to ${data.sent_count} number(s)`);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send SMS alert';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`SMS Alert Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const sendBulkAlerts = useCallback(async (bulkRequest: {
    student_ids: string[];
    alert_type: string;
    recipients_per_student: Record<string, string[]>;
    custom_message?: string;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.sendBulkAlerts(bulkRequest);
      setState({ data, loading: false, error: null });
      
      toast.success(`Bulk alerts sent: ${data.total_sent} successful`);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send bulk alerts';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Bulk Alert Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const getAlertsHistory = useCallback(async (filters?: {
    student_id?: string;
    alert_type?: string;
    limit?: number;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.getAlertsHistory(filters);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get alerts history';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(`Alerts History Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  return {
    ...state,
    sendEmailAlert,
    sendSMSAlert,
    sendBulkAlerts,
    getAlertsHistory,
  };
};

/**
 * Hook for general API operations
 */
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      await apiService.healthCheck();
      setIsHealthy(true);
    } catch (error) {
      setIsHealthy(false);
      console.error('API Health Check Failed:', error);
    } finally {
      setChecking(false);
    }
  }, []);

  return {
    isHealthy,
    checking,
    checkHealth,
  };
};