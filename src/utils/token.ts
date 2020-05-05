import jwt_decode from 'jwt-decode';

const ACCESS_TOKEN = 'access-token';
const ACCESS_TOKEN_EXPIRED = `${ACCESS_TOKEN}-expired`;

const REFRESH_TOKEN = 'refresh-token';
const REFRESH_TOKEN_EXPIRED = `${REFRESH_TOKEN}-expired`;

const REFRESH_TIME = 60;

interface Token {
  // 签发人
  iss: string;
  // 过期时间
  exp: number;
  // 主题
  sub: string;
  // 受众
  aud: string;
  // 生效时间
  nbf: number;
  // 签发时间
  iat: number;
  // 编号
  jti: string;
}

function getCurrentTimestamp() {
  const date = new Date();
  return (
    new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    ).getTime() / 1000
  );
}

/**
 * Get the access token
 *
 * @export
 * @returns
 */
export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    const at_exp = localStorage.getItem(ACCESS_TOKEN_EXPIRED);
    if (at_exp) {
      const current = getCurrentTimestamp();
      if (current > Number(at_exp)) return undefined;
    }
  }
  return token;
}

/**
 * Get the refresh token
 *
 * @export
 * @returns
 */
export function getRefreshToken() {
  const token = localStorage.getItem(REFRESH_TOKEN);
  if (token) {
    const rt_exp = localStorage.getItem(REFRESH_TOKEN_EXPIRED);
    if (rt_exp) {
      const current = getCurrentTimestamp();
      if (current > Number(rt_exp)) return undefined;
    }
  }
  return token;
}

/**
 * Set the access token
 *
 * @export
 * @param {string} token
 */
export function setAccessToken(token: string) {
  const decodeToken = jwt_decode<Token>(token);
  const { exp } = decodeToken;
  localStorage.setItem(ACCESS_TOKEN, token);
  localStorage.setItem(ACCESS_TOKEN_EXPIRED, exp.toString());
}

/**
 * Set the refresh token
 *
 * @export
 * @param {string} token
 */
export function setRefreshToken(token: string) {
  const decodeToken = jwt_decode<Token>(token);
  const { exp } = decodeToken;
  localStorage.setItem(REFRESH_TOKEN, token);
  localStorage.setItem(REFRESH_TOKEN_EXPIRED, exp.toString());
}

/**
 * Check whether need to refresh the access token
 *
 * @export
 */
export function isNeedRefreshToken() {
  const at_exp = localStorage.getItem(ACCESS_TOKEN_EXPIRED);
  if (at_exp) {
    const current = getCurrentTimestamp();
    if (current > Number(at_exp) - REFRESH_TIME) {
      const rt_exp = localStorage.getItem(REFRESH_TOKEN_EXPIRED);
      if (rt_exp && current < Number(rt_exp)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Clear the access token and refresh token
 *
 * @export
 */
export function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRED);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRED);
}

// export async function refreshTokenAsync() {
//   const token = getRefreshToken()
//   if(token){
//     const response = await refreshToken({token})
//     if(response.code === 0 && response.data){
//       const { accessToken } = response.data
//       if(accessToken){
//         setAccessToken(accessToken)
//       }
//     }
//   }
// }
