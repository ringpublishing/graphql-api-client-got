import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import got from 'got';
import { DocumentNode, print, stripIgnoredCharacters } from 'graphql';
import { URL } from 'url';

const API_HOSTNAME = 'api.ringpublishing.com';
const DEFAULT_TIMEOUT = 1000;

export enum RingGqlApiProtocol {
    HTTP = 'http',
    HTTPS = 'https'
}

export enum RingGqlApiType {
    CONTENT = 'content',
    WEBSITES = 'websites',
    VIDEOS = 'videos'
}

export interface RingApiGqlClientParams {
    accessKey: string;
    apiHost?: string;
    apiProtocol?: RingGqlApiProtocol;
    secretKey: string;
    spaceUuid: string;
    timeout?: number;
}

export interface RingGqlApiClientResponseError {
    extensions: {
        code: string;
    }[];
    locations: {
        column: number;
        line: number;
    }[];
    message: string;
}

export interface RingGqlApiClientResponse<TResponseData> {
    data?: TResponseData;
    errors?: RingGqlApiClientResponseError[];
}

export abstract class RingGqlApiClient {
    protected abstract readonly apiType: RingGqlApiType;

    protected abstract readonly apiVersion: number;

    private readonly apiHost: string;

    private readonly apiProtocol: RingGqlApiProtocol;

    private signer: SignatureV4;

    private readonly spaceUuid: string;

    private readonly timeout: number;

    constructor({
        accessKey,
        apiHost = API_HOSTNAME,
        apiProtocol = RingGqlApiProtocol.HTTPS,
        timeout = DEFAULT_TIMEOUT,
        secretKey,
        spaceUuid
    }: RingApiGqlClientParams) {
        this.apiHost = apiHost;
        this.apiProtocol = apiProtocol;
        this.spaceUuid = spaceUuid;
        this.timeout = timeout;

        this.signer = new SignatureV4({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey
            },
            region: 'eu-central-1',
            service: 'execute-api',
            sha256: Sha256
        });
    }

    private get url(): URL {
        return new URL(`${this.apiProtocol}://${this.apiHost}/${this.apiType}/v${this.apiVersion}/${this.spaceUuid}`);
    }

    public async query<TResponseData, TVariables>(query: DocumentNode, variables?: TVariables): Promise<RingGqlApiClientResponse<TResponseData>> {
        const httpRequest = new HttpRequest({
            hostname: this.url.hostname,
            path: this.url.pathname,
            protocol: this.url.protocol,
            method: 'POST',
            body: {
                query: stripIgnoredCharacters(print(query)),
                ...(variables && { variables })
            },
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'host': this.url.host
            }
        });
        const { body, headers } = await this.signer.sign(httpRequest, { signingDate: new Date() });

        return got
            .post({
                headers,
                json: body,
                retry: {
                    limit: 2
                },
                throwHttpErrors: false,
                timeout: {
                    connect: 200,
                    response: this.timeout
                },
                url: this.url
            })
            .json<RingGqlApiClientResponse<TResponseData>>();
    }
}
