import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VotzApiKeyForm } from '../components/VotzApiKeyForm';

vi.mock('../../../core/api/settingsApi', () => ({
  settingsApi: {
    getApiKey: vi.fn().mockResolvedValue(null),
    upsertApiKey: vi.fn(),
    deleteApiKey: vi.fn(),
  },
}));

vi.mock('../components/Toast');

describe('VotzApiKeyForm', () => {
  it('renders title', async () => {
    render(<VotzApiKeyForm />);
    expect(screen.getByText('Clé API VOTZ')).toBeInTheDocument();
  });
});
