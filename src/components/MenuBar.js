import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { Link } from "react-router-dom";

import ConnectWallet from "./ConnectWallet";
import UserProfile from "./UserProfile";

export default function MenuBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <UserProfile addr={props.addr}></UserProfile>
            <ButtonGroup variant="text" aria-label="text button group">
              <Link to="/">
                <Button sx={{ color: "white" }}>Home</Button>
              </Link>
              <Link to="friends">
                <Button sx={{ color: "white" }}>Friends</Button>
              </Link>
              <Link to="search">
                <Button sx={{ color: "white" }}>Search</Button>
              </Link>
            </ButtonGroup>
            <ConnectWallet
              addr={props.addr}
              setAddr={props.setAddr}
              setConn={props.setConn}
            ></ConnectWallet>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
