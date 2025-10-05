# Orphan Management System

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing orphanages, adoptions, and donations.

## Features

### User Features
- **Authentication**: Register and login with JWT-based authentication
- **Browse Children**: View profiles of children available for adoption
- **Adoption Requests**: Apply for adoption with document uploads
- **Donations**: Make monetary or item donations to the orphanage
- **Profile Management**: Update personal information and documents

### Admin Features
- **Child Management**: Add, update, and manage child profiles
- **Adoption Management**: Review and approve/reject adoption requests
- **Donation Management**: Monitor and manage all donations
- **User Management**: View and manage user accounts
- **Document Verification**: Review uploaded documents and certificates

## Tech Stack

- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary integration
- **Styling**: CSS3 with responsive design

## Project Structure

\`\`\`
orphan-management-system/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your configuration:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/orphan_management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
\`\`\`

5. Start the backend server:
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file (optional):
\`\`\`bash
# Create .env file in frontend directory
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

4. Start the frontend development server:
\`\`\`bash
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Database Models

### User Model
- Personal information (name, email, phone, address)
- Authentication (password, role)
- Document uploads
- Verification status

### Child Model
- Basic information (name, age, gender)
- Health and education details
- Photos and documents
- Adoption status

### Adoption Request Model
- User and child references
- Status tracking
- Document uploads
- Admin review notes

### Donation Model
- Donor information
- Donation type (money/item)
- Amount/value tracking
- Status and approval workflow

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Children
- `GET /api/children` - Get all children
- `POST /api/children` - Add new child (Admin)
- `PUT /api/children/:id` - Update child (Admin)
- `DELETE /api/children/:id` - Delete child (Admin)

### Adoptions
- `GET /api/adoptions` - Get adoption requests
- `POST /api/adoptions` - Create adoption request
- `PUT /api/adoptions/:id` - Update adoption status (Admin)

### Donations
- `GET /api/donations` - Get donations
- `POST /api/donations` - Create donation
- `PUT /api/donations/:id` - Update donation status (Admin)

## Default Admin Account

After setting up the database, you can create an admin account by registering with:
- Email: admin@orphanage.com
- Password: admin123
- Role: admin (set manually in database)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
