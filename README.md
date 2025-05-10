# FullstackProject

FoodLovers is a website forum for sharing recipes between food lovers, and allows them to scroll through for tasty inspiration

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
