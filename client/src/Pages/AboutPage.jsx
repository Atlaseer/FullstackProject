import React from 'react';
import '../styles/Main.css';

const AboutPage = () => {
    return(
        <div className="homepage-container">
      <main className="homepage-main">
        <div className="post-list">
          <div className="not-found-card">
            <h1>About FoodLover</h1>
            <p>Welcome to FoodLover!</p>
            <p>We who work here are:</p>
            <p>Richard - Lead frontend <br/> Created the main file structure of the frontend, Richard has also worked on the routes making sure they connect.<br/> Richard also made all pages for the frontend but three of them, and they made their respective components. <br/> Richard also worked some part with deployment of the website and the backend to add features that needed for it to work.</p>
            <p>Simon Edman Persson - Lead backend - Created file structure and github repo, created mongoDB database and managed database access, created User, Comment and Post model, created user, comment and post route, as well as index.js, created tests to check backend coverage, created scripts to run the client and server simultaneously, as well as a script for tests, uploaded the project to Render, and wrote the report.</p>
            <p>Emil Kerker - Frontend - I also worked on the frontend and created the pages for the categories, like the "General" page, "Announcements" page, "Support" page and "Off Topic" page. I didn't do the styling for these but I added all the information and text for those pages. This "About" page I also created.<br/></p>
            <p>Ningxia Li - Fullstack - Created the function to add and display images in post page. Added intial info to readme file, like Installation instruction, Project directory structure and System architecture. Checked and verified API calls with Postman and made minor changes to fix the API calls.<br/></p>
            <p>Oliver Brantin - Frontend ideas, admin confirmation logic used in admin page, live testing, powerpoint presentation<br/></p>
            <p>Emil Jansson - Fullstack<br/> Created the profile page for the users, also most of the styling there. Made route for getting all the posts from the profile's user which then links back to the users posts.<br/>Created the logo together with Richard. Also restructured the files which exceeded 300 lines.<br/>Aswell as playing a part in debugging the deployment problem in the end together with Simon and Richard.</p>
          </div>
        </div>
      </main>
    </div>
    )
}

export default AboutPage
