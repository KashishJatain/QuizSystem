# QuizSystem

## Overview
A comprehensive quiz application built with MERN stack (MongoDB, Express.js, React.js, Node.js) that enables quiz management, student assessment, and educational features. 
The application supports two user roles: Admin and Student.
## System Requirements
### Frontend Dependencies
{
  "@chakra-ui/icons": "^2.2.4",
    "@chakra-ui/menu": "^2.2.1",
    "@chakra-ui/modal": "^2.3.1",
    "@chakra-ui/react": "^2.10.4",
    "@chakra-ui/toast": "^7.0.2",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "axios": "^1.7.9",
    "framer-motion": "^9.1.7",
    "hamburger-react": "^2.5.2",
    "lucide-react": "^0.471.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-quilljs": "^1.3.4",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.28.1",
    "recharts": "^2.15.0",
    "redux": "^4.2.1",
    "redux-thunk": "^2.4.2"
}
### Backend Dependencies
{
  "bcrypt": "^5.1.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.9.3"
}

## Setup and Installation
### Backend Setup
1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Create `.env` file with following variables:
   PORT=4000
   MONGODB_URI=<your_mongodb_uri>
   SECRET_KEY=<your_jwt_secret>
   EMAIL_USER=<admin_email>
   EMAIL_PASS=<mail_passkey>
4. Start the server: `node index.js` (index.js is the server file name)
5. Backend runs on: `http://localhost:4000`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`
4. Frontend runs on: `http://localhost:5173`

### Admin Features
## Quiz Management
- Create new quizzes with multiple-choice questions and integer type questions
-Add image if required
- Edit existing questions
- Delete questions
- Set difficulty levels (easy, medium, hard)
- Categorize questions by section(physics, chemistry, maths)
- Each quiz is now set to take 75 questions in total, in each section 20 mcq and 5 numericals
- For each new 75 questions added as per the equirement a new set is created and appear on the DashBoard

##User Management
- Add new admin users. 
- Only admins can add new admins.
- View all users and delete option also available

## Notice Board
- Post notices related to upcoming tests or corrections
- View all notices and delete notice

## Messaging System
- Send personalized messages to individual students

##User’s Test History
-Get test history of any user that included all the tests given and answers choosen by the user

### Student Features
## Quiz Taking
- Attempt quizzes based on difficulty level
- Navigate through sections, types and question number
- Color-coded question numbers
- View immediate results
- Review answers post-submission
- Timer available

## Bookmarks
- Save important questions
- Quick access to saved questions
- Delete bookmarks

## Notice Board
- View announcements
- Get real-time updates

## Messages
- Receive personalized messages from admin
- Mark messages as read and delete

## Test History
- Review attempted quizzes and their answers
- See correct and wrong answers 

## Security Features
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes using middleware
- Cookie-based session management
- CORS configuration for secure communication

## Error Handling
- Proper error messages for API failures
- Client-side validation
- Server-side validation
- Error logging system

## State Management
- Redux for global state management
- Redux Thunk for asynchronous actions
- Local state for component-specific data

## UI/UX Features
- Responsive design using Chakra UI
- Interactive components with Framer Motion
- Toast notifications for user feedback
- Error handling displays

## Performance Optimization
- Pagination for large data sets
- Efficient data fetching
- Optimized database queries
- Proper indexing in MongoDB

## Troubleshooting
1. If backend connection fails:
   - Check if MongoDB is running
   - Verify correct PORT (4000)
   - Check environment variables

2. If frontend connection fails:
   - Verify backend is running
   - Check CORS configuration
   - Verify correct PORT (5173)

