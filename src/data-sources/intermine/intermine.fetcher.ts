import nodeFetch from 'node-fetch';
import { RequestOptions } from '@apollo/datasource-rest';


// wraps the default RESTDataSource fetcher (i.e. nodeFetch) to force caching
// of every response
export async function intermineFetcher(url: string, options: RequestOptions) {
    return nodeFetch(url, options)
        .then((response) => {
            response.headers.delete('pragma');
            response.headers.set('cache-control', 'public');
            return response;
        });
}
