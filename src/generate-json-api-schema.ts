import { writeFile } from 'fs/promises';
import { gql } from 'graphql-tag';
import { WebsitesApiClient } from './websites-api-client';
import { ContentApiClient } from './content-api-client';
import { VideosApiClientApiClient } from './videos-api-client';

const websitesApiAccessKey = process.env.bamboo_WEBSITES_API_ACCESS_KEY as string;
const websitesApiSecretKey = process.env.bamboo_WEBSITES_API_SECRET_KEY as string;
const websitesApiSpaceUuid = process.env.bamboo_WEBSITES_API_SPACE_UUID as string;

const contentApiAccessKey = process.env.bamboo_CONTENT_API_ACCESS_KEY as string;
const contentApiSecretKey = process.env.bamboo_CONTENT_API_SECRET_KEY as string;
const contentApiSpaceUuid = process.env.bamboo_CONTENT_API_SPACE_UUID as string;

const videosApiAccessKey = process.env.bamboo_VIDEOS_API_ACCESS_KEY as string;
const videosApiSecretKey = process.env.bamboo_VIDEOS_API_SECRET_KEY as string;
const videosApiSpaceUuid = process.env.bamboo_VIDEOS_API_SPACE_UUID as string;

const envKeys = [
    websitesApiAccessKey,
    websitesApiSecretKey,
    websitesApiSpaceUuid,
    contentApiAccessKey,
    contentApiSecretKey,
    contentApiSpaceUuid,
    videosApiAccessKey,
    videosApiSecretKey,
    videosApiSpaceUuid
];

if (envKeys.some(key => !key)) {
    throw new Error('Please set environment keys');
}

const schemaQuery = gql`
    {
        __schema {
            queryType { name }
            mutationType { name }
            subscriptionType { name }
            types {
                ...FullType
            }
            directives {
                name
                description
                locations
                args {
                    ...InputValue
                }
            }
        }
    }
    fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
            name
            description
            args {
                ...InputValue
            }
            type {
                ...TypeRef
            }
            isDeprecated
            deprecationReason
        }
        inputFields {
            ...InputValue
        }
        interfaces {
            ...TypeRef
        }
        enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
        }
        possibleTypes {
            ...TypeRef
        }
    }
    
    fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
    }
    
    fragment TypeRef on __Type {
        kind
        name
        ofType {
            kind
            name
            ofType {
                kind
                name
                ofType {
                    kind
                    name
                    ofType {
                        kind
                        name
                        ofType {
                            kind
                            name
                            ofType {
                                kind
                                name
                                ofType {
                                    kind
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

(async function run(): Promise<void> {
    const websitesApiClient = new WebsitesApiClient({ accessKey: websitesApiAccessKey, secretKey: websitesApiSecretKey, spaceUuid: websitesApiSpaceUuid });
    const websitesApiResponse = await websitesApiClient.query(schemaQuery);
    const websitesApiJsonSchema = JSON.stringify(websitesApiResponse.data, null, 4);
    await writeFile('websites-api-schema.json', websitesApiJsonSchema);

    const contentApiClient = new ContentApiClient({ accessKey: contentApiAccessKey, secretKey: contentApiSecretKey, spaceUuid: contentApiSpaceUuid });
    const contentAPiResponse = await contentApiClient.query(schemaQuery);
    const contentApiJsonSchema = JSON.stringify(contentAPiResponse.data, null, 4);
    await writeFile('content-api-schema.json', contentApiJsonSchema);

    const videosApiClient = new VideosApiClientApiClient({
        accessKey: videosApiAccessKey, secretKey: videosApiSecretKey, spaceUuid: videosApiSpaceUuid, timeout: 4000
    });
    const videosAPiResponse = await videosApiClient.query(schemaQuery);
    const videosApiJsonSchema = JSON.stringify(videosAPiResponse.data, null, 4);
    await writeFile('videos-api-schema.json', videosApiJsonSchema);
})();
