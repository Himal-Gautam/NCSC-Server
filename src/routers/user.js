import express from "express";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import { request } from "express";
import chalk from "chalk";
import { Auth } from "two-step-auth";
const router = new express.Router();

const success = true;

//create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  console.log("request recieved");
  try {
    console.log(user);
    await user.save();
    console.log("user saved");
  } catch (e) {
    res.status(400).send(e);
  }
});

//user login
router.post("/users/login", async (req, res) => {
  if (req) {
    console.log(chalk.green.bold("request recieved"));
  }
  try {
    const user = await User.findByCredentials(req.body.uid, req.body.password);

    if (!user) {
      res.send("user not found");
    }
    const token = await user.generateAuthToken();

    if (!token) {
      res.send("token not generated");
    }

    let type = user.role;
    console.log(token);
    res.send({ token, type });
  } catch (error) {
    res.status(401).send(error);
  }
});

//user logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

//user logout all
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  console.log("profile asked");
  res.status(202).send(req.user);
});

router.get("/users", auth, async (req, res) => {
  console.log("users asked");
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(401).send(error);
  }
});

//updateuser
router.patch("/users/:id", auth, async (req, res) => {
  console.log(req.body)
  const updates = Object.keys(req.body);
  // const allowedUpdates = ["name", "email", "password", "age", "role", "uid"];
  // const isValidOperation = updates.every((update) =>
  //   allowedUpdates.includes(update)
  // );

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: "Invalid updates!" });
  // }
  console.log(req.body);
  let user = req.user;

  if (req.user["role"] == "admin") {
    user = await User.findOne({
      _id: req.params.id,
    });
  }

  try {
    updates.forEach((update) => (user[update] = req.body[update]));
    console.log(user);
    await user.save();
    console.log("user saved")
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//delete user
router.delete("/users/:id", auth, async (req, res) => {
  console.log("delete requested", req.params.id)
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!user) {
      console.log("user not found", req.params.id)
      res.status(404).send();
    }
    user.remove();
    console.log("user removed") 
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/forgot-pass/otp", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    const resAuth = await Auth(email, "Company Name - Your UID " + user.uid);
    const OTP = resAuth.OTP;
    console.log(email);
    console.log(resAuth);
    console.log(OTP);
    user["otp"] = OTP.toString();
    const userUpdate1 = await user.save();
    console.log(userUpdate1);
    res.send({ success: resAuth.success });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/forgot-pass/reset", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.otp == req.body.otp) {
      user.password = req.body.password;
      await user.save();
      res.send({ success: true });
    } else {
      throw new error("OTP mismatch");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// router.get("/users-pop", auth, async (req, res) => {
//   try {
//     await req.user.populate("notices").execPopulate()
//     console.log(req.user);
//     res.status(200).send(req.user.notices);
//   } catch (e) {
//     res.status(500).send();
//   }
// })

export default router;
