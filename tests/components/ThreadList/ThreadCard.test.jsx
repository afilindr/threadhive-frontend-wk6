import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThreadCard from '../../../src/components/ThreadList/ThreadCard';

vi.mock('../../../src/services/userService', () => ({
  getUserName: vi.fn((id) => `user-${id}`),
}));

const baseThread = {
  _id: 't1',
  title: 'Hello ThreadHive',
  content: 'This is the thread body.',
  author: 'u42',
  subredditName: 'reactjs',
  upvotedBy: ['a', 'b', 'c'],
  downvotedBy: ['d'],
};

describe('ThreadCard', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  describe('rendering', () => {
    it('shows title, content, author and subreddit', () => {
      render(<ThreadCard thread={baseThread} />);

      expect(screen.getByRole('heading', { level: 3, name: 'Hello ThreadHive' })).toBeInTheDocument();
      expect(screen.getByText('This is the thread body.')).toBeInTheDocument();
      expect(screen.getByText('user-u42')).toBeInTheDocument();
      expect(screen.getByText('r/reactjs')).toBeInTheDocument();
    });

    it('shows vote buttons with accessible labels', () => {
      render(<ThreadCard thread={baseThread} />);

      expect(screen.getByRole('button', { name: 'Upvote' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Downvote' })).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('displays net vote count (upvotes minus downvotes)', () => {
      render(<ThreadCard thread={baseThread} />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays a negative vote count', () => {
      render(
        <ThreadCard thread={{ ...baseThread, upvotedBy: [], downvotedBy: ['x', 'y'] }} />
      );
      expect(screen.getByText('-2')).toBeInTheDocument();
    });

    it('displays zero when there are no votes', () => {
      render(<ThreadCard thread={{ ...baseThread, upvotedBy: [], downvotedBy: [] }} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('hides the back button when goBack is not provided', () => {
      render(<ThreadCard thread={baseThread} />);
      expect(screen.queryByRole('button', { name: /back to home/i })).not.toBeInTheDocument();
    });

    it('shows the back button when goBack is provided', () => {
      render(<ThreadCard thread={baseThread} goBack={vi.fn()} />);
      expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onSelect with the thread when the card is clicked', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<ThreadCard thread={baseThread} onSelect={onSelect} />);

      await user.click(screen.getByText('This is the thread body.'));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(baseThread);
    });

    it('does not throw when clicked without onSelect', async () => {
      const user = userEvent.setup();
      render(<ThreadCard thread={baseThread} />);

      await user.click(screen.getByRole('heading', { name: 'Hello ThreadHive' }));

      expect(screen.getByRole('heading', { name: 'Hello ThreadHive' })).toBeInTheDocument();
    });

    it('calls goBack when the back button is clicked', async () => {
      const user = userEvent.setup();
      const goBack = vi.fn();
      render(<ThreadCard thread={baseThread} goBack={goBack} />);

      await user.click(screen.getByRole('button', { name: /back to home/i }));

      expect(goBack).toHaveBeenCalledTimes(1);
    });

    it('alerts on upvote click', async () => {
      const user = userEvent.setup();
      render(<ThreadCard thread={baseThread} />);

      await user.click(screen.getByRole('button', { name: 'Upvote' }));

      expect(window.alert).toHaveBeenCalledWith('Upvote clicked!');
    });

    it('alerts on downvote click', async () => {
      const user = userEvent.setup();
      render(<ThreadCard thread={baseThread} />);

      await user.click(screen.getByRole('button', { name: 'Downvote' }));

      expect(window.alert).toHaveBeenCalledWith('Downvote clicked!');
    });
  });
});
