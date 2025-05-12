 import multer from 'multer';
 import path from 'path';
 import fs from 'fs';

 // Make sure the upload directory exists
const uploadDir = './uploads';
 if (!fs.existsSync(uploadDir)) {
 fs.mkdirSync(uploadDir, { recursive: true });
 }

 // Configuration Storage
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
 cb(null, uploadDir);
 },
  // Create a unique file name to prevent naming conflicts
 filename: (req, file, cb) => {
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
 const ext = path.extname(file.originalname);
 cb(null, 'cover-' + uniqueSuffix + ext);
 }
});

 // File filter, only allow image files
const fileFilter = (req, file, cb) => {
 const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 
'image/gif'];
 if (allowedFileTypes.includes(file.mimetype)) {
 cb(null, true);
 } else {
 cb(new Error('Unsupported file type! Only jpeg, jpg, png and gif formats are allowed'), false);
 }
 };

 // Create a multer instance
export const upload = multer({
 storage: storage,
 limits: {
 fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
 },
fileFilter: fileFilter
 });
 export default upload;
 