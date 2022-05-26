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
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token ID</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Times Completed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.nfts.map((nft, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {nft[0]}
              </TableCell>
              <TableCell align="right">{nft[1]}</TableCell>
              <TableCell align="right">{nft[3]}</TableCell>
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
