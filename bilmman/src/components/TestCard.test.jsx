import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TestCard from './TestCard';
import freeGeometryTests from '../data/freeGeometryTests.json';
import { api, recordVerifiedLocalAttemptV13 } from '../api/client';

// CRA's Jest resolver predates React Router 7's package exports.
jest.mock('react-router-dom', () => {
  global.TextEncoder = require('util').TextEncoder;
  return jest.requireActual('react-router');
}, { virtual: true });

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, loading: false }),
}));
jest.mock('../api/client', () => ({
  api: { testDetail: jest.fn() },
  recordVerifiedLocalAttemptV13: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test.each(freeGeometryTests.map((entry, i) => [entry.topic, entry, i + 16]))(
  '%s opens from a direct URL and saves all 15 answers',
  async (topic, entry, id) => {
    api.testDetail.mockResolvedValue({ id, title: topic, subject: { slug: 'geo' }, is_premium: false });
    recordVerifiedLocalAttemptV13.mockResolvedValue({ id: 1, score: 15, percentage: 100 });
    render(
      <MemoryRouter initialEntries={[`/card/${id}`]}>
        <Routes><Route path="/card/:testId" element={<TestCard />} /></Routes>
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByRole('button', { name: /boshlash/i }));
    for (const question of entry.questions) {
      expect(screen.getByText(question.question)).toBeTruthy();
      fireEvent.click(screen.getByText(question.answer, { selector: '.option' }));
      fireEvent.click(screen.getByRole('button', { name: 'Keyingi' }));
    }
    await waitFor(() => expect(recordVerifiedLocalAttemptV13).toHaveBeenCalledTimes(1));
    const [testId, payload] = recordVerifiedLocalAttemptV13.mock.calls[0];
    expect(testId).toBe(String(id));
    expect(payload.answers).toEqual(entry.questions.map((question, question_index) => ({
      question_index, selected_answer: question.answer,
    })));
    expect(await screen.findByText('Natija saqlandi: 100%')).toBeTruthy();
  },
);
