
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  PersonAdd as AssignIcon,
  Note as NoteIcon,
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useSupportTickets } from '@modules/hooks';
import type { TicketStatus, UpdateTicketStatusRequest, AddInternalNoteRequest, AssignTicketRequest } from '@core/types';

export default function SupportTicketsScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // Form states
  const [newNote, setNewNote] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const {
    tickets,
    selectedTicket,
    totalCount,
    currentPage,
    loading,
    error,
    searchParams,
    loadTickets,
    loadTicketById,
    updateStatus,
    addNote,
    assignTo: assignTicket,
    updateSearchParams,
    clearSelected,
    clearErrors
  } = useSupportTickets();

  // Load tickets on component mount and when search params change
  useEffect(() => {
    loadTickets(searchParams);
  }, [loadTickets, searchParams]);

  // Handle back navigation
  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle search
  const handleSearch = useCallback(() => {
    updateSearchParams({
      ...searchParams,
      page: 1,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      assignedTo: assignedToFilter || undefined
    });
  }, [searchTerm, statusFilter, categoryFilter, assignedToFilter, searchParams, updateSearchParams]);

  // Handle pagination
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    updateSearchParams({
      ...searchParams,
      page: newPage + 1
    });
  }, [searchParams, updateSearchParams]);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({
      ...searchParams,
      page: 1,
      pageSize: parseInt(event.target.value, 10)
    });
  }, [searchParams, updateSearchParams]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadTickets(searchParams);
  }, [loadTickets, searchParams]);

  // Handle view ticket details
  const handleViewTicket = useCallback(async (ticketId: string) => {
    setSelectedTicketId(ticketId);
    await loadTicketById(ticketId);
    setDetailsDialogOpen(true);
  }, [loadTicketById]);

  // Handle status update
  const handleStatusUpdate = useCallback(async (ticketId: string, status: TicketStatus) => {
    const request: UpdateTicketStatusRequest = {
      ticketId,
      newStatus: status
    };
    await updateStatus(ticketId, request);
    loadTickets(searchParams); // Refresh the list
  }, [updateStatus, loadTickets, searchParams]);

  // Handle add note
  const handleAddNote = useCallback(async () => {
    if (!selectedTicketId || !newNote.trim()) return;
    
    const request: AddInternalNoteRequest = {
      ticketId: selectedTicketId,
      noteContent: newNote.trim()
    };
    
    await addNote(selectedTicketId, request);
    setNewNote('');
    setNoteDialogOpen(false);
    
    // Refresh ticket details
    if (selectedTicketId) {
      await loadTicketById(selectedTicketId);
    }
  }, [selectedTicketId, newNote, addNote, loadTicketById]);

  // Handle assign ticket
  const handleAssignTicket = useCallback(async () => {
    if (!selectedTicketId) return;
    
    const request: AssignTicketRequest = {
      assignedTo: assignTo.trim() || undefined
    };
    
    await assignTicket(selectedTicketId, request);
    setAssignTo('');
    setAssignDialogOpen(false);
    loadTickets(searchParams); // Refresh the list
  }, [selectedTicketId, assignTo, assignTicket, loadTickets, searchParams]);

  // Helper functions
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'New': return 'primary';
      case 'Open': return 'warning';
      case 'PendingPlayerResponse': return 'info';
      case 'Closed': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
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
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Support Tickets
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearErrors}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Box>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={loading}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterIcon />}
            >
              Filters
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleRefresh}
              disabled={loading}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </Box>

          {/* Advanced Filters */}
          {showFilters && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ minWidth: '200px' }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value as TicketStatus)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="PendingPlayerResponse">Pending Player Response</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  />
                </Box>
                <Box sx={{ minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Assigned To"
                    value={assignedToFilter}
                    onChange={(e) => setAssignedToFilter(e.target.value)}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Tickets Table */}
        {loading && tickets.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No tickets found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.ticketId} hover>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {ticket.ticketId.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Typography variant="body2" fontWeight="medium">
                            {ticket.playerInfo?.username || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {ticket.playerInfo?.email || 'N/A'}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {ticket.issueDetails?.subject || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ticket.issueDetails?.category || 'N/A'} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ticket.status} 
                          color={getStatusColor(ticket.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {ticket.assignedTo || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(ticket.submittedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewTicket(ticket.ticketId)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Note">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                setSelectedTicketId(ticket.ticketId);
                                setNoteDialogOpen(true);
                              }}
                            >
                              <NoteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Assign">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                setSelectedTicketId(ticket.ticketId);
                                setAssignTo(ticket.assignedTo || '');
                                setAssignDialogOpen(true);
                              }}
                            >
                              <AssignIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalCount > 0 && (
              <TablePagination
                component="div"
                count={totalCount}
                page={currentPage - 1}
                onPageChange={handlePageChange}
                rowsPerPage={searchParams.pageSize || 20}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />
            )}
          </>
        )}
      </Paper>

      {/* Ticket Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => {
          setDetailsDialogOpen(false);
          clearSelected();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Ticket Details
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Stack spacing={3}>
              {/* Basic Info */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Ticket ID</Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {selectedTicket.ticketId}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Status</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <FormControl size="small">
                          <Select
                            value={selectedTicket.status}
                            onChange={(e) => handleStatusUpdate(selectedTicket.ticketId, e.target.value as TicketStatus)}
                          >
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="PendingPlayerResponse">Pending Player Response</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Assigned To</Typography>
                      <Typography variant="body1">
                        {selectedTicket.assignedTo || 'Unassigned'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedTicket.lastUpdatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Player Info */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Player Information</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Username</Typography>
                      <Typography variant="body1">{selectedTicket.playerInfo?.username || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{selectedTicket.playerInfo?.email || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Issue Details */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Issue Details</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Category</Typography>
                      <Typography variant="body1">{selectedTicket.issueDetails?.category || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="body2" color="textSecondary">Subject</Typography>
                      <Typography variant="body1">{selectedTicket.issueDetails?.subject || 'N/A'}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Details</Typography>
                    <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {selectedTicket.issueDetails?.details || 'No details available'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Internal Notes */}
              {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Internal Notes</Typography>
                    <Stack spacing={2}>
                      {selectedTicket.internalNotes.map((note) => (
                        <Box key={note.id} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {note.author}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDate(note.timestamp)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {note.note}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setSelectedTicketId(selectedTicket?.ticketId || null);
              setNoteDialogOpen(true);
            }}
            startIcon={<NoteIcon />}
          >
            Add Note
          </Button>
          <Button onClick={() => {
            setDetailsDialogOpen(false);
            clearSelected();
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Internal Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddNote} 
            variant="contained"
            disabled={!newNote.trim()}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Ticket Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Ticket</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Assign To (leave empty to unassign)"
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Enter username or leave empty"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAssignTicket} 
            variant="contained"
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
