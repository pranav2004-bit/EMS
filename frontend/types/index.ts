export type Role = 'admin' | 'hr';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    is_active: boolean;
    created_at: string;
}

export interface Complaint {
    id: string;
    case_id: string;
    category: string;
    title: string;
    description: string;
    incident_date: string;
    location: string;
    accused_name: string;
    accused_role: string;
    impact_flags: string[];
    urgency_level: 'Low' | 'Medium' | 'High' | 'Critical';
    severity: string;
    status: 'Open' | 'Under Review' | 'Resolved';
    resolution_note: string;
    created_at: string;
    updated_at: string;
    attachments: Attachment[];
}

export interface Attachment {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    uploaded_at: string;
}

export interface DashboardStats {
    total_hr_users: number;
    active_hr_users: number;
    total_complaints: number;
    complaints_by_status: {
        Open: number;
        'Under Review': number;
        Resolved: number;
    };
}

export interface AnalyticsData {
    volume_by_category: { category: string; count: number }[];
    status_distribution: { status: string; count: number }[];
    monthly_trend: { month: string; count: number }[];
    resolution_rate: number;
    total_complaints: number;
    resolved_complaints: number;
}
