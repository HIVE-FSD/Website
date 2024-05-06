# HIVE - A community driven discussions platform

HIVE is a web application designed to create an interactive community platform similar to Reddit, focusing on creating and sharing posts called "buzzes" within specific communities known as "buzzspaces". Buzzspaces are categorized for organization.

## Getting Started

To get started with HIVE, make sure you have Node.js installed on your computer. You can download and install Node.js from [here](https://nodejs.org/).

### Installation

To install dependencies and start the application, follow these steps:

1. Clone the repository: `git clone https://github.com/your/repository.git`
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

- **/public/assets**: Images directory
- **/public/css**: CSS files
- **/public/js**: JavaScript files
- **/public/uploads**: Directory for buzzspace logos and cover images

### Roles and Permissions

Within a buzzspace, users have different roles:

- **Creator**: The creator of the buzzspace with full control
- **Moderator**: Appointed by the creator to moderate buzzes and members
- **Member**: Regular member of the buzzspace

### Middleware

CheckAuth middleware in `/Middleware/mainware.js` verifies user authentication status.

### Creating a Buzz

To create a buzz, you must first join a buzzspace. Then, you can create buzzes within the buzzspace.

### EJS Pages and Layouts

- **/views**: EJS pages
- **/views/components**: Partial components
- **/views/layouts**: Layout templates (authLayout, mainLayout)

### Avatar Selection

Users can select avatars by including the `avatar.ejs` component and passing the index.

Example:
```ejs
<%- include('components/avatar', { ind: 1 }) %>
```
