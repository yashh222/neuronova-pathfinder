/**
 * API Service for communicating with the FastAPI backend
 * Provides methods for data upload, dashboard data, risk detection, and alerts
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Student {
  id: number;
  name: string;
  class: string;
  department: string;
  attendance: number;
  score: number;
  feeStatus: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
  riskFactors?: {
    attendance: any;
    performance: any;
    fees: any;
  };
  recommendations?: string[];
}

export interface DashboardData {
  success: boolean;
  timestamp: string;
  students: Student[];
  statistics: {
    total_students: number;
    filtered_count: number;
    risk_distribution: {
      high: number;
      medium: number;
      low: number;
    };
    attendance_avg: number;
    performance_avg: number;
  };
  trends: any;
  filters_applied: any;
}

export interface UploadResult {
  success: boolean;
  message: string;
  results: Array<{
    filename: string;
    type: string;
    status: string;
    records_count?: number;
    error?: string;
  }>;
  summary: {
    total_attendance_records: number;
    total_marks_records: number;
    total_fees_records: number;
  };
}

export interface AlertRequest {
  student_id: string;
  student_name: string;
  alert_type: string;
  recipients: string[];
  message?: string;
  priority?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Upload student data files
   */
  async uploadData(files: FileList): Promise<UploadResult> {
    const formData = new FormData();
    
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${this.baseUrl}/upload-data`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'File upload failed');
    }

    return await response.json();
  }

  /**
   * Get dashboard data with optional filters
   */
  async getDashboardData(filters?: {
    class_filter?: string;
    risk_filter?: string;
    limit?: number;
  }): Promise<DashboardData> {
    const searchParams = new URLSearchParams();
    
    if (filters?.class_filter) {
      searchParams.append('class_filter', filters.class_filter);
    }
    if (filters?.risk_filter) {
      searchParams.append('risk_filter', filters.risk_filter);
    }
    if (filters?.limit) {
      searchParams.append('limit', filters.limit.toString());
    }

    const endpoint = `/get-dashboard-data${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.fetchWithErrorHandling<DashboardData>(endpoint);
  }

  /**
   * Run risk detection analysis
   */
  async runRiskDetection(refreshData = true): Promise<any> {
    return this.fetchWithErrorHandling('/risk-detection', {
      method: 'POST',
      body: JSON.stringify({ refresh_data: refreshData }),
    });
  }

  /**
   * Get detailed risk analysis for a specific student
   */
  async getStudentRiskDetails(studentId: string): Promise<any> {
    return this.fetchWithErrorHandling(`/student-risk/${studentId}`);
  }

  /**
   * Send email alerts
   */
  async sendEmailAlerts(alertRequest: AlertRequest): Promise<any> {
    return this.fetchWithErrorHandling('/send-alerts', {
      method: 'POST',
      body: JSON.stringify(alertRequest),
    });
  }

  /**
   * Send SMS alerts
   */
  async sendSMSAlerts(smsRequest: {
    student_id: string;
    student_name: string;
    phone_numbers: string[];
    message: string;
    alert_type?: string;
  }): Promise<any> {
    return this.fetchWithErrorHandling('/send-sms-alerts', {
      method: 'POST',
      body: JSON.stringify(smsRequest),
    });
  }

  /**
   * Get alerts history
   */
  async getAlertsHistory(filters?: {
    student_id?: string;
    alert_type?: string;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (filters?.student_id) {
      searchParams.append('student_id', filters.student_id);
    }
    if (filters?.alert_type) {
      searchParams.append('alert_type', filters.alert_type);
    }
    if (filters?.limit) {
      searchParams.append('limit', filters.limit.toString());
    }

    const endpoint = `/alerts-history${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.fetchWithErrorHandling(endpoint);
  }

  /**
   * Get upload status
   */
  async getUploadStatus(): Promise<any> {
    return this.fetchWithErrorHandling('/upload-status');
  }

  /**
   * Get data preview by type
   */
  async getDataPreview(dataType: string, limit = 10): Promise<any> {
    return this.fetchWithErrorHandling(`/data-preview/${dataType}?limit=${limit}`);
  }

  /**
   * Clear uploaded data (for testing)
   */
  async clearData(): Promise<any> {
    return this.fetchWithErrorHandling('/clear-data', {
      method: 'DELETE',
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.fetchWithErrorHandling('/health');
  }

  /**
   * Send bulk alerts to multiple students
   */
  async sendBulkAlerts(bulkRequest: {
    student_ids: string[];
    alert_type: string;
    recipients_per_student: Record<string, string[]>;
    custom_message?: string;
  }): Promise<any> {
    return this.fetchWithErrorHandling('/bulk-alerts', {
      method: 'POST',
      body: JSON.stringify(bulkRequest),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types and service
export default apiService;