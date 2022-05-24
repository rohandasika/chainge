import { useViewerRecord, useViewerConnection } from "@self.id/framework";

export default function UserProfile(props) {
  const profile = useViewerRecord("basicProfile");
  const [connection] = useViewerConnection();

  // console.log(profile);
  return connection.status === "connected" ? (
    <div>
      <h1 id="heading">hello {profile.content.name}</h1>
    </div>
  ) : (
    <div>
      <p className="notConnected">Connect an Ethereum wallet to begin</p>
    </div>
  );
}
