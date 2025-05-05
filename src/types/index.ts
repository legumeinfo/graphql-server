// ----------------------------------------------------------------
// Load the typeDefs from all .graphql files in the types directory
// ----------------------------------------------------------------

import path from 'path';
import {fileURLToPath} from 'url';
import {loadFilesSync} from '@graphql-tools/load-files';
import {mergeTypeDefs} from '@graphql-tools/merge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const types = loadFilesSync(path.join(__dirname, './'), {
  extensions: ['graphql'],
});

export const typeDefs = mergeTypeDefs(types);
