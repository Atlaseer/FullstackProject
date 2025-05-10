# FullstackProject

FoodLovers is a website forum for sharing recipes between food lovers, and allows them to scroll through for tasty inspiration

## System Architecture
This project uses the following technologies:

1. **client:**
- React (created with Vite or Create React App)
- Vite as a build tool
- CSS native style for styling

2. **server:**
- Node.js + Express.js (RESTful API server)
- concurrently & nodemon for development workflow
- JWT authentication

3. **Database:**
- MongoDB (using Mongoose ODM)

## Project Directory Structure
```
FullstackProject/
├──	client/
│	├── public/ # Static resource directory
		└──
│	├── src/ # Source code directory
│	│ 	├── assets/ # Images, icons and other resources
│	│ 	│ 	└── react.svg
│	│ 	├── components/ # Reusable components
│	│ 	│ 	├── CreatePostForm.jsx
│	│ 	│ 	├── Footer.jsx
│	│ 	│ 	├── Header.jsx
│	│ 	│ 	├── Navbar.jsx
│	│ 	│ 	├── PostCard.jsx
│	│ 	│ 	├── PostList.jsx
│	│ 	│ 	├── Sidebar.jsx
│	│ 	│ 	├── StarRating.jsx
│	│ 	│ 	└── ThemeToggle.jsx
│	│ 	├── contexts/ # React context
│	│ 	│ 	└── AuthContext.jsx
│	│ 	├── pages/ # Page components
│	│ 	│ 	├── AdminPage.jsx
│	│ 	│ 	├── CreatePagePost.jsx
│	│ 	│ 	├── FourOFour.jsx
│	│ 	│ 	├── HomePage.jsx
│	│ 	│ 	├── LoadingPage.jsx
│	│ 	│ 	├── LoginPage.jsx
│	│ 	│ 	├── Profile.jsx
│	│ 	│ 	└── ViewPostPage.jsx
│	│ 	├── routes/ # Routing configuration
│	│ 	│ 	└── PrivateRoute.jsx
│	│ 	├── styles/ # CSS styles
│	│ 	│ 	├── Header.css
│	│ 	│ 	├── Loading.css
│	│ 	│ 	├── Main.css
│	│ 	│ 	└── Profile.css
│	│ 	├── utils/ # Utility functions
│	│ 	│ 	└── theme.js
│	│ 	├── App.css # Application style file
│	│ 	├── App.jsx # Application entry component
│	│ 	├── index.jsx # Application entry file
│	│ 	└── main.css # Main style file
│	├── .gitignore
│	├── eslint.config.js
│	├── index.html
│	├── package.json
│	├── package-lock.json
│	└── vite.config.js
├── mainContent/
│	├── login/
│	│ 	├── mainLoginLogic.css
│	│ 	├── mainLoginLogic.js
│	│ 	└── register.html
│	├── main.css
│	├── main.html
│	└── main.js
├──	server/
│	├── models/ # Data model
│	│ ├── Post.js # Posr model	
│	│ └── User.js # User model
│	├── routes/ # Routes
│	│ ├── auth.js # Authentication routes
│	│ ├── posts.js # Posts routes
│	│ └── users.js # User routes
│	├── .gitignore
│	├── index.js.js # Server entry file
│	├── package.json
│	├── package-lock.json
│	└── seed.js
├── .gitignore
├── generateJWT_SecretONCE.mjs
├── package.json
└── package-lock.json
```

## Installation Steps
**Prerequisites**
- Node.js
- Git
- A MongoDB Atlas account with a cluster (no local MongoDB needed)

**Installation and Startup**
- Clone the project
```bash
git clone https://github.com/Atlaseer/FullstackProject.git
cd FullstackProject
```

**Install dependencies**
```bash
cd sever && npm install
cd client && npm install
cd ..
npm install
```

**Configure environment variables**
Create a .env in the backend directory with:
```bash
PORT=3000
MONGO_URI=<your MongoDB Atlas connection string>
```
**Start the application**

From the project root:
```bash
npm run dev
```
- This runs server (on port 3000) and client (on port 5137) concurrently.

**Access the application**

Open your browser at http://localhost:5137.
