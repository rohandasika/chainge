import { useEffect } from "react";
import { useViewerConnection } from "@self.id/framework";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { getAllNFTs } from "../utils/NFTutils";

export default function MintedNFTs(props) {
  const [connection] = useViewerConnection();

  useEffect(() => {
    if (connection.status === "connected") {
      getAllNFTs(props.addr, props.updateNFTs);
    }
  }, [connection]);

  return (
    <List>
      {props.nfts.map((nft, i) => {
        return (
          <ListItem key={i}>
            <ListItemText primary={nft} />
          </ListItem>
        );
      })}
    </List>
  );
}
