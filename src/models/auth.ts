import { setAccessToken, setRefreshToken } from '@/utils/token';
import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { login } from '@/services/auth';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  // status?: 'ok' | 'error';
  type?: string;
  // currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface AuthModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setToken: Reducer<StateType>;
  };
}

const Model: AuthModelType = {
  namespace: 'auth',

  state: {},

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.code === 0) {
        yield put({
          type: 'setToken',
          payload: response.data,
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    setToken(state, { payload }) {
      setAccessToken(payload.accessToken);
      setRefreshToken(payload.refreshToken);
      return {
        ...state,
        // status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
