/**
 * Sample student records shown the first time the app loads
 * (before anything has been saved to localStorage).
 *
 * Each record is an OBJECT (non-primitive) containing:
 *   id         -> string  (e.g. "STU001"; text, never used for arithmetic)
 *   fullName   -> string
 *   age        -> number  (so it can be compared and averaged)
 *   email      -> string
 *   course     -> string  (one of the values in the COURSES array)
 *   isEnrolled -> boolean (enrollment status is a yes/no value)
 *
 * The records are stored together in an ARRAY (non-primitive).
 * `const` is used because this variable is never reassigned.
 */
const INITIAL_STUDENTS = [
  {
    id: 'STU202610',
    fullName: 'Thato Motlakase',
    age: 21,
    email: 'thabo.mokoena@gmail.com',
    course: 'Diploma in Information Technology',
    isEnrolled: true,
  },
  {
    id: 'STU202611',
    fullName: 'Lerato Molapo',
    age: 19,
    email: 'lerato.molapo@gmail.com',
    course: 'Diploma in Business Information Technology',
    isEnrolled: true,
  },
  {
    id: 'STU202612',
    fullName: 'Tumelo Ramakatsa',
    age: 24,
    email: 'tumelo.ramakatsa@gmail.com',
    course: 'Diploma in Software Engineering',
    isEnrolled: false,
  },
  {
    id: 'STU202613',
    fullName: 'Palesa Nthunya',
    age: 20,
    email: 'palesa.nthunya@gmail.com',
    course: 'Diploma in Information Technology',
    isEnrolled: true,
  },
  {
    id: 'STU202614',
    fullName: 'Mpho Letsie',
    age: 22,
    email: 'mpho.letsie@gmail.com',
    course: 'Diploma in Multimedia and Web Design',
    isEnrolled: false,
  },
];

export default INITIAL_STUDENTS;
