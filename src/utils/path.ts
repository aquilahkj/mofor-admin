import { stringify } from 'qs';

const LOGIN_PATH = '/user/login';

/**
 * Get the login path
 *
 * @export
 * @param {boolean} redirect
 * @returns
 */
export function getLoginPath(redirect: boolean = true) {
  if (redirect) {
    const queryString = stringify({
      redirect: window.location.href,
    });
    return `${LOGIN_PATH}?${queryString}`;
  }
  return LOGIN_PATH;
}

/**
 * Check whether the specific path is login path
 *
 * @export
 * @returns
 */
export function isLoginPath() {
  return LOGIN_PATH === window.location.pathname;
}
