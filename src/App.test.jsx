import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { STORAGE_KEY } from './utils/storage.js';

/**
 * Integration tests: render the whole app and interact with it the way a
 * user would (clicking buttons, typing in inputs).
 */

// Helper: fill in the add/edit form inside the open dialog.
async function fillForm(user, { fullName, age, email, course }) {
  const dialog = screen.getByRole('dialog');
  if (fullName !== undefined) {
    const input = within(dialog).getByLabelText(/full name/i);
    await user.clear(input);
    if (fullName) await user.type(input, fullName);
  }
  if (age !== undefined) {
    const input = within(dialog).getByLabelText(/^age/i);
    await user.clear(input);
    if (age) await user.type(input, age);
  }
  if (email !== undefined) {
    const input = within(dialog).getByLabelText(/email address/i);
    await user.clear(input);
    if (email) await user.type(input, email);
  }
  if (course !== undefined) {
    await user.selectOptions(within(dialog).getByLabelText(/course of study/i), course);
  }
}

const getRows = () => screen.getAllByRole('row').slice(1); // skip the header row

// The "+ Add student" button in the page header (inside the <header> landmark).
const getHeaderAddButton = () =>
  within(screen.getByRole('banner')).getByRole('button', { name: /add student/i });

describe('Student Management System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays the sample students on the dashboard', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /student management system/i })).toBeInTheDocument();
    expect(getRows()).toHaveLength(5);
    expect(screen.getByText('Thabo Mokoena')).toBeInTheDocument();
  });

  it('adds a new student and shows it immediately', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getHeaderAddButton());
    expect(screen.getByRole('dialog', { name: /add new student/i })).toBeInTheDocument();

    await fillForm(user, {
      fullName: 'Neo Mohapi',
      age: '23',
      email: 'neo.mohapi@example.com',
      course: 'Diploma in Software Engineering',
    });
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /add student/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(getRows()).toHaveLength(6);
    expect(screen.getByText('Neo Mohapi')).toBeInTheDocument();
    expect(screen.getByText('STU006')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/neo mohapi was added/i);
  });

  it('shows validation messages and prevents an invalid submission', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getHeaderAddButton());
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /add student/i }));

    expect(within(dialog).getByText('Full name is required.')).toBeInTheDocument();
    expect(within(dialog).getByText('Age is required.')).toBeInTheDocument();
    expect(within(dialog).getByText('Email address is required.')).toBeInTheDocument();
    expect(within(dialog).getByText('Please select a course of study.')).toBeInTheDocument();

    // Invalid age and email format
    await fillForm(user, { fullName: 'Neo Mohapi', age: '12', email: 'not-an-email', course: 'Diploma in Software Engineering' });
    expect(within(dialog).getByText(/age must be between 16 and 80/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/valid email address/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /add student/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // still open
    expect(getRows()).toHaveLength(5); // nothing added

    // Fixing the errors clears the messages live
    await fillForm(user, { age: '20', email: 'neo@example.com' });
    expect(within(dialog).queryByText(/age must be between/i)).not.toBeInTheDocument();
    expect(within(dialog).queryByText(/valid email address/i)).not.toBeInTheDocument();
  });

  it('rejects a duplicate email address', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getHeaderAddButton());
    await fillForm(user, {
      fullName: 'Copy Cat',
      age: '30',
      email: 'thabo.mokoena@example.com',
      course: 'Diploma in Information Technology',
    });
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /add student/i }));

    expect(screen.getByText(/another student already uses this email/i)).toBeInTheDocument();
    expect(getRows()).toHaveLength(5);
  });

  it('cancel closes the add modal without saving (button, Escape and overlay)', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Cancel button
    await user.click(getHeaderAddButton());
    await fillForm(user, { fullName: 'Not Saved' });
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Not Saved')).not.toBeInTheDocument();

    // Escape key
    await user.click(getHeaderAddButton());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // × close button
    await user.click(getHeaderAddButton());
    await user.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Re-opening starts with an empty form
    await user.click(getHeaderAddButton());
    expect(screen.getByLabelText(/full name/i)).toHaveValue('');
    expect(getRows()).toHaveLength(5);
  });

  it('edits an existing student with the form pre-filled', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Edit Lerato Molapo' }));
    const dialog = screen.getByRole('dialog', { name: /edit student stu002/i });
    expect(within(dialog).getByLabelText(/full name/i)).toHaveValue('Lerato Molapo');
    expect(within(dialog).getByLabelText(/^age/i)).toHaveValue(19);

    await fillForm(user, { fullName: 'Lerato Molapo-Sello', age: '20' });
    await user.click(within(dialog).getByRole('checkbox')); // toggle enrollment
    await user.click(within(dialog).getByRole('button', { name: /save changes/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const row = screen.getByText('Lerato Molapo-Sello').closest('tr');
    expect(within(row).getByText('STU002')).toBeInTheDocument();
    expect(within(row).getByText('20')).toBeInTheDocument();
    expect(within(row).getByText('Not enrolled')).toBeInTheDocument();
    expect(getRows()).toHaveLength(5);
  });

  it('cancelling an edit keeps the original values', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Edit Thabo Mokoena' }));
    await fillForm(user, { fullName: 'Changed Name' });
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByText('Thabo Mokoena')).toBeInTheDocument();
    expect(screen.queryByText('Changed Name')).not.toBeInTheDocument();
  });

  it('asks for confirmation before deleting, and cancel keeps the record', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Delete Mpho Letsie' }));
    const dialog = screen.getByRole('dialog', { name: /delete student/i });
    expect(within(dialog).getByText('Mpho Letsie')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(screen.getByText('Mpho Letsie')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Mpho Letsie' }));
    await user.click(screen.getByRole('button', { name: /^delete student$/i }));

    expect(screen.queryByText('Mpho Letsie')).not.toBeInTheDocument();
    expect(getRows()).toHaveLength(4);
  });

  it('shows the empty state after every student is deleted', async () => {
    const user = userEvent.setup();
    render(<App />);

    for (const row of getRows()) {
      const name = within(row).getByText(/\w+ \w+/, { selector: '.name-cell__name' }).textContent;
      await user.click(screen.getByRole('button', { name: `Delete ${name}` }));
      await user.click(screen.getByRole('button', { name: /^delete student$/i }));
    }

    expect(screen.getByRole('heading', { name: /no students yet/i })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    // The empty-state button opens the add modal
    await user.click(within(screen.getByText(/no students yet/i).parentElement).getByRole('button', { name: /add student/i }));
    expect(screen.getByRole('dialog', { name: /add new student/i })).toBeInTheDocument();
  });

  it('searches and filters, with an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/search students/i), 'palesa');
    expect(getRows()).toHaveLength(1);

    await user.clear(screen.getByLabelText(/search students/i));
    await user.selectOptions(screen.getByLabelText(/filter by enrollment/i), 'not-enrolled');
    expect(getRows()).toHaveLength(2);

    await user.type(screen.getByLabelText(/search students/i), 'zzz');
    expect(screen.getByRole('heading', { name: /no matching students/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(getRows()).toHaveLength(5);
  });

  it('saves changes to localStorage so they survive a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Delete Thabo Mokoena' }));
    await user.click(screen.getByRole('button', { name: /^delete student$/i }));

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(4);

    unmount();
    render(<App />); // simulate a page refresh
    expect(screen.queryByText('Thabo Mokoena')).not.toBeInTheDocument();
    expect(getRows()).toHaveLength(4);
  });
});
