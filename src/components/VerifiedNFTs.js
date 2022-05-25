import { useViewerRecord } from "@self.id/framework";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";

export default function VerifiedNFTs(props) {
  const verifiedCeramicNFTs = useViewerRecord("ChaingeVerification");

  useEffect(() => {
    if (verifiedCeramicNFTs.content) {
      let nftAction = verifiedCeramicNFTs.content.nftAction;
      props.updateVerifiedNFTs(nftAction);
    }
  }, [props, verifiedCeramicNFTs.content]);

  return (
    <List>
      {props.verifiedNFTs &&
        props.verifiedNFTs.map((nft, i) => (
          <ListItem key={i}>
            <ListItemText primary={nft.nftID} />
            <ListItemText primary={nft.action} />
            <ListItemText primary={nft.date} />
          </ListItem>
        ))}
    </List>
  );
}
