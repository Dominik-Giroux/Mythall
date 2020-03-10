import { api, firebase } from './private';

export const environment = {
  production: false,
  api: api.dev,
  firebase: firebase.dev
};
