import NavBar from "../components/NavBar/NavBar";

import Stream from "../components/Stream/Stream";

function HomePage() {
    return (
        <>
        <NavBar />
            <div className="container">
                <Stream />
            </div>
        </>
    )
}

export default HomePage;