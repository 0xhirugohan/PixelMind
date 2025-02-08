import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/<subgraph-name>", // Replace with your subgraph endpoint
  cache: new InMemoryCache(),
});

export const fetchNFTsFromGraph = async (walletAddress: string) => {
  const FETCH_NFTS_QUERY = gql`
    query FetchNFTs($owner: String!) {
      tokens(where: { owner: $owner }) {
        id
        tokenID
        tokenURI
        owner {
          id
        }
      }
    }
  `;

  const response = await client.query({
    query: FETCH_NFTS_QUERY,
    variables: { owner: walletAddress.toLowerCase() },
  });

  return response.data.tokens; // List of NFTs
};
