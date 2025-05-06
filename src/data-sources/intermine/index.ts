import {ApiMixin} from './api/index.js';
import {IntermineServer} from './intermine.server.js';

export class IntermineAPI extends ApiMixin(IntermineServer) {}
