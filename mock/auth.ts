import { Request, Response } from 'express';

interface Payload {
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

const JWT_HEADER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export default {
  'POST /api/auth/login': (req: Request, res: Response) => {
    const { password, userName } = req.body;
    if (password === 'ant.design' && userName === 'admin') {
      const current = getCurrentTimestamp();
      const accessPayload: Payload = {
        iss: 'mock',
        exp: current + 300,
        sub: 'mock access token',
        aud: 'user',
        nbf: current,
        iat: current,
        jti: '001',
      };
      const accessBase64 = Buffer.from(JSON.stringify(accessPayload)).toString('base64');
      const accessToken = `${JWT_HEADER}.${accessBase64}.MOKE-ACCESS`;

      const refreshPayload: Payload = {
        iss: 'mock',
        exp: current + 1200,
        sub: 'mock auth',
        aud: 'usr',
        nbf: current,
        iat: current,
        jti: '001',
      };
      const refreshBase64 = Buffer.from(JSON.stringify(refreshPayload)).toString('base64');
      const refreshToken = `${JWT_HEADER}.${refreshBase64}.MOCK-REFRESH`;
      res.send({
        code: 0,
        data: {
          accessToken,
          refreshToken,
        },
      });
      return;
    }

    res.send({
      code: 40001,
      message: '帐号密码错误',
      data: null,
    });
  },
  'POST /api/auth/refreshToken': (req: Request, res: Response) => {
    const { token } = req.body;
    if (token) {
      const current = getCurrentTimestamp();
      const accessPayload: Payload = {
        iss: 'mock',
        exp: current + 600,
        sub: 'mock access token',
        aud: 'user',
        nbf: current,
        iat: current,
        jti: '001',
      };
      const accessBase64 = Buffer.from(JSON.stringify(accessPayload)).toString('base64');
      const accessToken = `${JWT_HEADER}.${accessBase64}.MOKE-ACCESS`;
      res.send({
        code: 0,
        data: {
          accessToken,
        },
      });
      return;
    }

    res.send({
      code: 40002,
      message: 'Token无效',
      data: null,
    });
  },
};
