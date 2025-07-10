import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog.jsx';

describe('Blog component', () => {
  test('renders only title and author by default', () => {
    const user = {
      id: '5a422a851b54a676234d17f7',
      username: 'test-user',
      name: 'Tester'
    };
    const blog = {
      title: 'abc',
      author: 'def',
      url: 'ghi',
      likes: 5,
      user,
    };
    
    render(<Blog blog={blog} user={user} />);

    expect(screen.queryByText(/abc/)).toBeDefined();
    expect(screen.queryByText(/def/)).toBeDefined();
    expect(screen.queryByText(/ghi/)).toBeNull();
    expect(screen.queryByText(/5/)).toBeNull();
  });

  test('renders url and likes when view is clicked', async () => {
    const user = {
      id: '5a422a851b54a676234d17f7',
      username: 'test-user',
      name: 'Tester'
    };
    const blog = {
      title: 'abc',
      author: 'def',
      url: 'ghi',
      likes: 5,
      user,
    };

    render(<Blog blog={blog} user={user} />);

    const event = userEvent.setup();
    await event.click(screen.getByText('view'));

    expect(screen.queryByText(/abc/)).toBeDefined();
    expect(screen.queryByText(/def/)).toBeDefined();
    expect(screen.queryByText(/ghi/)).toBeDefined();
    expect(screen.queryByText(/5/)).toBeDefined();
  });

  test('has like event handler called the correct number of times', async () => {
    const user = {
      id: '5a422a851b54a676234d17f7',
      username: 'test-user',
      name: 'Tester'
    };
    const blog = {
      title: 'abc',
      author: 'def',
      url: 'ghi',
      likes: 5,
      user,
    };

    const handler = vi.fn();

    render(<Blog blog={blog} user={user} onBlogLike={handler}/>);

    const event = userEvent.setup();
    await event.click(screen.getByText('view'));

    const likeButton = screen.getByText('like');
    await event.click(likeButton);
    await event.click(likeButton);

    expect(screen.queryByText(/7/)).toBeDefined();
    expect(handler.mock.calls).toHaveLength(2);
  });
});