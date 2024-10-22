import nodeFetch from 'node-fetch';
import { RequestOptions } from '@apollo/datasource-rest';


// wraps the default RESTDataSource fetcher (i.e. nodeFetch) to remove cache
// busting headers from POST responses
export async function intermineFetcher(url: string, options: RequestOptions) {
    return nodeFetch(url, options)
        .then((response) => {
            response.headers.delete('pragma');
            response.headers.set('cache-control', 'public, max-age=222');
            return response;
        });
}
