import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { getAccessToken } from '@/utils/token';
import { getLoginPath, isLoginPath } from '@/utils/path';
import TokenTimer from '@/components/TokenTimer';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  // constructor(props:SecurityLayoutProps ){
  //   super(props)
  //   const token = getAccessToken();
  //   if (!token) {
  //     window.location.href = getLoginPath();
  //   }
  // }

  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });

    const token = getAccessToken();
    if (!token) {
      window.location.href = getLoginPath();
    } else {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'user/getInfo',
        });
      }
    }
  }

  componentWillUnmount() {}

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在

    const isLogin = currentUser && currentUser.userid;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && !isLoginPath()) {
      window.location.href = getLoginPath();
    }
    return (
      <>
        <TokenTimer interval={5000} show />
        {children}
      </>
    );
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
