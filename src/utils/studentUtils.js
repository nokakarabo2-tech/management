/**
 * studentUtils.js
 * ---------------------------------------------------------------
 * Pure JavaScript functions that hold the application logic for
 * adding, editing, deleting, validating, filtering and displaying
 * student records. They take parameters and RETURN new values;
 * they never change the arrays/objects they receive (immutability),
 * which is what React state needs to detect changes and re-render.
 * Keeping the logic here (instead of inside components) makes it
 * reusable and easy to test.
 */

// ---------- Constants (const: these values never get reassigned) ----------

/** Array of the courses a student can choose from (non-primitive: array of strings). */
export const COURSES = [
  'Diploma in Information Technology',
  'Diploma in Business Information Technology',
  'Diploma in Software Engineering',
  'Diploma in Multimedia and Web Design',
  'Diploma in Network Engineering',
];

/** Age limits used by validation (primitive: numbers). */
export const MIN_AGE = 16;
export const MAX_AGE = 80;

/** Status filter options used by the dashboard dropdown. */
export const STATUS_FILTERS = {
  ALL: 'all',
  ENROLLED: 'enrolled',
  NOT_ENROLLED: 'not-enrolled',
};

/**
 * Blank values for the "Add student" form.
 * Form inputs always give us strings, so age starts as '' (string) here
 * and is converted to a number in normaliseStudent() before saving.
 */
export const EMPTY_FORM = {
  fullName: '',
  age: '',
  email: '',
  course: '',
  isEnrolled: true,
};

// Regular expressions are objects too; const because they never change.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[A-Za-z][A-Za-z' -]*$/;

// ---------- ID generation ----------

/**
 * Creates the next student ID, e.g. "STU006".
 *
 * NOTE ON `var`: this is the one place `var` is used, on purpose, to
 * demonstrate function scope. Variables declared with `var` inside the
 * `for` loop (`i`, `numericPart`) are scoped to the whole function, not
 * just the loop block, so they are still readable after the loop ends.
 * Everywhere else the app uses `const`/`let`, because their block scope
 * prevents accidental reuse and `const` prevents accidental reassignment.
 *
 * @param {Array<Object>} students - current list of students
 * @returns {string} a new unique ID
 */
export function generateStudentId(students) {
  var highest = 0;

  for (var i = 0; i < students.length; i++) {
    var numericPart = parseInt(String(students[i].id).replace(/\D/g, ''), 10);
    if (!Number.isNaN(numericPart) && numericPart > highest) {
      highest = numericPart;
    }
  }
  // `i` is still accessible here (function scope) – it equals students.length.
  // With `let i` this line would throw a ReferenceError.

  return 'STU' + String(highest + 1).padStart(3, '0');
}

// ---------- Input handling ----------

/**
 * Converts raw form values (all strings) into a correctly typed record.
 * - trims whitespace from strings
 * - converts age from string to number
 * - lower-cases the email so duplicates are detected regardless of case
 * - makes sure isEnrolled is a real boolean
 *
 * @param {Object} values - values from the form
 * @returns {Object} cleaned student fields (without id)
 */
export const normaliseStudent = (values) => ({
  fullName: values.fullName.trim().replace(/\s+/g, ' '),
  age: Number(values.age),
  email: values.email.trim().toLowerCase(),
  course: values.course,
  isEnrolled: Boolean(values.isEnrolled),
});

/**
 * Converts a saved student back into form values (age becomes a string
 * because <input> elements work with strings).
 */
export const toFormValues = (student) => ({
  fullName: student.fullName,
  age: String(student.age),
  email: student.email,
  course: student.course,
  isEnrolled: student.isEnrolled,
});

// ---------- Validation ----------

/**
 * Validates form values and returns an object of error messages.
 * An empty object means the form is valid.
 *
 * @param {Object} values - form values to check
 * @param {Array<Object>} students - existing students (for duplicate email check)
 * @param {string|null} editingId - ID of the student being edited (skipped in duplicate check)
 * @returns {Object} e.g. { email: 'Please enter a valid email address.' }
 */
export function validateStudent(values, students, editingId = null) {
  const errors = {};

  // Full name
  const name = values.fullName.trim();
  if (name === '') {
    errors.fullName = 'Full name is required.';
  } else if (!NAME_PATTERN.test(name)) {
    errors.fullName = 'Name may only contain letters, spaces, hyphens and apostrophes.';
  } else if (name.split(/\s+/).length < 2) {
    errors.fullName = 'Please enter both a first name and a last name.';
  } else if (name.length > 60) {
    errors.fullName = 'Name must be 60 characters or fewer.';
  }

  // Age (arrives as a string from the input, so convert and check it is a whole number)
  const ageText = String(values.age).trim();
  const age = Number(ageText);
  if (ageText === '') {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(age)) {
    errors.age = 'Age must be a whole number.';
  } else if (age < MIN_AGE || age > MAX_AGE) {
    errors.age = `Age must be between ${MIN_AGE} and ${MAX_AGE}.`;
  }

  // Email
  const email = values.email.trim().toLowerCase();
  if (email === '') {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).';
  } else if (
    students.some((student) => student.email === email && student.id !== editingId)
  ) {
    errors.email = 'Another student already uses this email address.';
  }

  // Course
  if (values.course === '') {
    errors.course = 'Please select a course of study.';
  } else if (!COURSES.includes(values.course)) {
    errors.course = 'Please select a course from the list.';
  }

  return errors;
}

/** Returns true when an errors object has no messages. */
export const isFormValid = (errors) => Object.keys(errors).length === 0;

// ---------- CRUD operations (each returns a NEW array) ----------

/** Adds a student and returns the new array plus the created record. */
export function addStudent(students, values) {
  const newStudent = { id: generateStudentId(students), ...normaliseStudent(values) };
  return { students: [...students, newStudent], student: newStudent };
}

/** Replaces the student with the matching id using map(). */
export const updateStudent = (students, id, values) =>
  students.map((student) =>
    student.id === id ? { ...student, ...normaliseStudent(values) } : student
  );

/** Removes the student with the matching id using filter(). */
export const deleteStudent = (students, id) =>
  students.filter((student) => student.id !== id);

/** Finds one student by id using find(); returns undefined if not found. */
export const findStudentById = (students, id) =>
  students.find((student) => student.id === id);

// ---------- Display helpers ----------

/**
 * Filters the list by a search term (matches ID, name, email or course)
 * and by enrollment status.
 */
export function filterStudents(students, searchTerm, statusFilter = STATUS_FILTERS.ALL) {
  const term = searchTerm.trim().toLowerCase();

  return students.filter((student) => {
    const matchesSearch =
      term === '' ||
      [student.id, student.fullName, student.email, student.course].some((field) =>
        field.toLowerCase().includes(term)
      );

    let matchesStatus = true; // let: may be reassigned below
    if (statusFilter === STATUS_FILTERS.ENROLLED) {
      matchesStatus = student.isEnrolled;
    } else if (statusFilter === STATUS_FILTERS.NOT_ENROLLED) {
      matchesStatus = !student.isEnrolled;
    }

    return matchesSearch && matchesStatus;
  });
}

/**
 * Calculates dashboard statistics with reduce().
 * @returns {{ total: number, enrolled: number, notEnrolled: number, averageAge: number }}
 */
export function getStudentStats(students) {
  const total = students.length;
  const enrolled = students.filter((student) => student.isEnrolled).length;
  const ageSum = students.reduce((sum, student) => sum + student.age, 0);
  const averageAge = total === 0 ? 0 : Math.round((ageSum / total) * 10) / 10;

  return { total, enrolled, notEnrolled: total - enrolled, averageAge };
}

/** Turns the isEnrolled boolean into readable text. */
export const formatStatus = (isEnrolled) => (isEnrolled ? 'Enrolled' : 'Not enrolled');