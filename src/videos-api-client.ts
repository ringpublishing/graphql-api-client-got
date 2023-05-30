import { RingGqlApiClient, RingGqlApiType } from './ring-gql-api-client';

export class VideosApiClientApiClient extends RingGqlApiClient {
    protected apiType = RingGqlApiType.VIDEOS;

    protected apiVersion = 1;
}
