# Student Management System

An interactive web application, built with **React** and **JavaScript**, for viewing, adding, editing and deleting student records. Developed for **DIWA2110 – Web Application Development** (Individual Assignment).

- **Live application:** _to be added after deployment_
- **GitHub repository:** _to be added_

---

## Features

| Feature | Description |
|---|---|
| Student dashboard | All records shown in a structured table (turns into cards on mobile) |
| Student record fields | Student ID, full name, age, email address, course of study, enrollment status |
| Add student | "Add student" modal with a validated form; the new ID is generated automatically |
| Edit student | "Edit" modal pre-filled with the student's current details |
| Delete student | Confirmation modal before a record is removed |
| Validation | Required fields, full-name format, age range 16–80 (whole numbers), email format, duplicate-email check, course from list |
| Instant updates | The table and statistics update immediately after every add/edit/delete, without a page refresh |
| Search & filter | Search by ID, name, email or course; filter by enrollment status |
| Statistics | Total, enrolled, not enrolled and average age |
| Persistence | Records are saved in `localStorage` and survive a page refresh |
| Empty states | Clear messages when there are no students, or when no records match the search |
| Accessibility | Labelled inputs, keyboard support (Esc closes modals, focus moves into and stays inside modals), screen-reader friendly error messages |
| Responsive | Usable layouts on desktop, tablet and mobile |

---

## Getting started

**Requirements:** [Node.js](https://nodejs.org/) version 20 or newer (includes npm).

```bash
# 1. Install dependencies (creates node_modules – not committed to GitHub)
npm install

# 2. Start the development server
npm run dev
# then open the URL shown in the terminal (usually http://localhost:5173)
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with hot reload |
| `npm test` | Runs all automated tests once |
| `npm run test:watch` | Runs tests in watch mode while you edit |
| `npm run build` | Creates an optimised production build in `dist/` |
| `npm run preview` | Serves the production build locally |

---

## Project structure

```
student-management-system/
├── index.html                 # HTML page that React mounts into
├── package.json               # Dependencies and npm scripts
├── vite.config.js             # Vite build + Vitest test configuration
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx               # Entry point – renders <App />
    ├── App.jsx                # Root component: owns state and CRUD handlers
    ├── App.css                # All styles (CSS variables, responsive rules)
    ├── App.test.jsx           # Integration tests (user interactions)
    ├── setupTests.js          # Test setup (jest-dom matchers)
    ├── data/
    │   └── initialStudents.js # Sample records loaded on first visit
    ├── utils/
    │   ├── studentUtils.js    # Pure logic: validate, add, edit, delete, filter, stats
    │   ├── studentUtils.test.js
    │   └── storage.js         # localStorage load/save
    └── components/
        ├── Header.jsx             # Title + Add / Reset buttons
        ├── StatsBar.jsx           # Summary cards (StatCard reused 4×)
        ├── Toolbar.jsx            # Search box + status filter
        ├── StudentTable.jsx       # Table that maps students to rows
        ├── StudentRow.jsx         # One student row with Edit/Delete buttons
        ├── StatusBadge.jsx        # Enrolled / Not enrolled pill
        ├── EmptyState.jsx         # Shown when there is nothing to display
        ├── Modal.jsx              # Reusable modal shell (overlay, Esc, focus)
        ├── FormField.jsx          # Reusable label + input + error wrapper
        ├── StudentFormModal.jsx   # Add AND Edit form (one reusable component)
        ├── DeleteConfirmModal.jsx # Delete confirmation
        └── Toast.jsx              # Auto-dismissing success message
```

**Separation of responsibilities:** `utils/` contains plain JavaScript logic with no React code, so it can be reused and unit tested. `components/` contains only presentation and user interaction. `App.jsx` connects the two by holding state and passing data and callbacks down as props.

---

## How the application works

### Data flow
1. `App` holds the `students` array in React state (`useState`). On first load it reads from `localStorage`, falling back to the sample data.
2. `App` passes the (filtered) list to `StudentTable` as a prop; `StudentTable` uses `.map()` to render a `StudentRow` for each student.
3. When a button is clicked (e.g. **Edit**), the row calls a callback prop (`onEdit(student)`), and `App` updates its `modal` state to open the right modal.
4. On save, the modal sends the form values back with `onSave(values)`. `App` calls a pure function (`addStudent`, `updateStudent` or `deleteStudent`) that **returns a new array**, then calls `setStudents(newArray)`.
5. React sees the new array and re-renders the table and statistics immediately. A `useEffect` saves the array to `localStorage` whenever it changes.

### Modal state management
`App` stores a single state object: `{ type: 'add' | 'edit' | 'delete' | null, student }`.
- `type === null` → no modal is shown.
- The form modal is only **mounted** while open, so each time it opens it starts with fresh state (blank for Add, the student's values for Edit).
- `Modal.jsx` handles closing via the × button, the **Cancel** button, the **Escape** key, or clicking the dark overlay. It also moves focus into the dialog and returns it afterwards.

### Validation
`validateStudent(values, students, editingId)` returns an object of error messages (empty object = valid).

| Field | Rules |
|---|---|
| Full name | Required; letters, spaces, hyphens and apostrophes only; first **and** last name; max 60 characters |
| Age | Required; whole number; between 16 and 80 |
| Email | Required; valid format (`name@domain.tld`); not already used by another student (case-insensitive) |
| Course | Required; must be one of the listed courses |

Errors appear under each field plus a summary at the top. The form will not submit until all errors are fixed, and after the first attempt the messages update live as the user types.

---

## JavaScript data types used (and why)

| Data | Type | Reason |
|---|---|---|
| `id` (e.g. `"STU001"`) | **String** | It is a label made of letters and digits; it is never used in maths |
| `fullName`, `email`, `course` | **String** | Text values |
| `age` | **Number** | Needs numeric comparison (16–80 check) and averaging in statistics. Form inputs return strings, so `normaliseStudent()` converts it with `Number()` before saving, and `toFormValues()` converts it back with `String()` for editing |
| `isEnrolled` | **Boolean** | Enrollment status is a yes/no value, which is shown with a toggle switch and filtered with `student.isEnrolled` / `!student.isEnrolled` |
| A student record | **Object** | Groups the related fields of one student together under named keys |
| The list of students, `COURSES` | **Array** | Ordered collections that are processed with array methods (`map`, `filter`, `find`, `some`, `reduce`, `includes`) |
| Validation errors | **Object** | Maps each field name to its message, e.g. `{ age: 'Age is required.' }`; `Object.keys(errors).length` tells us if the form is valid |
| `null` | **Null** | Used for "no modal open" (`modal.type = null`) and "no toast" |

## Variable declarations used (and why)

| Keyword | Where | Reason |
|---|---|---|
| `const` | Almost everywhere – components, functions, constants such as `COURSES`, `MIN_AGE`, `EMAIL_PATTERN`, and values inside functions | The variable is never reassigned. This prevents accidental reassignment and makes the code easier to read. Note: `const` arrays/objects can still have their contents changed, but this app never does that – it always creates new arrays for React state |
| `let` | `matchesStatus` in `filterStudents()` | The value starts as `true` and is **reassigned** inside an `if/else`. `let` is block-scoped, so it only exists inside the filter callback |
| `var` | `generateStudentId()` only | Used deliberately to demonstrate **function scope**: `var i` and `var numericPart`, declared inside the `for` loop, are still accessible after the loop ends, because `var` belongs to the whole function, not the block. With `let`, they would not exist outside the loop. `var` is avoided elsewhere because it can be hoisted and leak out of blocks, causing bugs |

## Functions used

- **User-defined functions** (`function` keyword): `generateStudentId`, `validateStudent`, `addStudent`, `filterStudents`, `getStudentStats`, `loadStudents`, `saveStudents`, and every React component.
- **Arrow functions**: `normaliseStudent`, `toFormValues`, `updateStudent`, `deleteStudent`, `findStudentById`, `isFormValid`, `formatStatus`, `getInitials`, and all event handlers (`handleChange`, `handleSubmit`, `openEditModal`, …).
- **Parameters & return values**: every utility function takes the data it needs as parameters and returns a result, e.g. `deleteStudent(students, id)` returns a new array.
- **Conditionals**: `if / else if` in validation, ternary operators (`isEnrolled ? 'Enrolled' : 'Not enrolled'`), and conditional rendering in JSX (`{toast && <Toast />}`).
- **Array methods**: `map` (render rows, update a student), `filter` (delete, search), `find`, `some` (duplicate email check, search across fields), `reduce` (sum of ages), `includes` (course check).

## React concepts used

| Concept | Where |
|---|---|
| Functional components & JSX | Every file in `src/components/` |
| Props | e.g. `<StudentRow student={student} onEdit={onEdit} onDelete={onDelete} />` |
| Component reuse | `StudentFormModal` for both Add and Edit; `Modal` for all dialogs; `FormField` for each input; `StatCard` ×4 |
| `useState` | `students`, `searchTerm`, `statusFilter`, `modal`, `toast` in `App`; `values`, `errors` in the form |
| `useEffect` | Saving to localStorage; Escape-key listener and focus in `Modal`; auto-hiding the toast |
| `useCallback`, `useRef`, `useId` | Stable close handlers, focus management, unique ids for accessibility |
| Event handling | `onClick`, `onChange`, `onSubmit` (with `preventDefault()`), `onMouseDown`, `keydown` |
| Controlled inputs | Every form input's value comes from state and changes through `handleChange` |
| Lifting state up | Search/filter values live in `App` and are changed by `Toolbar` through callbacks |
| Keys in lists | `key={student.id}` in `StudentTable` |

---

## Testing

The project has **39 automated tests** (Vitest + React Testing Library). Run them with:

```bash
npm test
```

They cover adding, editing, deleting, cancelling, validation, empty states, search/filter and localStorage persistence. A full list of automated and manual test cases with results is in **[TESTING.md](TESTING.md)**.

---

## Technologies

- [React](https://react.dev/) – UI library
- [Vite](https://vite.dev/) – development server and build tool
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) – automated testing
- Plain CSS with CSS variables – styling and responsive layout
- Browser `localStorage` – persistent storage

## Deployment

_To be completed: deployment to Netlify or Vercel._

## Author

_Your name – Student ID_
Diploma in Information Technology / Diploma in Business Information Technology, Limkokwing University of Creative Technology, Lesotho.
