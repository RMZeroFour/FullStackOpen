import { NODE_ENV } from "./config.js";

function info (...params) {
  if (NODE_ENV !== 'test') {
    console.log(...params);
  }
}

function error (...params) {
  if (NODE_ENV !== 'test') {
    console.error(...params);
  }
}

export default { info, error };