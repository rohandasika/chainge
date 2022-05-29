import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useEffect } from "react";
import { useViewerRecord } from "@self.id/framework";

export default function VerifiedNFTs(props) {
  const verifiedCeramicNFTs = useViewerRecord("ChaingeVerification");

  useEffect(() => {
    if (verifiedCeramicNFTs.content) {
      // console.log(verifiedCeramicNFTs.content);
      let verifiedActions = verifiedCeramicNFTs.content.verifiedActions;
      props.updateVerifiedNFTs(verifiedActions);
    }
  }, [props, verifiedCeramicNFTs.content]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token ID</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Date Completed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.verifiedNFTs &&
            props.verifiedNFTs.map((nft, i) => (
              <TableRow key={i}>
                <TableCell>{nft.token_id}</TableCell>
                <TableCell align="center">{nft.action}</TableCell>
                <TableCell align="center">{nft.date}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
