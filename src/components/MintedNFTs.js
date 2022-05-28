import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect } from "react";
import { useViewerConnection } from "@self.id/framework";
import { getAllNFTs, isNftVerified } from "../utils/NFTutils";
import { OPENSEA_URL } from "../utils/constants";

export default function MintedNFTs(props) {
  const [connection] = useViewerConnection();

  useEffect(() => {
    if (connection.status === "connected") {
      getAllNFTs(props.addr, props.updateNFTs);
    }
  }, [connection, props.addr, props.updateNFTs]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token ID</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Times Completed</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.nfts.map((nft, i) => (
            <TableRow key={i}>
              <TableCell>{nft[0]}</TableCell>
              <TableCell align="center">{nft[1]}</TableCell>
              <TableCell align="center">{nft[2]}</TableCell>

              {isNftVerified(nft[0], props.verifiedNFTs) && (
                <TableCell padding="checkbox">
                  <IconButton href={OPENSEA_URL + nft[0]} target="_blank">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
