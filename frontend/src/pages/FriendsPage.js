import { Container } from "@mui/material";
import { FriendsList } from "../components/FriendsList/FriendsList";


function FriendsPage() {
    return(
        <Container>
            <h1>Friends Page</h1> <br/>
            <FriendsList />
        </Container>
        
    )
}

export default FriendsPage;