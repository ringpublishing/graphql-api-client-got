import { gql, WebsitesApiClient } from '../src';
import got from 'got';

jest.mock('got');

describe('Ring GQL API client', () => {
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should call gql query to api', async () => {
        const mockedGot = jest.mocked(got.post);

        mockedGot.mockReturnValue({
            json: () =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Promise.resolve({
                    name: 'Ucs2SetupAws01',
                    stories: {
                        edges: [
                            {
                                node: {
                                    title: 'ipsum magna consequat'
                                }
                            },
                            {
                                node: {
                                    title: 'some title'
                                }
                            }
                        ]
                    }
                })
        });

        const client = new WebsitesApiClient({
            accessKey: 'accessKey',
            secretKey: 'secretKey',
            spaceUuid: 'spaceUuid'
        });

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

        const result = await client.query(query);

        expect(result).toMatchInlineSnapshot(`
            {
              "name": "Ucs2SetupAws01",
              "stories": {
                "edges": [
                  {
                    "node": {
                      "title": "ipsum magna consequat",
                    },
                  },
                  {
                    "node": {
                      "title": "some title",
                    },
                  },
                ],
              },
            }
        `);
        expect(mockedGot).toHaveBeenCalledWith({
            headers: {
                'accept': 'application/json',
                'authorization': 'AWS4-HMAC-SHA256'
                    + ' Credential=accessKey/20200101/eu-central-1/execute-api/aws4_request,'
                    + ' SignedHeaders=accept;content-type;host;x-amz-content-sha256;x-amz-date,'
                    + ' Signature=f0f74a0f9e645ee8a4db77601e359958bb2d06a044f749fae284197efb040662',
                'content-type': 'application/json',
                'host': 'api.ringpublishing.com',
                'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
                'x-amz-date': '20200101T000000Z'
            },
            json: {
                query: '{name stories(limit:2){edges{node{title}}}}'
            },
            retry: {
                limit: 2
            },
            throwHttpErrors: false,
            timeout: {
                connect: 200,
                response: 1000
            },
            url: expect.any(URL),
            agent: expect.any(Object)
        });
    });
});
