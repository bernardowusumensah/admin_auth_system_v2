import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as HealthyIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import type { RootState, AppDispatch } from '@app/store';
import { ServiceStatus } from '@core/types';
import {
  fetchServicesHealth,
  setAutoRefresh,
  clearError
} from '@modules/service-health/store/service-health.slice';
import {
  DashboardContainer,
  HeaderSection,
  HeaderTitle,
  HeaderActions,
  LastUpdated,
  ServicesGrid,
  ServiceCard,
  ServiceCardContent,
  ServiceHeader,
  ServiceInfo,
  ServiceName,
  ServiceStatus as ServiceStatusComponent,
  StatusIcon,
  ServiceMetrics,
  MetricItem,
  MetricLabel,
  MetricValue,
  LoadingContainer,
  EmptyStateContainer,
  OverallStatusCard,
  OverallStatusContent,
  OverallStatusHeader,
  OverallStatusTitle,
  OverallStatusText,
  OverallStatusSummary,
  AutoRefreshBadge,
  RefreshIndicator
} from './service-health-dashboard.styles';

export default function ServiceHealthDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    services,
    lastUpdated,
    loading,
    error,
    autoRefresh,
    refreshInterval
  } = useSelector((state: RootState) => state.serviceHealth);

  // Load services health on component mount
  useEffect(() => {
    dispatch(fetchServicesHealth());
  }, [dispatch]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      dispatch(fetchServicesHealth());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [dispatch, autoRefresh, refreshInterval]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    dispatch(fetchServicesHealth());
  }, [dispatch]);

  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAutoRefresh(event.target.checked));
  }, [dispatch]);

  // Helper functions
  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.Healthy:
        return <HealthyIcon />;
      case ServiceStatus.Unavailable:
        return <ErrorIcon />;
      case ServiceStatus.Degraded:
        return <WarningIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getStatusType = (status: ServiceStatus): 'healthy' | 'unavailable' | 'degraded' => {
    switch (status) {
      case ServiceStatus.Healthy:
        return 'healthy';
      case ServiceStatus.Unavailable:
        return 'unavailable';
      case ServiceStatus.Degraded:
        return 'degraded';
      default:
        return 'degraded';
    }
  };

  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) return 'N/A';
    return `${responseTime}ms`;
  };

  const formatLastChecked = (lastChecked?: string) => {
    if (!lastChecked) return 'Never';
    const date = new Date(lastChecked);
    return date.toLocaleTimeString();
  };

  const formatLastUpdated = (lastUpdated?: string) => {
    if (!lastUpdated) return 'Never';
    const date = new Date(lastUpdated);
    return `Last updated: ${date.toLocaleTimeString()}`;
  };

  // Calculate overall status
  const getOverallStatus = () => {
    const unhealthyServices = services.filter(service => 
      service.status !== ServiceStatus.Healthy
    );
    return unhealthyServices.length === 0 ? 'healthy' : 'issues';
  };

  const getOverallStatusText = () => {
    const healthyCount = services.filter(service => 
      service.status === ServiceStatus.Healthy
    ).length;
    const totalCount = services.length;
    
    if (healthyCount === totalCount) {
      return 'All Services Operational';
    }
    return `${totalCount - healthyCount} Service${totalCount - healthyCount > 1 ? 's' : ''} Need${totalCount - healthyCount === 1 ? 's' : ''} Attention`;
  };

  if (loading && services.length === 0) {
    return (
      <LoadingContainer>
        <CircularProgress size={40} />
      </LoadingContainer>
    );
  }

  const overallStatus = getOverallStatus();

  return (
    <DashboardContainer>
      {/* Header */}
      <HeaderSection>
        <HeaderTitle>Services Health Monitor</HeaderTitle>
        <HeaderActions>
          <LastUpdated>{formatLastUpdated(lastUpdated)}</LastUpdated>
          
          {autoRefresh && (
            <AutoRefreshBadge enabled={autoRefresh}>
              <RefreshIndicator />
              Auto-refresh
            </AutoRefreshBadge>
          )}
          
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={handleAutoRefreshToggle}
                size="small"
              />
            }
            label="Auto-refresh"
          />
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
          
          <Tooltip title="Configure Settings">
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </HeaderActions>
      </HeaderSection>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Overall Status */}
      {services.length > 0 && (
        <OverallStatusCard status={overallStatus}>
          <OverallStatusContent>
            <OverallStatusHeader>
              <StatusIcon status={overallStatus}>
                {overallStatus === 'healthy' ? <HealthyIcon /> : <ErrorIcon />}
              </StatusIcon>
              <div>
                <OverallStatusTitle>System Status</OverallStatusTitle>
                <OverallStatusText status={overallStatus}>
                  {getOverallStatusText()}
                </OverallStatusText>
              </div>
            </OverallStatusHeader>
            <OverallStatusSummary>
              {services.filter(s => s.status === ServiceStatus.Healthy).length} of {services.length} services are operational
            </OverallStatusSummary>
          </OverallStatusContent>
        </OverallStatusCard>
      )}

      {/* Services Grid */}
      {services.length === 0 ? (
        <EmptyStateContainer>
          <h3>No Services Found</h3>
          <p>No services are currently being monitored.</p>
          <Button variant="contained" onClick={handleRefresh}>
            Refresh
          </Button>
        </EmptyStateContainer>
      ) : (
        <ServicesGrid>
          {services.map((service) => {
            const statusType = getStatusType(service.status);
            
            return (
              <ServiceCard key={service.service} status={statusType}>
                <ServiceCardContent>
                  <ServiceHeader>
                    <ServiceInfo>
                      <ServiceName>{service.service}</ServiceName>
                      <ServiceStatusComponent status={statusType}>
                        {service.status}
                      </ServiceStatusComponent>
                    </ServiceInfo>
                    <StatusIcon status={statusType}>
                      {getStatusIcon(service.status)}
                    </StatusIcon>
                  </ServiceHeader>

                  <ServiceMetrics>
                    <MetricItem>
                      <MetricLabel>Status Code</MetricLabel>
                      <MetricValue>{service.statusCode}</MetricValue>
                    </MetricItem>
                    <MetricItem>
                      <MetricLabel>Response Time</MetricLabel>
                      <MetricValue>{formatResponseTime(service.responseTime)}</MetricValue>
                    </MetricItem>
                    <MetricItem>
                      <MetricLabel>Last Checked</MetricLabel>
                      <MetricValue>{formatLastChecked(service.lastChecked)}</MetricValue>
                    </MetricItem>
                  </ServiceMetrics>
                </ServiceCardContent>
              </ServiceCard>
            );
          })}
        </ServicesGrid>
      )}
    </DashboardContainer>
  );
}
