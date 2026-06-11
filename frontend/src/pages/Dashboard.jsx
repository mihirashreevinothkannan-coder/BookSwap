import Navbar from "../components/Navbar";

function Dashboard() {
    const userName = localStorage.getItem("userName");

    return (
        <div>
            <Navbar />

            <h2>Welcome {userName}</h2>

            <h3>Book Exchange Dashboard</h3>

            <p>Use the navigation bar to manage books and requests.</p>
        </div>
    );
}

export default Dashboard;