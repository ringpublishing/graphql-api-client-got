import { RingGqlApiClient, RingGqlApiType } from './ring-gql-api-client';

export class WebsitesApiClient extends RingGqlApiClient {
    protected apiType = RingGqlApiType.WEBSITES;

    protected apiVersion = 2;
}
