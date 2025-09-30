import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand and ask button', () => {
  render(<App />);
  expect(screen.getByText(/AI FAQ Assistant/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ask/i })).toBeInTheDocument();
});
