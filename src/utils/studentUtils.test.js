import { describe, expect, it } from 'vitest';
import {
  STATUS_FILTERS,
  addStudent,
  deleteStudent,
  filterStudents,
  generateStudentId,
  getInitials,
  getStudentStats,
  isFormValid,
  normaliseStudent,
  updateStudent,
  validateStudent,
} from './studentUtils.js';

const sample = [
  { id: 'STU001', fullName: 'Thabo Mokoena', age: 21, email: 'thabo@example.com', course: 'Diploma in Information Technology', isEnrolled: true },
  { id: 'STU002', fullName: 'Lerato Molapo', age: 19, email: 'lerato@example.com', course: 'Diploma in Business Information Technology', isEnrolled: false },
];

const validForm = {
  fullName: '  Neo   Mohapi ',
  age: '23',
  email: 'NEO@Example.com',
  course: 'Diploma in Software Engineering',
  isEnrolled: true,
};

describe('generateStudentId', () => {
  it('returns the next ID after the highest existing number', () => {
    expect(generateStudentId(sample)).toBe('STU003');
  });
  it('starts at STU001 when the list is empty', () => {
    expect(generateStudentId([])).toBe('STU001');
  });
  it('does not reuse an ID after a gap', () => {
    expect(generateStudentId([{ id: 'STU007' }, { id: 'STU002' }])).toBe('STU008');
  });
});

describe('normaliseStudent', () => {
  it('converts types and cleans input', () => {
    const result = normaliseStudent(validForm);
    expect(result.fullName).toBe('Neo Mohapi');
    expect(result.age).toBe(23);
    expect(typeof result.age).toBe('number');
    expect(result.email).toBe('neo@example.com');
    expect(result.isEnrolled).toBe(true);
  });
});

describe('validateStudent', () => {
  it('accepts valid input', () => {
    expect(isFormValid(validateStudent(validForm, sample))).toBe(true);
  });

  it('requires every field', () => {
    const errors = validateStudent({ fullName: '', age: '', email: '', course: '', isEnrolled: false }, sample);
    expect(Object.keys(errors).sort()).toEqual(['age', 'course', 'email', 'fullName']);
  });

  it('requires a first and last name', () => {
    expect(validateStudent({ ...validForm, fullName: 'Neo' }, sample).fullName).toMatch(/first name and a last name/);
  });

  it('rejects names with numbers', () => {
    expect(validateStudent({ ...validForm, fullName: 'Neo 123' }, sample).fullName).toBeDefined();
  });

  it.each(['15', '81', '-3', '20.5', 'abc'])('rejects an invalid age of %s', (age) => {
    expect(validateStudent({ ...validForm, age }, sample).age).toBeDefined();
  });

  it.each(['16', '80'])('accepts the boundary age %s', (age) => {
    expect(validateStudent({ ...validForm, age }, sample).age).toBeUndefined();
  });

  it.each(['neo', 'neo@', 'neo@example', 'neo example@x.com'])('rejects the email "%s"', (email) => {
    expect(validateStudent({ ...validForm, email }, sample).email).toMatch(/valid email/);
  });

  it('rejects a duplicate email (case-insensitive)', () => {
    expect(validateStudent({ ...validForm, email: 'THABO@example.com' }, sample).email).toMatch(/already uses/);
  });

  it('allows a student to keep their own email when editing', () => {
    expect(validateStudent({ ...validForm, email: 'thabo@example.com' }, sample, 'STU001').email).toBeUndefined();
  });

  it('rejects a course that is not in the list', () => {
    expect(validateStudent({ ...validForm, course: 'Hacking 101' }, sample).course).toBeDefined();
  });
});

describe('CRUD helpers', () => {
  it('addStudent returns a new array with the new record and does not mutate the original', () => {
    const result = addStudent(sample, validForm);
    expect(result.students).toHaveLength(3);
    expect(result.student.id).toBe('STU003');
    expect(sample).toHaveLength(2);
  });

  it('updateStudent changes only the matching record', () => {
    const updated = updateStudent(sample, 'STU002', { ...validForm, fullName: 'Lerato Molapo-Sello' });
    expect(updated[1].fullName).toBe('Lerato Molapo-Sello');
    expect(updated[1].id).toBe('STU002');
    expect(updated[0]).toBe(sample[0]);
  });

  it('deleteStudent removes the matching record', () => {
    expect(deleteStudent(sample, 'STU001').map((s) => s.id)).toEqual(['STU002']);
  });
});

describe('display helpers', () => {
  it('filters by search term and status', () => {
    expect(filterStudents(sample, 'lerato')).toHaveLength(1);
    expect(filterStudents(sample, 'STU00')).toHaveLength(2);
    expect(filterStudents(sample, '', STATUS_FILTERS.ENROLLED)[0].id).toBe('STU001');
    expect(filterStudents(sample, '', STATUS_FILTERS.NOT_ENROLLED)[0].id).toBe('STU002');
    expect(filterStudents(sample, 'nobody')).toHaveLength(0);
  });

  it('calculates statistics', () => {
    expect(getStudentStats(sample)).toEqual({ total: 2, enrolled: 1, notEnrolled: 1, averageAge: 20 });
    expect(getStudentStats([])).toEqual({ total: 0, enrolled: 0, notEnrolled: 0, averageAge: 0 });
  });

  it('builds initials', () => {
    expect(getInitials('Thabo Mokoena')).toBe('TM');
  });
});
