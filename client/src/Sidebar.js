import { Link } from 'react-router-dom'
import './Sidebar.css'
const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className = "container">
            <Link to="/">Home</Link>
            </div>
            <div className="container">
            <Link to="/make">Make Quiz</Link>
            </div>
            <div className="container">
            <Link to="/take">Take Quiz</Link>
            </div>
        </div>
    );
}

export default Sidebar;