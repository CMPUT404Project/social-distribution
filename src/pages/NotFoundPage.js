import NavBar from "../components/NavBar/NavBar";


function NotFoundPage() {
    return(
        <>
        <NavBar />
            <div className="container" style={{alignItems:"start"}}>
                <h1 className="not-found">404 PAGE NOT FOUND</h1>
            </div>
        </>
    )
}

export default NotFoundPage;