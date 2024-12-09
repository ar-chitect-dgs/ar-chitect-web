import { render, screen, waitFor } from '@testing-library/react';
import { fetchAllProjects } from '../api/projectsApi';
import Projects from './Projects';

jest.mock('firebase/auth');
jest.mock('react-redux');
jest.mock('react-router-dom');
jest.mock('../auth/AuthProvider', () => ({
  useAuth: () => ({ user: { uid: '123' } }),
}));
jest.mock('../api/projectsApi');

describe('Projects Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
    });
  });

  it('should render no projects message when no projects are found', async () => {
    (fetchAllProjects as jest.Mock).mockResolvedValue([]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    });
  });

  it('should render projects when fetched successfully', async () => {
    const mockProjects = [
      { id: '1', projectName: 'Project 1' },
      { id: '2', projectName: 'Project 2' },
    ];
    (fetchAllProjects as jest.Mock).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/your latest projects/i)).toBeInTheDocument();
      expect(screen.getByText(/project 1/i)).toBeInTheDocument();
      expect(screen.getByText(/project 2/i)).toBeInTheDocument();
    });
  });

  it('should handle fetch projects error', async () => {
    (fetchAllProjects as jest.Mock).mockRejectedValue(
      new Error('Error fetching projects'),
    );

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    });
  });
});
