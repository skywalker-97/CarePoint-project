# 🚀 Deploying CarePoint to Render

Follow these steps to deploy your Doctor Appointment System smoothly on Render.

## 1. Backend Deployment (Web Service) 🛠️

1.  **Create New**: Web Service
2.  **Repo**: Connect your GitHub repository.
3.  **Name**: `carepoint-backend`
4.  **Root Directory**: `backend` (Important!)
5.  **Environment**: `Node`
6.  **Build Command**: `npm install`
7.  **Start Command**: `npm start`
8.  **Environment Variables**:
    *   `MONGODB_URI`: *Your MongoDB Connection String*
    *   `JWT_SECRET`: *A random strong secret*
    *   `ADMIN_EMAIL`: `admin@carepoint.com`
    *   `ADMIN_PASSWORD`: `admin123` (Change this!)
    *   `FRONTEND_URL`: *The URL of your Frontend Static Site (Step 2)*

---

## 2. Frontend Deployment (Static Site) 🎨

1.  **Create New**: Static Site
2.  **Repo**: Connect the same GitHub repository.
3.  **Name**: `carepoint-frontend`
4.  **Root Directory**: `frontend` (Important!)
5.  **Build Command**: `npm run build`
6.  **Publish Directory**: `dist`
7.  **Environment Variables**:
    *   `VITE_BACKEND_URL`: *The URL of your Backend Web Service (from Step 1)*

---

## 💡 Important Notes

- **CORS**: The backend is configured to allow requests from your Render frontend automatically if you set the `FRONTEND_URL` variable.
- **Port**: Render handles the port automatically; you don't need to set a `PORT` variable.
- **Node Version**: If you encounter errors, ensure both services use the same Node version (e.g., set `NODE_VERSION` to `20` in environment variables).
