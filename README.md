The user interface is built with a curated set of modern technologies to ensure a fast, maintainable, and visually appealing experience.

Framework: Next.js (v14+)

UI Library: React (v18+) with TypeScript

Styling: Tailwind CSS for utility-first CSS styling.

Animations: Framer Motion for smooth page transitions and interactive element animations.

Authentication Handling:

js-cookie: To manage JWTs stored in browser cookies.

jwt-decode: To decode JWTs on the client-side and access user roles and data.

Font: Geist (via next/font).

# Setup and Running the Project
To get the frontend running locally, follow these steps.

1. Navigate to the Frontend Directory
From the project root, move into the frontend folder.

cd frontend

2. Install Dependencies
Install all the required npm packages.


npm install
3. Configure Environment Variables
The frontend needs to know the address of your backend API.



# Copy the example environment file
cp .env.local.example .env.local
Now, open the newly created .env.local file and set the NEXT_PUBLIC_API_URL to point to your running backend server.

NEXT_PUBLIC_API_URL="http://localhost:5001/api"
4. Run the Development Server
Start the Next.js development server.



npm run dev
Open http://localhost:3000 with your browser to see the result. The page will auto-update as you edit the files.

# Project Structure & Pages

The application is structured logically using the Next.js App Router. Here are the main pages included:

app/page.tsx (/): The Homepage. Displays a grid of all upcoming events for public viewing.

app/events/[id]/page.tsx (/events/:id): The Event Detail Page. Shows comprehensive details for a single event. The action buttons (Register, Edit, Delete) on this page are dynamically rendered based on the user's role and authentication status.

app/dashboard/page.tsx (/dashboard): A protected Dashboard.

For USER roles, it shows a list of events they are registered for.

For ADMIN roles, it displays statistics and a list of events they have created.

app/events/create/page.tsx (/events/create): An Admin-only page with a form to create new events.

app/events/edit/[id]/page.tsx (/events/edit/:id): An Admin-only page to edit an existing event.

app/login/page.tsx (/login): The user login page.

app/register/page.tsx (/register): The user registration page.

User Roles & Application Flow
The application supports three distinct levels of access, providing a tailored experience for each.

1.  Guest (Unauthenticated)
Flow: A guest lands on the Homepage and can browse all events. They can click on any event to view its Details Page. If they attempt to register, they are redirected to the Login Page, encouraging them to sign up.

2.  User (Authenticated)
Flow: A user logs in via the Login Page. They can browse and view events like a guest. On an Event Detail Page, they will see a "Register" button. After registering, the button will change to "✓ Registered". The user can navigate to their Dashboard to see a curated list of all events they have successfully registered for.

3.  Admin (Authenticated)
Flow: An admin logs in and has access to all user features. The navigation bar will show a dynamic logo ("EventManager Admin") and a "Create Event" link. Their Dashboard is an advanced control panel showing statistics and a list of events they've created. From the dashboard or an event's detail page, they can choose to Edit or Delete events they own. On the detail page of an event they created, they can also view a list of all registered attendees.
