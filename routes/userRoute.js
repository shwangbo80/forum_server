const router = require("express").Router();
const UserInfo = require("../models/UserModel");

//Add user info to user
router.post("/register", async (req, res) => {
  const user = await UserInfo.findOne({authid: req.body.authid});

  //If no authid is found, register user info
  if (!user) {
    try {
      const newUser = new UserInfo({
        authid: req.body.authid,
        username: req.body.username,
        userabout: req.body.userasbout,
        usersignature: req.body.usersignature,
      });
      const userInfo = await newUser.save();
      res.status(200).json(userInfo);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(200).json("User information found");
  }
});
//Edit user infop
//Get user info

module.exports = router;
