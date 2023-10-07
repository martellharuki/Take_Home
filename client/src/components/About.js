import './About.css'
const About = () => {
    return (
        <div className="about_main">
            <div className="container_about">
            <div className="headline_about">
                    <p>About Quahoot</p>
                </div>
                <div className="about_text">
                    <p>Quahoot is a fun way to compare scores and times of tests with friends. Make a 
                        Quahoot trivia, select the correct answer, share your ID, and have a blast! After creating a trivia, 
                        users will get a unique ID number. By sharing that number, Quahoot users can have others try their trivia.
                        Responses will be graded on speed and accuracy, and results will be displayed on a leader board. Have fun on Quahoot!
                    </p>
                </div>
            </div>
            <div className="container_about">
                <div className="headline_about">
                    <p>About Me</p>
                </div>
                <div className="about_text">
                    <p>I am a UC Davis 2nd year Computer Science and Engineering major. I have been programming for 3-4 years and
                        am passionate from everything from physics engines, graphics, simulations, webdev, and server management.
                        I often spend free time making small projects to hone my skills.
                    </p>
                </div>
                </div>
            </div>
    );
}
 
export default About;