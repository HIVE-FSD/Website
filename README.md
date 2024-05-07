# HIVE - A community driven discussions platform

HIVE is a web application designed to create an interactive community platform similar to Reddit, focusing on creating and sharing posts called "buzzes" within specific communities known as "buzzspaces". Buzzspaces are categorized for organization.

## Getting Started

To get started with HIVE, make sure you have Node.js installed on your computer. You can download and install Node.js from [here](https://nodejs.org/).

### Installation

To install dependencies and start the application, follow these steps:

1. Clone the repository: `git clone https://github.com/HIVE-FSD/Website.git`
2. Navigate to the project directory: `cd HIVE`
3. Install dependencies: `npm install`
4. Start the application: `npm start`
   - For development: `npm run dev`

### Environment Variables

Make sure you have a `.env` file with the following variables:

- `PORT`: Port number for the server
- `SITE`: Base URL of the website (e.g., "http://localhost" for local machine)
- `SESSIONSECRET`: Secret key for session management
- `MONGOURI`: MongoDB connection URI
- `VERIFIERMAIL`: Email address for verification (optional)
- `VERIFIERMAILPASS`: App password for the verification email (optional)

If you want to disable email verification, follow the instructions provided in the project.

### Directory Structure

The project follows a classic MVC (Model-View-Controller) folder structure:

- **/controllers**: Controller files handling logic
- **/middleware**: Middleware files
  - `/Middleware/mainware.js`: CheckAuth middleware verifying user authentication status
- **/models**: Mongoose model files
- **/public**:
  - **/assets**: Images directory
  - **/css**: CSS files
  - **/js**: JavaScript files
  - **/uploads**: Directory for buzzspace logos and cover images
- **/routes**: Route files handling HTTP requests
  - `/routes/authRoutes.js`: Routes related to authentication
- **/views**: EJS pages
  - **/components**: Partial components
    - `/views/components/avatar.ejs`: Component for selecting avatars
  - **/layouts**: Layout templates (authLayout, mainLayout)

### Avatar Selection

Avatars can be used by including the `avatar.ejs` component and passing an index.

Example:
```ejs
<%- include('components/avatar', { ind: 1 }) %>
```