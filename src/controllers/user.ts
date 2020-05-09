import mongoose from "mongoose";
import bcrypt from "bcrypt" ;
import jwt from "jsonwebtoken";
import {usernameValid, passwordValid, statusValid} from '../helpers/validators';
import fs from 'fs';
import User from "../models/user";

export const register = (req: any, res: any, next: any) => {
  req.body.username = req.body.username.toLowerCase();

  usernameValid(req.body.username).then(() => {
    return passwordValid(req.body.password);
  }).then(() => {
    return User.find({ username: req.body.username }).exec();
  }).then((user: any) => {
    if (user.length >= 1) {
      return res.status(500).json({
        mes: "Username exists"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            mes: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: hash
          });

          return user.save()
        }
      });
    }
  }).then((result: any) => {
    res.status(201).json({
      mes: "User created"
    });
  }).catch(err => {
    return res.status(500).json({
      mes: err
    });
  });
};

export const login = (req: any, res: any, next: any) => {
  req.body.username = req.body.username.toLowerCase();

  User.find({ username: req.body.username })
    .exec()
    .then((user: any) => {
      if (user.length < 1) {
        return res.status(401).json({
          mes: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            mes: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id
            },
            process.env.JwtSecret as string,
            {
              expiresIn: "1h"
            }
          );

          return res.cookie('jwt', token,{
            expires: new Date(Date.now() + 1000 * 60 * 60), 
            httpOnly: true
          }).status(200).json({
            mes: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          mes: "Auth failed"
        });
      });
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).json({
        mes: err
      });
    });
};

export const logOut = (req: any, res: any, next: any) => {
  return res.clearCookie("jwt").status(200).json({
    mes: "logged out"
  });
}

export const getPublic = (req: any, res: any, next: any) => {
  if(req.body.username)
    req.body.username = req.body.username.toLowerCase();

  let mongoReq = req.body.username ? User.find({ username: req.body.username }).exec() : User.find({ _id: req.body.id }).exec();

  mongoReq.then((user: any) => {
    if (user.length < 1) {
      return res.status(401).json({
        mes: "User not found"
      });
    }
    
    res.status(200).json({
      id: user[0].id,
      username: user[0].username,
      status: user[0].status,
      picture: user[0].picture,
      mes: "User found"
    });
  })
  .catch((err: any) => {
    console.log(err);
    res.status(500).json({
      mes: err
    });
  });
}

export const remove = (req: any, res: any, next: any) => {
  User.remove({ _id: req.userData.userId })
    .exec()
    .then((result: any) => {
      res.status(200).json({
        mes: "User removed"
      });
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).json({
        mes: err
      });
    });
};

export const updateTheme = (req: any, res: any, next: any) => {
  User.update({ _id: req.userData.userId }, { $set: {'theme': req.body.theme} })
    .exec()
    .then((result: any) => {
      res.status(200).json({
        mes: "User updated"
      });
    })
    .catch((err: any) => {
      res.status(500).json({
        mes: err
      });
    });
};

export const updateStatus= (req: any, res: any, next: any) => {
  statusValid(req.body.status).then(() => {
    return User.update({ _id: req.userData.userId }, { $set: {'status': req.body.status} }).exec()
  }).then((result: any) => {
    res.status(200).json({
      mes: "User updated"
    });
  })
  .catch((err: any) => {
    res.status(500).json({
      mes: err
    });
  });
};

export const notify = (idTo: mongoose.Types.ObjectId, idFrom: mongoose.Types.ObjectId, type: number, extra: string) => {
  return new Promise((resolve, reject) => {
    User.update({ _id: idTo},  {$push: {notifications: [{id: idFrom, type: type, extra: extra}]}})
    .exec()
    .then((result: any) => {
      resolve("notified");
    })
    .catch((err: any) => {
      reject(err);
    });
  })
}

export const getNotifications = (req: any, res: any, next: any) => {
  User.find({ _id: req.userData.userId },)
  .exec()
  .then((user: any) => {
    if (user.length < 1) {
      return res.status(401).json({
        mes: "User not found"
      });
    }

    User.update({ _id: req.userData.userId }, { $set: {'notifications.$[].seen': true }}).exec().then(() => {
      res.status(200).json({
        notifications: user[0].notifications.reverse()
      });
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).json({
        mes: err
      });
    });
  })
  .catch((err: any) => {
    console.log(err);
    res.status(500).json({
      mes: err
    });
  });
}

export const updatePicture = (req: any, res: any, next: any) => {
  User.find({ _id: req.userData.userId })
    .exec()
    .then((user: any) => {
      if (user.length < 1) {
        return res.status(401).json({
          mes: "User not found"
        });
      }
      
      if(user[0].picture != 'default')
        fs.unlinkSync("./pictures/"+user[0].picture);

      User.update({ _id: req.userData.userId }, { $set: {'picture': req.file.filename} }).exec()
    }).then((result: any) => {
      res.status(200).json({
        mes: "User updated"
      });
    }).catch((err: any) => {
      res.status(500).json({
        mes: err
      });
    });
};

export const getUserInfo = (req: any, res: any, next: any) => {
    User.find({ _id: req.userData.userId })
    .exec()
    .then((user: any) => {
      if (user.length < 1) {
        return res.status(401).json({
          mes: "User not found"
        });
      }
      
      res.status(200).json({
        id: user[0].id,
        username: user[0].username,
        theme: user[0].theme,
        status: user[0].status,
        picture: user[0].picture
      });
    })
    .catch((err: any) => {
      console.log(err);
      res.status(500).json({
        mes: err
      });
    });
};

export const isFollowing = (req: any, res: any, next: any) => {
  User.find({ $and: [{_id: req.userData.userId}, {'following.id': mongoose.Types.ObjectId(req.body.id)}]})
  .exec()
  .then((user: any) => {
    if (user.length < 1) {
      return res.status(200).json({
        following: false,
        mes: "not following"
      });
    }

    res.status(200).json({
      following: true,
      mes: "following"
    });
  })
  .catch((err: any) => {
    console.log(err);
    res.status(500).json({
      mes: err
    });
  });;
}

export const follow = (req: any, res: any, next: any) => {
  if(req.body.follow == true){
    User.find({ $and: [{_id: req.userData.userId}, {'following.id': {$nin: mongoose.Types.ObjectId(req.body.id)}}]})
      .exec().then((user: any) => {
        if (user.length < 1) {
          res.status(200).json({
            mes: "already following"
          });
        }
        
        return User.update({ _id: req.userData.userId},  {$push: {following: [{id: mongoose.Types.ObjectId(req.body.id)}]} }).exec();
      })
      .then(() => {
        return notify(mongoose.Types.ObjectId(req.body.id), req.userData.userId, 0, '');
      }).then(() => {
        res.status(200).json({
          mes: "followed"
        });
      })
      .catch((err: any) => {
        console.log(err);
        res.status(500).json({
          mes: err
        });
      });
  }else{
    User.update({ _id: req.userData.userId }, {$pull: {following: { id : [mongoose.Types.ObjectId(req.body.id)]} } })
      .exec()
      .then((result: any) => {
        res.status(200).json({
          mes: "unfollowed"
        });
      })
      .catch((err: any) => {
        console.log(err);
        res.status(500).json({
          mes: err
        });
      });
  }
}

export const validateUsername = (req: any, res: any, next: any) => {
  req.body.username = req.body.username.toLowerCase();
  
  usernameValid(req.body.username).then(() => {
    return User.find({ username: req.body.username }).exec();
  }).then((user: any) => {
    if (user.length >= 1) {
      return res.status(500).json({
        mes: "Username exists"
      });
    } else {
      res.status(200).json({
        mes: "success"
      });
    }
  }).catch(err => {
    res.status(500).json({
      mes: err
    });
  })
};

export const SearchUser = (req: any, res: any, next: any) => {
  req.body.query = req.body.query.toLowerCase();

  User.find({username: {$regex : `.*${req.body.query}.*`}}, { username: 1, status: 1, picture: 1, _id: 1 }, { skip: req.body.skip, limit: req.body.limit })
  .exec().then((users: any) => {
    res.status(200).json({
      users: users,
      mes: "success"
    });
  })
  .catch((err: any) => {
    console.log(err);
    res.status(500).json({
      mes: err
    });
  });
}