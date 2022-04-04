import express from "express";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import { request } from "express";
import chalk from "chalk";
const router = new express.Router();

const success = true;

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  console.log("request recieved");
  try {
    console.log(user);
    await user.save();
    console.log("user saved");

    // const token = await user.generateAuthToken()
    // res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e);
  }
});

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
  res.status(202).send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

export default router;
