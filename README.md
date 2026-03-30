# 🏥 CarePoint - Doctor Appointment System

**[Live Demo: carepoint-frontend.onrender.com](https://carepoint-frontend.onrender.com)**

CarePoint is a comprehensive, full-stack **MERN** (MongoDB, Express, React, Node.js) application designed to streamline the medical appointment booking process. It features a seamless user experience for patients, a robust management interface for admins, and a dedicated profile dashboard for doctors.

---

## ✨ Key Features

### For Patients 👤
- **Account Management**: Secure sign-up and login with JWT authentication.
- **Doctor Discovery**: Browse a diverse list of professional doctors categorized by speciality.
- **Smart Booking**: Interactive slot selection for effortless appointment scheduling.
- **Patient Profile**: Manage personal details, contact information, and viewing upcoming appointments.

### For Doctors 🩺
- **Personal Dashboard**: A secure login portal to manage professional information.
- **Profile Customization**: Update your display name, professional bio, and appointment fees in real-time.
- **Availability Toggle**: Switch your status to 'Available' or 'Unavailable' to manage your patient flow.

### For Admins ⚙️
- **Doctor Management**: Add new doctors with high-quality profile pictures from a curated local asset gallery.
- **Centralized Control**: Full oversight of the entire medical network and its appointments.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Vite, Axios, React Router, React Toastify |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Styling** | Vanilla CSS, Tailwind CSS |
| **Assets** | Local Asset-based matching system |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account for the database

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/your-username/carepoint.git
cd carepoint
```

Install dependencies for both projects:
```bash
# In the root folder
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the **`/backend`** directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
ADMIN_EMAIL=admin@carepoint.com
ADMIN_PASSWORD=admin123
```

### 4. Running the Project
Launch both the frontend and backend simultaneously:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 📡 Deployment
The project is optimized for deployment on **Render**. For detailed instructions, please refer to our **[README_DEPLOY.md](./README_DEPLOY.md)**.

---

## 🤝 Contributing
Contributions are welcome! If you have a suggestion that would make this app better, please fork the repo and create a pull request.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

*CarePoint - Connecting patients with professional healthcare providers.*
