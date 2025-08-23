import styled from 'styled-components';
import { Card, CardContent } from '@mui/material';

export const DashboardContainer = styled.div`
  padding: 24px;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const LastUpdated = styled.span`
  font-size: 14px;
  color: #666;
`;

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

export const ServiceCard = styled(Card)<{ status: 'healthy' | 'unavailable' | 'degraded' }>`
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'healthy': return '#4caf50';
      case 'unavailable': return '#f44336';
      case 'degraded': return '#ff9800';
      default: return '#ccc';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ServiceCardContent = styled(CardContent)`
  padding: 20px !important;
`;

export const ServiceHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const ServiceInfo = styled.div`
  flex: 1;
`;

export const ServiceName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

export const ServiceStatus = styled.div<{ status: 'healthy' | 'unavailable' | 'degraded' }>`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => {
    switch (props.status) {
      case 'healthy': return '#4caf50';
      case 'unavailable': return '#f44336';
      case 'degraded': return '#ff9800';
      default: return '#666';
    }
  }};
`;

export const StatusIcon = styled.div<{ status: 'healthy' | 'unavailable' | 'degraded' }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch (props.status) {
      case 'healthy': return '#e8f5e8';
      case 'unavailable': return '#ffebee';
      case 'degraded': return '#fff3e0';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'healthy': return '#4caf50';
      case 'unavailable': return '#f44336';
      case 'degraded': return '#ff9800';
      default: return '#666';
    }
  }};
`;

export const ServiceMetrics = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;
`;

export const MetricItem = styled.div`
  flex: 1;
`;

export const MetricLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
  text-align: center;
  color: #666;
`;

export const OverallStatusCard = styled(Card)<{ status: 'healthy' | 'issues' }>`
  margin-bottom: 24px;
  border-left: 4px solid ${props => props.status === 'healthy' ? '#4caf50' : '#f44336'};
`;

export const OverallStatusContent = styled(CardContent)`
  padding: 20px !important;
`;

export const OverallStatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const OverallStatusTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

export const OverallStatusText = styled.div<{ status: 'healthy' | 'issues' }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.status === 'healthy' ? '#4caf50' : '#f44336'};
`;

export const OverallStatusSummary = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

export const AutoRefreshBadge = styled.div<{ enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.enabled ? '#e8f5e8' : '#f5f5f5'};
  color: ${props => props.enabled ? '#2e7d32' : '#666'};
`;

export const RefreshIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color || '#4caf50'};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
