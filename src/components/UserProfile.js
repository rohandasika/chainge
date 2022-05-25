import Typography from "@mui/material/Typography";

import { useViewerRecord, useViewerConnection } from "@self.id/framework";

export default function UserProfile(props) {
  const profile = useViewerRecord("basicProfile");
  const [connection] = useViewerConnection();

  // console.log(profile);
  return connection.status === "connected" ? (
    <div>
      <Typography variant="h6">Hello, {profile.content.name}!</Typography>

      <Typography variant="p">
        {connection.selfID.id.slice(0, 10) +
          "..." +
          connection.selfID.id.slice(65)}
        <br></br>
        {props.addr.slice(0, 6) + "..." + props.addr.slice(38)}
      </Typography>
    </div>
  ) : (
    <div></div>
  );
}
