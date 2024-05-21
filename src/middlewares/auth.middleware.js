import { prisma } from '../utils/prisma/index.js';

export default async function (req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) throw new Error('로그인이 필요합니다.');

    // 4. JWT의 `userId`를 이용해 사용자를 조회합니다.
    const user = await prisma.users.findFirst({
      where: {
        userId: +userId,
      },
    });
    if (!user) {
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    // 5. `req.user` 에 조회된 사용자 정보를 할당합니다.
    req.user = user;

    // 6. 다음 미들웨어를 실행합니다.
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message ?? '비 정상적인 요청입니다.' });
  }
}
