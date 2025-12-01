# TaskApp – Advanced Application Development Project

This project is created as part of the **Advanced Application Development** course.  
The goal of the application is to implement a modern, theme-aware, authenticated task management app using **React Native**, **Expo**, and **Appwrite** while fulfilling all course evaluation requirements.

---

## 📌 Project Overview
TaskApp allows users to:

- Create an account and log in securely
- Add, view, complete, and delete tasks
- View detailed information about a task
- Switch between light and dark mode
- Upload a profile photo using the camera or image picker
- Navigate smoothly between screens using bottom tab navigation
- Enjoy a clean, modern, responsive UI

The application is built fully with **React Native + Expo**, and backend services are handled using **Appwrite**.

---

## 🗂 Main Features (Course Requirement List)
These features were submitted to and approved by the instructor before implementation:

1. User authentication (signup, login, logout)
2. Protected routes – authenticated users only
3. Create new tasks (title, date, priority)
4. View all tasks in a FlatList
5. View task details (route parameters)
6. Mark tasks as completed
7. Delete tasks
8. Dark and light themes (ThemeContext)
9. Centralized global styles
10. User profile screen
11. Ability to upload a profile image
12. Camera / ImagePicker integration
13. Bottom tab navigation (Home, Add Task, Profile)
14. Appwrite backend database (tasks + completions)
15. Modern UI design (cards, shadows, spacing)
16. Adaptive layout (SafeArea, Platform.OS differences)

(Contains more than 10 main requirements as requested.)

---

## 🛠 Technologies Used

### **Frontend**
- React Native
- Expo
- React Navigation
- React Native Paper
- Context API (AuthContext + ThemeContext)

### **Backend**
- Appwrite Cloud (Authentication, Database)

### **Native Features**
- Expo ImagePicker (camera & gallery)
- Gesture Handler

---

## 📱 Screens in the App

### **Authentication Screens**
- Login
- Register

### **Main App Screens**
- Home (task list)
- Add Task
- Profile
- Task Details (with route params)

---

## 🧩 Architecture Overview
The project follows a clear separation of concerns:

/src
/screens → All screen components
/components → Reusable UI components (TaskItem, etc.)
/contexts → App-wide state (AuthContext, ThemeContext)
/navigation → Stack + Tab navigation structure
/styles → Centralized styles and theme tokens
appwrite.ts → Backend configuration


## 🔐 Authentication Flow
The app uses **Appwrite** for secure login, signup, and logout.  
AuthContext tracks the user's session and ensures:

- Logged-in users see the main app
- Logged-out users see Login/Register
- Navigation is fully protected

---

## 🌗 Themes
TaskApp supports **light and dark themes**, including:

- Dynamic background & text colors  
- Themed cards  
- Themed inputs  
- Themed tab bar  
- User-controlled theme switch

---

## 📸 Camera & Image Upload
The user can upload a profile picture using:

- Device camera  
- Device gallery  

Built using **Expo ImagePicker**.

---

## 📅 Tasks & Database
Tasks are stored in Appwrite with fields:

- `title`
- `dueDate`
- `priority`
- `userId`

Users can:

- Add tasks  
- View today's tasks  
- Open task details  
- Mark tasks as completed  
- Delete tasks  

Everything is synced to the cloud.


---

 🚀 Running the Project

1. Install dependencies:

npm install

2. Start The Project

npx expo start


