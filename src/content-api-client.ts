import { RingGqlApiClient, RingGqlApiType } from './ring-gql-api-client';

export class ContentApiClient extends RingGqlApiClient {
    protected apiType = RingGqlApiType.CONTENT;

    protected apiVersion = 2;
}
