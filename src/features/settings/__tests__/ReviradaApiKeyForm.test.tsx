import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviradaApiKeyForm } from '../components/ReviradaApiKeyForm';

vi.mock('../../../core/api/settingsApi', () => ({
  settingsApi: {
    getApiKey: vi.fn().mockResolvedValue(null),
    upsertApiKey: vi.fn(),
    deleteApiKey: vi.fn(),
  },
}));

vi.mock('../components/Toast');

describe('ReviradaApiKeyForm', () => {
  it('renders title', async () => {
    render(<ReviradaApiKeyForm />);
    expect(screen.getByText('Clé API Revirada')).toBeInTheDocument();
  });
});
