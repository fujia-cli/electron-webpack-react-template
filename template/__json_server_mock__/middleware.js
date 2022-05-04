module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/login') {
    if (req.body.username === 'sunny' && req.body.password === '123') {
      return res.status(200).json({
        success: true,
        data: {
          token: '123',
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: '用户名或密码错误',
      });
    }
  } else if (req.path === '/register') {
    if (req.body.username && req.body.password) {
      return res.status(200).json({
        success: true,
        data: {
          token: '123',
        },
      });
    }
  }

  next();
};
