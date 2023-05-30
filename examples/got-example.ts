import { gql } from 'graphql-tag';
import { WebsitesApiClient } from '../src';

const accessKey = process.env.ACCESS_KEY ?? '';
const secretKey = process.env.SECRET_KEY ?? '';
const spaceUuid = process.env.SPACE_UUID ?? '';

const query = gql`
    query {
        name
        stories(limit: 2) {
            edges {
                node {
                    title
                }
            }
        }
    }
`;

(async function run(): Promise<void> {
    const websitesApiClient = new WebsitesApiClient({ accessKey, secretKey, spaceUuid });
    const response = await websitesApiClient.query(query);

    console.debug(JSON.stringify(response.data, null, 4));
})();
