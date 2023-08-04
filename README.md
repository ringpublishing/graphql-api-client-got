# @ringpublishing/graphql-api-client-got

Ring Content API Client and Websites API Client will help you to use Ring GraphQL APIs.
All you need is your Space UUID and access/secret API keys.

## Requirements

Make sure you have `NodeJS` installed and running in version `14` or above.

## Installation

When you have your node running, install our library by running the command:

```shell
npm install @ringpublishing/graphql-api-client-got
```

## Introduction
Two clients are available:
- WebsitesApiClient (api version 2) for Websites API
- ContentApiClient (api version 2) for Content API
- VideosApiClient (api version 1) for Videos API

## Usage

Look how easy is to use Ring GQL API using this library.

```typescript
import { gql, WebsitesApiClient } from '@ringpublishing/graphql-api-client-got';

const accessKey = process.env.ACCESS_KEY!;
const secretKey = process.env.SECRET_KEY!;
const spaceUuid = process.env.SPACE_UUID!;

console.log('ARGUMENTS:', space, access, secret);

const query = gql`
    query {
        name,
        stories(limit: 2) {
            edges {
                node {
                    title
                }
            }
        }
    }
`;

const websitesApiClient = new WebsitesApiClient({ accessKey, secretKey, spaceUuid });

try {
    const response = await websitesApiClient.query(query);
    console.log('Data:', response.data);
} catch (err) {
    console.error('Error:', err);
}
```

## Reference

```
class WebsitesApiClient or ContentApiClient

    constructor:
    {
        spaceUuid (UUIDv4 string) - Websites Space UUID
        accessKey (UUIDv4 string) - Access Key
        secretKey (UUIDv4 string) - Secret Key
        timeout (number, default 1000) - Response timeout
        apiHost (string) - API host, default: api.ringpublishing.com
        apiProtocol: (RingGqlApiProtocol) - API protocol, default: RingGqlApiProtocol.HTTPS
    } 

    methods:
        query<TResponseData, TVariables>(query: DocumentNode, variables?: TVariables): Promise<RingGqlApiClientResponse<TResponseData>>
        {
            query/mutation (DocumentNode): GQL query
            variables (key/value Object): query variables (optional)
        }
```
