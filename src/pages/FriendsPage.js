import { Container } from "@mui/material";
import { FriendsList } from "../components/FriendsList/FriendsList";
import NavBar from "../components/NavBar/NavBar";


function FriendsPage() {
    return(
        <Container>
            <NavBar />
            <h1>Friends Page</h1> <br/>
            <FriendsList />
        </Container>
    )
}

export default FriendsPage;