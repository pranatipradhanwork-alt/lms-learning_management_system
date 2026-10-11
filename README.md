# LMS: an online course marketplace

A full-stack learning management system where instructors create and sell video courses and students
enroll, watch lessons and track their progress. My MCA final-year project (2022), built with Next.js,
Express and MongoDB, with Stripe for payments and AWS for media and email.

## Features

**Students**
- Register, log in and reset a forgotten password with a 6-character code sent by email (AWS SES)
- Browse published courses; watch free-preview lessons before buying
- Enroll in free courses, or pay for a course through Stripe Checkout
- Watch video lessons with Markdown notes, and mark lessons complete or incomplete to track progress

**Instructors**
- Become an instructor by connecting a Stripe account (Stripe Connect onboarding)
- Create a course with a cover image, description, price and category; save as draft, then publish or unpublish
- Add, edit, drag-and-drop reorder and remove lessons; upload lesson videos (up to 700 MB) to AWS S3; mark lessons as free preview
- See the student count per course, the Stripe balance and payout settings

**Platform**
- Each paid enrollment is split automatically: the platform keeps a fee and Stripe transfers the rest to the instructor
- Roles: Subscriber (student) and Instructor, checked by server middleware on protected routes

## Architecture

```
Next.js frontend (pages/, component/)          Express API (server/)
  React 17, Ant Design, Bootstrap   ── /api ──►   routes → controllers → Mongoose models
  custom dev server proxies /api                  auth: bcrypt + JWT in an httpOnly cookie, CSRF tokens
  to the API on port 8000                         ├─ MongoDB: users, courses with lessons, completed lessons
                                                  ├─ AWS S3: course images and lesson videos
                                                  ├─ AWS SES: password-reset emails
                                                  └─ Stripe: Checkout, Connect accounts, balance, payouts
```

| Model | Main fields |
|---|---|
| `User` | name, email, hashed password, roles, Stripe account, enrolled courses, password-reset code |
| `Course` | name, slug, description, price, image, category, published, paid, instructor, lessons (title, content, video, free preview) |
| `Completed` | user, course, completed lesson IDs |

## Security

- Passwords hashed with bcrypt (12 salt rounds); never stored or returned in plain text
- JWT session token (7 days) in an `httpOnly` cookie, so page scripts can't read it
- CSRF protection on state-changing requests
- Middleware checks sign-in, instructor role and enrollment before protected routes; a student can only open the lessons of a course they're enrolled in

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 12, React 17, Ant Design, Bootstrap, Sass, react-player, react-markdown, react-toastify |
| Backend | Node.js, Express, Mongoose, express-jwt, bcrypt, csurf, formidable |
| Database | MongoDB |
| Services | Stripe (Checkout, Connect), AWS S3, AWS SES |
| Hosting | Firebase Hosting config for the static frontend |

## Run locally

Requires Node.js, a MongoDB database, a Stripe test account and AWS credentials with S3 and SES access.

```bash
# API
cd server
npm install
npm start                 # http://localhost:8000

# Frontend (in another terminal, from the repo root)
npm install
npm run dev               # http://localhost:3000, forwards /api to the API
```

Create `server/.env` (never commit it):

| Variable | Purpose |
|---|---|
| `DATABASE` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing session tokens |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY_ID`, `AWS_REGION`, `AWS_API_VERSION` | S3 uploads and SES email |
| `EMAIL_FROM` | Sender address for password-reset emails (verified in SES) |
| `STRIPE_SECRET` | Stripe secret key (use a test key) |
| `STRIPE_REDIRECT_URL`, `STRIPE_SETTING_REDIRECT`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` | Where Stripe returns the user after onboarding and checkout |

The frontend reads `NEXT_PUBLIC_STRIPE_KEY` (Stripe publishable key) from its own `.env.local`.

## What I'd improve today

- Move to current Next.js and React versions and add automated tests
- Add course reviews and ratings, quizzes and completion certificates
- Confirm payments with Stripe webhooks too (today the success page checks the Checkout session, which misses users who close the tab)
- Make the search bar filter courses
- Add a deployed demo with test-mode payments and screenshots in this README

## Author

Pranati Pradhan · [GitHub](https://github.com/pranatipradhanwork-alt) · [LinkedIn](https://www.linkedin.com/in/pranati-pradhan-7766b31a7)
