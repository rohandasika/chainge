import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useEffect, useState } from "react";
import { DEMO_ADDRESS, CYBERCONNECT_ENDPOINT } from "../utils/constants";
import { GraphQLClient, gql } from "graphql-request";

// Initialize the GraphQL Client
const client = new GraphQLClient(CYBERCONNECT_ENDPOINT);

// Query to get all types of followers via CyberConnect API
export const GET_IDENTITY = gql`
  query ($address: String!) {
    identity(address: $address, network: ETH) {
      address
      domain
      followerCount(namespace: "CyberConnect")
      followingCount(namespace: "CyberConnect")
      followings(first: 50) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        list {
          address
          domain
          avatar
          alias
          namespace
          lastModifiedTime
          verifiable
        }
      }
      followers(first: 50) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        list {
          address
          domain
          avatar
          alias
          namespace
          lastModifiedTime
          verifiable
        }
      }
    }
  }
`;

// Query variables
const variables = {
  address: "0xF2532Fb284575f0cb97F77cEE0c9E19f26b4A20d",
  // address: DEMO_ADDRESS,
};

export default function Friends() {
  const [identity, setIdentity] = useState([]);

  useEffect(() => {
    client
      .request(GET_IDENTITY, variables)
      .then((res) => {
        setIdentity(res?.identity);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    identity && (
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={12}
        >
          <Grid item xs>
            <h1>
              {identity.followerCount}
              {identity.followerCount === 1
                ? " person follows "
                : " people follow "}
              you
            </h1>
            {identity.followerCount > 0 && (
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Address</TableCell>
                      <TableCell align="right">ENS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {identity.followers.list.map((follower, i) => (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          {follower.address}
                        </TableCell>
                        <TableCell align="right">{follower.domain}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
          <Grid item xs>
            <h1>
              You follow {identity.followingCount}
              {identity.followingCount === 1 ? " person" : " people"}
            </h1>
            {identity.followingCount > 0 && (
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Address</TableCell>
                      <TableCell align="right">ENS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {identity.followings.list.map((following, i) => (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          {following.address}
                        </TableCell>
                        <TableCell align="right">{following.domain}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Container>
    )
  );
}
