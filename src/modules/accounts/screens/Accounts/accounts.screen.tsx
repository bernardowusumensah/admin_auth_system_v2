import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import { Email, Person, CalendarToday, Security, Subscriptions, ArrowBack } from '@mui/icons-material';
import type { AppDispatch, RootState } from '@app/store';
import type { AccountDto } from '@core/types';
import { SubscriptionStatus } from '@core/types';
import { fetchAccountDetails, clearSelectedAccount } from '@modules/accounts/store/accounts.slice';
import AccountsTable from '@modules/accounts/components/AccountsTable/accounts-table.component';

export default function AccountsScreen() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount, loading, error } = useSelector((state: RootState) => state.accounts);

  const handleViewAccount = async (accountId: string) => {
    setIsDetailsOpen(true);
    await dispatch(fetchAccountDetails(accountId));
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    dispatch(clearSelectedAccount());
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (account: AccountDto): 'error' | 'warning' | 'success' => {
    if (account?.lockedOut) return 'error';
    if (account?.emailConfirmation === false) return 'warning';
    return 'success';
  };

  const getStatusText = (account: AccountDto): string => {
    if (account?.lockedOut) return 'Banned';
    if (account?.emailConfirmation === false) return 'Pending Verification';
    return 'Active';
  };

  return (
    <div>
      {/* Header with Back Button */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={handleBackClick}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1">
          Account Management
        </Typography>
      </Box>

      <AccountsTable onViewAccount={handleViewAccount} />

      {/* Account Details Dialog */}
      <Dialog 
        open={isDetailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Account Details
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {loading && (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {selectedAccount && selectedAccount.account && !loading && (
            <Stack spacing={3}>
              {/* Basic Account Info */}
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="primary" />
                  Account Information
                </Typography>
                <Box sx={{ pl: 3, '& > div': { mb: 2 } }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">ID</Typography>
                    <Typography variant="body1">{selectedAccount.account.id || 'N/A'}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary">Username</Typography>
                    <Typography variant="body1">{selectedAccount.account.username || 'N/A'}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary">Status</Typography>
                    <Chip 
                      label={getStatusText(selectedAccount.account)} 
                      color={getStatusColor(selectedAccount.account)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email color="primary" />
                  Contact Information
                </Typography>
                <Box sx={{ pl: 3, '& > div': { mb: 2 } }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{selectedAccount.account.email || 'N/A'}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary">Email Verified</Typography>
                    <Chip 
                      label={selectedAccount.account.emailConfirmation ? 'Verified' : 'Pending'} 
                      color={selectedAccount.account.emailConfirmation ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Dates */}
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="primary" />
                  Timeline
                </Typography>
                <Box sx={{ pl: 3, '& > div': { mb: 2 } }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Created On</Typography>
                    <Typography variant="body1">{formatDate(selectedAccount.account.createdOn)}</Typography>
                  </Box>
                  
                  {selectedAccount.account.lockedOut && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">Locked Out On</Typography>
                      <Typography variant="body1" color="error">{formatDate(selectedAccount.account.lockedOut)}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Subscriptions */}
              {selectedAccount.account.subscriptions && selectedAccount.account.subscriptions.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Subscriptions color="primary" />
                      Subscriptions
                    </Typography>
                    <Box sx={{ pl: 3 }}>
                      {selectedAccount.account.subscriptions.map((subscription, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Stack spacing={1}>
                            <Box>
                              <Typography variant="body2" color="textSecondary">Type</Typography>
                              <Typography variant="body1">{subscription.subscriptionType}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">Status</Typography>
                              <Chip 
                                label={subscription.status} 
                                color={subscription.status === SubscriptionStatus.Active ? 'success' : 'default'}
                                size="small"
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">Start Date</Typography>
                              <Typography variant="body1">{formatDate(subscription.startDate)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">End Date</Typography>
                              <Typography variant="body1">{formatDate(subscription.endDate)}</Typography>
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {/* Required Actions */}
              {selectedAccount.account.requiredActions && selectedAccount.account.requiredActions.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security color="primary" />
                      Required Actions
                    </Typography>
                    <Box sx={{ pl: 3 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {selectedAccount.account.requiredActions.map((action, index) => (
                          <Chip 
                            key={index}
                            label={action.requiredActionType || 'Unknown Action'}
                            color="warning"
                            size="small"
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </>
              )}

              {/* User Information (if available) */}
              {selectedAccount.user && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      User Profile
                    </Typography>
                    <Box sx={{ pl: 3, '& > div': { mb: 2 } }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Display Name</Typography>
                        <Typography variant="body1">{selectedAccount.user.displayName || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Gender</Typography>
                        <Typography variant="body1">{selectedAccount.user.gender || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Date of Birth</Typography>
                        <Typography variant="body1">{formatDate(selectedAccount.user.dateOfBirth)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
