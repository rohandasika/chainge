import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";

import ConnectWallet from "./ConnectWallet";
import UserProfile from "./UserProfile";

export default function MenuBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <UserProfile addr={props.addr}></UserProfile>
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
