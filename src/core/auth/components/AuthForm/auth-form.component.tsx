import type { ReactNode } from 'react';
// Styles
import { FormContainer } from './auth-form.styles';

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthFormComponent({ children, onSubmit }: AuthFormProps) {
  return (
    <FormContainer onSubmit={onSubmit}>
      {children}
    </FormContainer>
  );
}
