import jwt from 'jsonwebtoken';

export default (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, "fwh9wyf384fp2q0ffehf2qvhqe80geudhvc");
      
    if (!decoded) {
      res.clearCookie('twitterAccessJwt')
      return res.status(401).json({
        message: 'Auth failed'
      });
    }else {
      req.userData = decoded;
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
};