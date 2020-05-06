import React from 'react';
import { refreshToken } from '@/services/auth';
import { getRefreshToken, isNeedRefreshToken, setAccessToken } from '@/utils/token';
import { message } from 'antd';

export interface TokenProps {
  interval: number;
  show: boolean;
}

interface TokenState {
  timerId?: NodeJS.Timeout;
  lastTime?: string;
  times: number;
}

class TokenTimer extends React.Component<TokenProps, TokenState> {
  static defaultProps = {
    interval: 30000,
    show: false,
  };

  constructor(props: TokenProps) {
    super(props);
    this.state = {
      times: 0,
      lastTime: undefined,
      timerId: undefined,
    };
  }

  componentDidMount() {
    // 定时器，可以修改1000为自己想要的时间，
    const timerId = setInterval(() => this.tick(), this.props.interval);
    this.setState({
      timerId,
    });
  }

  componentWillUnmount() {
    // 清除定时器
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
    }
  }

  async tick() {
    if (isNeedRefreshToken()) {
      const token = getRefreshToken();
      if (token) {
        try {
          const response = await refreshToken({ token });
          const { accessToken } = response.data;
          if (accessToken) {
            setAccessToken(accessToken);
            const { times } = this.state;
            this.setState({
              times: times + 1,
              lastTime: new Date().toString(),
            });
          } else {
            message.error('无更新Token返回');
          }
        } catch (error) {
          message.error(`更新Token异常,${error}`);
        }
      }
    }
  }

  render() {
    return <>{this.props.show && <div>Token最近更新时间:{this.state.lastTime}</div>}</>;
  }
}
export default TokenTimer;
