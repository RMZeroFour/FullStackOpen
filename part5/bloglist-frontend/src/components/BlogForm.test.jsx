import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm.jsx';

describe('BlogForm component', () => {
  test('calls event handler with right values', async () => {
    const handler = vi.fn();
    const showMessage = vi.fn();

    render(<BlogForm onBlogAdd={handler} showMessage={showMessage}/>);

    const event = userEvent.setup();
    const textboxes = screen.getAllByRole('textbox');
    await event.type(textboxes[0], 'abc');
    await event.type(textboxes[1], 'def');
    await event.type(textboxes[2], 'ghi');
    await event.click(screen.getByText('create'));

    expect(handler.mock.calls).toHaveLength(1);
    expect(handler.mock.calls[0][0]).toBe('abc');
    expect(handler.mock.calls[0][1]).toBe('def');
    expect(handler.mock.calls[0][2]).toBe('ghi');
  });
});