export interface Task {
    id?: number;
    name: string;
    duration: number;
    start_event: number;
    end_event: number;
}

export interface CriticalPathResponse {
    critical_path: string[];
    gantt_chart_url: string;
}
