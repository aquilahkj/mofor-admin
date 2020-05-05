import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { history } from 'umi';
import { stringify } from 'querystring';

export default () => {
  const { confirm } = Modal;
  confirm({
    title: `帐号未登录或登录已过期`,
    icon: <ExclamationCircleOutlined />,
    content: `是否重新登录`,
    onOk() {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    },
    onCancel() {},
  });
};
