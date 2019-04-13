import {createBrowserHistory as createHistory } from 'history'


/* FRONTEND_ADDRESS initialized by process.env in 'webpack.config.js' */
export const history = createHistory({ basename: FRONTEND_ADDRESS })