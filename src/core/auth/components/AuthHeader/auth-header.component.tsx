import { Typography, Toolbar } from '@mui/material';
// Styles
import { HeaderContainer } from './auth-header.styles';

interface AuthHeaderProps {
  title: string;
}

export default function AuthHeaderComponent({ title }: AuthHeaderProps) {
  return (
    <HeaderContainer position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </HeaderContainer>
  );
}
