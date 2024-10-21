import nodeFetch from 'node-fetch';
import { RequestOptions } from '@apollo/datasource-rest';


// wraps the default RESTDataSource fetcher (i.e. nodeFetch) to remove cache
// busting headers from POST responses
export async function intermineFetcher(url: string, options: RequestOptions) {
    return nodeFetch(url, options)
        .then((response) => {
            if (options.method === 'POST') {
                response.headers.delete('cache-control');
                response.headers.delete('pragma');
            }
            return response;
        });
}
