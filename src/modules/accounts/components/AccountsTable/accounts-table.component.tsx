import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Block as BanIcon,
  Check as UnbanIcon,
  PowerOff as DisconnectIcon,
  Email as EmailIcon,
  EmailOutlined as EmailOutlinedIcon
} from '@mui/icons-material';
import type { RootState, AppDispatch } from '@app/store';
import type { AccountDto, AccountFilters } from '@core/types';
import { SubscriptionStatus } from '@core/types';
import { 
  fetchAccounts, 
  setSearchParams, 
  banAccount, 
  unbanAccount, 
  disconnectPlayer 
} from '@modules/accounts/store/accounts.slice';
import {
  AccountsContainer,
  SearchAndFiltersContainer,
  SearchRow,
  FiltersRow,
  StyledTableContainer,
  StatusChip,
  ActionButtonsContainer,
  PaginationContainer,
  LoadingContainer,
  EmptyStateContainer,
  SubscriptionBadge,
  RequiredActionsBadge,
  DateText,
  UsernameText,
  EmailText
} from './accounts-table.styles';

interface AccountsTableProps {
  onViewAccount?: (accountId: string) => void;
}

export default function AccountsTable({ onViewAccount }: AccountsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    accounts = [], 
    totalCount, 
    currentPage, 
    totalPages, 
    loading, 
    error, 
    searchParams 
  } = useSelector((state: RootState) => state.accounts);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AccountFilters>({});

  // Load accounts on component mount and when search params change
  useEffect(() => {
    dispatch(fetchAccounts(searchParams));
  }, [dispatch, searchParams]);

    useEffect(() => {
    console.log(accounts);
  }, [accounts]);

  // Handle search
  const handleSearch = useCallback(() => {
    dispatch(setSearchParams({
      ...searchParams,
      page: 1,
      searchTerm: searchTerm || undefined
    }));
  }, [dispatch, searchParams, searchTerm]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<AccountFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    dispatch(setSearchParams({
      ...searchParams,
      page: 1,
      filters: updatedFilters
    }));
  }, [dispatch, searchParams, filters]);

  // Handle pagination
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    dispatch(setSearchParams({
      ...searchParams,
      page: newPage + 1
    }));
  }, [dispatch, searchParams]);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchParams({
      ...searchParams,
      page: 1,
      pageSize: parseInt(event.target.value, 10)
    }));
  }, [dispatch, searchParams]);

  // Handle account actions
  const handleBanAccount = useCallback(async (accountId: string) => {
    await dispatch(banAccount(accountId));
    dispatch(fetchAccounts(searchParams));
  }, [dispatch, searchParams]);

  const handleUnbanAccount = useCallback(async (accountId: string) => {
    await dispatch(unbanAccount(accountId));
    dispatch(fetchAccounts(searchParams));
  }, [dispatch, searchParams]);

  const handleDisconnectPlayer = useCallback(async (accountId: string) => {
    await dispatch(disconnectPlayer(accountId));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchAccounts(searchParams));
  }, [dispatch, searchParams]);

  // Helper functions
  const getAccountStatus = (account: AccountDto) => {
    if (account.lockedOut) return 'locked';
    if (account.emailConfirmation === false) return 'pending';
    return 'active';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'locked': return 'Banned';
      case 'pending': return 'Pending';
      case 'active': return 'Active';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getActiveSubscription = (account: AccountDto) => {
    return account.subscriptions?.find(sub => sub.status === SubscriptionStatus.Active);
  };

  const hasRequiredActions = (account: AccountDto) => {
  return Array.isArray(account.requiredActions) && account.requiredActions.length > 0;
  };

  if (loading && (accounts?.length ?? 0) === 0) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }



  return (
    <AccountsContainer>      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <SearchAndFiltersContainer>
        <SearchRow>
          <TextField
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            size="small"
            style={{ minWidth: 300 }}
            InputProps={{
              startAdornment: <SearchIcon color="action" />
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </SearchRow>

        <FiltersRow>
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Email Status</InputLabel>
            <Select
              value={filters.emailConfirmation ?? ''}
              onChange={(e) => handleFilterChange({ 
                emailConfirmation: e.target.value === '' ? undefined : e.target.value === 'true'
              })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Confirmed</MenuItem>
              <MenuItem value="false">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Account Status</InputLabel>
            <Select
              value={filters.isLockedOut ?? ''}
              onChange={(e) => handleFilterChange({ 
                isLockedOut: e.target.value === '' ? undefined : e.target.value === 'true'
              })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="false">Active</MenuItem>
              <MenuItem value="true">Banned</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Subscription</InputLabel>
            <Select
              value={filters.subscriptionStatus ?? ''}
              onChange={(e) => handleFilterChange({ 
                subscriptionStatus: e.target.value as SubscriptionStatus || undefined
              })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={SubscriptionStatus.Active}>Active</MenuItem>
              <MenuItem value={SubscriptionStatus.Expired}>Expired</MenuItem>
              <MenuItem value={SubscriptionStatus.Trial}>Trial</MenuItem>
            </Select>
          </FormControl>
        </FiltersRow>
      </SearchAndFiltersContainer>

      {/* Accounts Table */}
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Email Status</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Required Actions</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(accounts?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyStateContainer>
                    <p>No accounts found</p>
                  </EmptyStateContainer>
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => {
                const status = getAccountStatus(account);
                const activeSubscription = getActiveSubscription(account);
                const requiredActions = hasRequiredActions(account);

                return (
                  <TableRow key={account.id} hover>
                    <TableCell>
                      <div>
                        <UsernameText>{account.username || '-'}</UsernameText>
                        <br />
                        <EmailText>{account.email || '-'}</EmailText>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {account.emailConfirmation ? (
                          <>
                            <EmailIcon color="success" fontSize="small" />
                            <span style={{ color: '#2e7d32' }}>Confirmed</span>
                          </>
                        ) : (
                          <>
                            <EmailOutlinedIcon color="warning" fontSize="small" />
                            <span style={{ color: '#ef6c00' }}>Pending</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusChip status={status}>
                        {getStatusText(status)}
                      </StatusChip>
                    </TableCell>

                    <TableCell>
                      {activeSubscription ? (
                        <SubscriptionBadge type={activeSubscription.subscriptionType ==  0 ? 'basic' : 'premium'}>
                          {activeSubscription.subscriptionType ==  0 ? 'basic' : 'premium'}
                        </SubscriptionBadge>
                      ) : (
                        <span style={{ color: '#999' }}>None</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {requiredActions ? (
                        <RequiredActionsBadge>
                          {(account.requiredActions?.length ?? 0)} Required
                        </RequiredActionsBadge>
                      ) : (
                        <span style={{ color: '#999' }}>None</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <DateText>{formatDate(account.createdOn)}</DateText>
                    </TableCell>

                    <TableCell>
                      <ActionButtonsContainer>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => onViewAccount?.(account.id!)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>

                        {account.lockedOut ? (
                          <Tooltip title="Unban Account">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleUnbanAccount(account.id!)}
                            >
                              <UnbanIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Ban Account">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleBanAccount(account.id!)}
                            >
                              <BanIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Disconnect Player">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleDisconnectPlayer(account.id!)}
                          >
                            <DisconnectIcon />
                          </IconButton>
                        </Tooltip>
                      </ActionButtonsContainer>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Pagination */}
      {totalCount > 0 && (
        <PaginationContainer>
          <TablePagination
            component="div"
            count={totalCount}
            page={(currentPage || 1) - 1}
            onPageChange={handlePageChange}
            rowsPerPage={searchParams.pageSize || 10}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </PaginationContainer>
      )}
    </AccountsContainer>
  );
}
