import { Link, Navigate, useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className='navbar'>
            <h2>PERSONAL KNOWLEDGE BASE</h2>
            <div className="nav-links">
                <Link to='/dashboard'> DASHBOARD </Link>
                <Link to='/notes/create'>CREATE NOTE</Link>
                <button onClick={handleLogout}>LOGOUT</button>
            </div>
        </nav>

    );
};
export default Navbar;