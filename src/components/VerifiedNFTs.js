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
      let verifiedActions = verifiedCeramicNFTs.content.verifiedActions;
      props.updateVerifiedNFTs(verifiedActions);
    }
  }, [props, verifiedCeramicNFTs.content]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token ID</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Date Completed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.verifiedNFTs &&
            props.verifiedNFTs.map((nft, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{nft.token_id}</TableCell>
                <TableCell align="right">{nft.action}</TableCell>
                <TableCell align="right">{nft.date}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
