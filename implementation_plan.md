# Doctor Appointment System

This project is a full-stack (MERN) application designed to solve the challenges of booking doctor appointments by providing a digital platform for Patients, Doctors, and Administrators.

## User Review Required

> [!IMPORTANT]
> Please review this implementation plan before we start coding. Are there any specific libraries or preferences you have beyond what is proposed here? For the database, we will need a MongoDB URI to connect to. Do you have a MongoDB Atlas cluster ready, or should we use a local MongoDB instance for development? Same for Cloudinary API keys if we implement profile pictures right away.

## Proposed Technologies

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Token (JWT) for authentication
- bcryptjs for password hashing
- cloudinary & multer for image uploads (Optional/Future for profile pics)
- CORS & dotenv

**Frontend:**
- React.js (Bootstrapped with Vite for speed)
- Tailwind CSS for styling
- React Router DOM for routing
- Axios for API requests
- React Context API for global state management (Auth state, User profiles)

## Database Schema (MongoDB/Mongoose)

### 1. User Model
Stores all users including admins and patients.
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `role` (String, enum: `['patient', 'admin']`, default: `'patient'`)
- *Additional info*: phone, address, gender, dob, image.

### 2. Doctor Model
Stores doctor profiles.
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `specialization` (String, required)
- `experience` (String, required)
- `fees` (Number, required)
- `about` (String)
- `available` (Boolean, default: true)
- `slots_booked` (Object, stores dates and booked times)
- `image` (String)

### 3. Appointment Model
Stores appointment details between a User and a Doctor.
- `userId` (ObjectId, ref: 'User')
- `doctorId` (ObjectId, ref: 'Doctor')
- `slotDate` (String)
- `slotTime` (String)
- `userData` (Object - snapshot of user details)
- `doctorData` (Object - snapshot of doctor details)
- `amount` (Number)
- `status` (String, enum: `['Pending', 'Completed', 'Cancelled']`, default: `'Pending'`)

## API Endpoints (Backend)

### Auth/User Routes
- `POST /api/user/register` - Register a patient
- `POST /api/user/login` - Login patient
- `GET /api/user/profile` - Get user profile
- `POST /api/user/book-appointment` - Book an appointment
- `GET /api/user/appointments` - Get user's appointments
- `POST /api/user/cancel-appointment` - Cancel an appointment

### Doctor Routes
- `POST /api/doctor/login` - Login for doctors
- `GET /api/doctor/appointments` - Get specific doctor's appointments
- `POST /api/doctor/complete-appointment` - Mark appointment completed
- `POST /api/doctor/cancel-appointment` - Cancel appointment
- `GET /api/doctor/dashboard` - Get doctor dashboard data

### Admin Routes
- `POST /api/admin/login` - Login admin
- `POST /api/admin/add-doctor` - Add a new doctor
- `GET /api/admin/all-doctors` - Get all doctors
- `POST /api/admin/change-availability` - Change a doctor's availability
- `GET /api/admin/appointments` - Get all appointments
- `POST /api/admin/cancel-appointment` - Cancel any appointment
- `GET /api/admin/dashboard` - Get admin dashboard analytics

## Proposed Implementation Steps

### Phase 1: Backend Setup & API Development
1. Initialize Node.js backend (`npm init`)
2. Set up Express server & connect to MongoDB
3. Define Mongoose models (User, Doctor, Appointment)
4. Create Authentication controllers (Register, Login with JWT)
5. Create Admin, Doctor, and User controllers & routes
6. Add middleware for Authentication (Auth guards)

### Phase 2: React Frontend Setup
1. Initialize Vite React app (`frontend`)
2. Configure Tailwind CSS
3. Set up React Router for pages (Home, Login, Appointments, Doctors, Admin Panel)
4. Create general layout components (Navbar, Footer, Sidebar for external dashboards)

### Phase 3: Frontend Integration - Patient Flow
1. Build Authentication Pages (Login/Sign Up)
2. Build Home Page & Doctor Listing Page
3. Build Doctor Details & Appointment Booking Page
4. Build User Profile & My Appointments Page
5. Connect with Backend APIs via Axios

### Phase 4: Frontend Integration - Admin/Doctor Panels
1. Build Admin Dashboard (Add doctor, manage doctors, view all appointments)
2. Build Doctor Dashboard (View appointments, mark complete/cancelled)

## Open Questions

> [!WARNING]
> - Do you want both the frontend and backend inside this workspace folder (`e:\IP3`), like `e:\IP3\frontend` and `e:\IP3\backend`?
> - For authentication, can we stick to JWT stored in `localStorage` for simplicity on the frontend, or do you prefer HTTP-only cookies?
> - Do you have the MongoDB URI ready to provide in the `.env` file, or should I create a mock setup first?

## Verification Plan

### Automated/Manual Tests
- Ensure backend starts on port `4000`.
- Use thunder client or similar tool/frontend to test registration, login, doctor creation, and appointment booking flow.
- Verify frontend runs on Vite's default dev port (`5173`) and connects successfully to the backend without CORS issues.
- Create an admin, a doctor, and a patient user and run through the complete workflow: Patient searches doctor -> books slot -> Doctor sees it -> Admin sees it.
