import React from 'react';
import { useGetTicketsQuery } from '../../services/support-tickets.service';
import { CircularProgress, Typography, Button, Paper } from '@mui/material';

export default function SupportTicketsScreen() {
  const { data, error, isLoading, refetch } = useGetTicketsQuery();

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Support Tickets
      </Typography>
      <Button variant="outlined" onClick={() => refetch()} sx={{ mb: 2 }}>
        Refresh
      </Button>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error loading tickets</Typography>}
      {data && data.length === 0 && <Typography>No tickets found.</Typography>}
      {data && data.length > 0 && (
        <ul>
          {data.map((ticket: any) => (
            <li key={ticket.ticketId}>
              <strong>{ticket.issueDetails?.subject}</strong> - {ticket.status}
            </li>
          ))}
        </ul>
      )}
    </Paper>
  );
}
