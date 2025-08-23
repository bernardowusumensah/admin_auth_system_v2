import styled from 'styled-components';
import { TableContainer } from '@mui/material';

export const AccountsContainer = styled.div`
  padding: 24px;
  max-width: 100%;
`;

export const SearchAndFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const StyledTableContainer = styled(TableContainer)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const StatusChip = styled.div<{ status: 'active' | 'locked' | 'pending' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'active' && `
    background-color: #e8f5e8;
    color: #2e7d32;
  `}
  
  ${props => props.status === 'locked' && `
    background-color: #ffebee;
    color: #c62828;
  `}
  
  ${props => props.status === 'pending' && `
    background-color: #fff3e0;
    color: #ef6c00;
  `}
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: center;
  color: #666;
`;

export const SubscriptionBadge = styled.div<{ type: 'basic' | 'premium' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.type === 'basic' && `
    background-color: #e3f2fd;
    color: #1976d2;
  `}
  
  ${props => props.type === 'premium' && `
    background-color: #f3e5f5;
    color: #7b1fa2;
  `}
`;

export const RequiredActionsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background-color: #ffecb3;
  color: #f57c00;
`;

export const DateText = styled.span`
  font-size: 14px;
  color: #666;
`;

export const UsernameText = styled.span`
  font-weight: 600;
  color: #333;
`;

export const EmailText = styled.span`
  font-size: 14px;
  color: #666;
`;
