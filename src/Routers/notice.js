import express from "express";
import Notice from "../models/notice.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
const router = new express.Router();

router.post("/notices", auth, async (req, res) => {
  console.log(req.body);
  const notice = new Notice({
    ...req.body,
    owner: req.user.name,
  });
  try {
    await notice.save();
    res.status(201).send(notice);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/notices", auth, async (req, res) => {
  // console.log(req.user, req.token);
  try {
    Notice.find({}).then((notices) => res.send(notices));
  } catch (e) {
    res.status(500).send();
  }
});

// router.get('/notices/:id', auth, async (req, res) => {
//     const _id = req.params.id

//     try {
//         // const task = await Task.findById(_id)
//         const task = await Task.findOne({_id, owner: req.user._id})

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.patch("/notices/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  // const allowedUpdates = ["description", "title"];
  // const isValidOperation = updates.every((update) =>
  //   allowedUpdates.includes(update)
  // );

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: "Invalid updates!" });
  // }

  console.log(req.params.id, req.body);

  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
    });
    updates.forEach((update) => (notice[update] = req.body[update]));
    await notice.save();
    console.log("update completed");

    if (!notice) {
      return res.status(404).send();
    }

    res.send(notice);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/notices/:id", auth, async (req, res) => {
  try {
    const notice = await Notice.findOneAndDelete({
      _id: req.params.id,
    });

    if (!notice) {
      res.status(404).send();
    }
    notice.remove();
    res.status(200).send(notice);
  } catch (e) {
    res.status(500).send();
  }
});

// module.exports = router
export default router;
