# Testing Documentation

This document records how the Student Management System was tested. Testing was done in two ways:

1. **Automated tests** – run with `npm test` (Vitest + React Testing Library).
2. **Manual tests** – performed in the browser on desktop and mobile screen sizes.

---

## 1. Automated tests

```bash
npm test
```

Latest result:

```
 Test Files  2 passed (2)
      Tests  39 passed (39)
```

### Unit tests – `src/utils/studentUtils.test.js`
These test the pure JavaScript logic functions directly.

| Area | What is tested |
|---|---|
| ID generation | Next ID after the highest number; `STU001` for an empty list; no reuse of IDs after gaps |
| Input handling | Age converted from string to number, whitespace trimmed, email lower-cased, boolean status |
| Validation | Valid input accepted; all required fields; first + last name; no digits in names; ages 15, 81, -3, 20.5, "abc" rejected; boundary ages 16 and 80 accepted; invalid emails rejected; duplicate email rejected (case-insensitive); own email allowed when editing; unknown course rejected |
| CRUD | `addStudent` returns a new array without changing the original; `updateStudent` changes only the matching record and keeps its ID; `deleteStudent` removes the right record |
| Display | Search by name/ID, status filters, no-match result, statistics (including empty list), initials |

### Integration tests – `src/App.test.jsx`
These render the full application and interact with it like a user.

| # | Test | Result |
|---|---|---|
| 1 | Dashboard displays the 5 sample students | ✅ Pass |
| 2 | **Add**: fill in the form → modal closes, new row `STU006` appears immediately, confirmation message shown | ✅ Pass |
| 3 | **Validation**: empty submit shows 4 required-field messages; age 12 and bad email show messages; form stays open and nothing is added; messages disappear when fixed | ✅ Pass |
| 4 | **Validation**: duplicate email is rejected | ✅ Pass |
| 5 | **Cancel (add)**: Cancel button, Escape key and × button all close the modal without saving; re-opening gives an empty form | ✅ Pass |
| 6 | **Edit**: form is pre-filled; changing name, age and status updates the row immediately and keeps the same ID | ✅ Pass |
| 7 | **Cancel (edit)**: changes are discarded | ✅ Pass |
| 8 | **Delete**: confirmation modal shows the student's name; Cancel keeps the record; Confirm removes it | ✅ Pass |
| 9 | **Empty state**: after deleting every student, "No students yet" appears and its button opens the Add modal | ✅ Pass |
| 10 | **Search/filter**: search narrows results; status filter works; "No matching students" appears for no matches; Clear filters restores the list | ✅ Pass |
| 11 | **Persistence**: a deletion is saved to localStorage and is still there after the app is reloaded | ✅ Pass |

---

## 2. Manual test cases

Tested in the browser with `npm run dev` at desktop width (1280px) and mobile width (390px).

| ID | Feature | Steps | Expected result | Actual result |
|---|---|---|---|---|
| M1 | View dashboard | Open the app | Table with 5 students and 4 statistic cards | ✅ As expected |
| M2 | Add – valid | Add student → fill all fields → Add student | Modal closes, student appears at the bottom with next ID, stats update, green message | ✅ As expected |
| M3 | Add – empty | Add student → click Add student with empty form | 4 error messages + "Please fix 4 fields" summary; modal stays open | ✅ As expected |
| M4 | Age validation | Enter 10, 90, 20.5 | "Age must be between 16 and 80" / "whole number" | ✅ As expected |
| M5 | Email validation | Enter `thabo@`, `thabo.com` | "Please enter a valid email address" | ✅ As expected |
| M6 | Duplicate email | Use an existing student's email | "Another student already uses this email address" | ✅ As expected |
| M7 | Name validation | Enter only one name / a name with digits | Matching error message | ✅ As expected |
| M8 | Cancel add | Type values → Cancel / Esc / × / click outside | Modal closes, nothing saved | ✅ As expected |
| M9 | Edit | Edit → change course & status → Save changes | Row updates instantly, ID unchanged | ✅ As expected |
| M10 | Cancel edit | Edit → change name → Cancel | Original name still shown | ✅ As expected |
| M11 | Delete confirm | Delete → Delete student | Row removed, stats update, red message | ✅ As expected |
| M12 | Delete cancel | Delete → Cancel | Record still present | ✅ As expected |
| M13 | Empty state | Delete all students | "No students yet" with Add student button | ✅ As expected |
| M14 | No search results | Search "zzz" | "No matching students" with Clear filters button | ✅ As expected |
| M15 | Persistence | Add a student → refresh page | Student is still there | ✅ As expected |
| M16 | Reset | Click Reset sample data | Original 5 students restored | ✅ As expected |
| M17 | Keyboard | Tab through the page and modals; Esc closes modal | Visible focus outline; focus stays inside open modal | ✅ As expected |
| M18 | Mobile layout | Resize to 390px wide | Rows show as cards with labels; buttons full width; no sideways scrolling | ✅ As expected |
| M19 | Console | Open browser dev tools during all tests | No errors in the console | ✅ As expected |

> **Tip:** add your own screenshots of these tests (for example in a `screenshots/` folder) as extra evidence for your submission.
