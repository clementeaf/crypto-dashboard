import { ReactNode } from "react";
import { Cryptocurrency } from "./crypto";

// CryptoCard
export interface CryptoCardProps {
    crypto: Cryptocurrency;
    index: number;
}

// ApiDiagnosticsPanel
export type ApiTestResultType = {
    success?: boolean;
    data?: any;
    error?: string;
    statusCode?: number;
    responseTime?: number;
    timestamp?: string;
};

export type ApiDiagnosticsPanelProps = {
    logs: string[];
    apiTestResult: ApiTestResultType | null;
    isTestingApi: boolean;
    isClearingCache: boolean;
    handleTestApi: () => Promise<void>;
    handleClearCache: () => void;
    testApiUrl: string;
};

//Dashboard
export interface DashboardProps {
    cryptocurrencies: Cryptocurrency[];
    onRefresh: () => void;
    apiError?: string | null;
    title?: string;
    username?: string;
    onLogout?: () => void;
    lastUpdated?: string | null;
    autoRefresh?: boolean;
    onToggleAutoRefresh?: () => void;
    refreshInterval?: number;
    onChangeRefreshInterval?: (interval: number) => void;
}

//RequirementsPanel
export type RequirementsPanelProps = {
    onClose: () => void;
};

//CryptoCardSkeleton
export type CryptoCardSkeletonProps = {
    count?: number;
};

//AutoRefreshControl
export type AutoRefreshControlProps = {
    autoRefresh: boolean;
    refreshInterval: number;
    onToggleAutoRefresh: () => void;
    onChangeInterval: (interval: number) => void;
    disabled?: boolean;
};

//LoadingButton
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export type LoadingButtonProps = {
    children: ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    loadingText?: string;
    icon?: ReactNode;
};

//SearchFilter
export interface SearchFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}