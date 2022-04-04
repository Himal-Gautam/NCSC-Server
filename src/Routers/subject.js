import express from "express";
import Subject from "../models/subject.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
const router = new express.Router();

router.post("/subjects", auth, async (req, res) => {
  console.log(req.body)
  const subject = new Subject({
    ...req.body,
    teacher: req.user.name,
  });
  try {
    await subject.save();
    res.status(201).send(subject);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.get("/notices", auth, async (req, res) => {
//   // console.log(req.user, req.token);
//   try {
//     Notice.find({}).then(notices => 
//       res.send(notices)
//     );
//   } catch (e) {
//     res.status(500).send();
//   }
// });

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

// router.patch("/notices/:id", auth, async (req, res) => {
//   // const updates = Object.keys(req.body);
//   // const allowedUpdates = ["description", "title"];
//   // const isValidOperation = updates.every((update) =>
//   //   allowedUpdates.includes(update)
//   // );

//   // if (!isValidOperation) {
//   //   return res.status(400).send({ error: "Invalid updates!" });
//   // }

//   try {
//     const notice = await Notice.findOne({
//       _id: req.params.id
//       // owner: req.user._id,
//     });

//     // updates.forEach((update) => (task[update] = req.body[update]));
//     notice[title] = req.body[title]
//     notice[description] = req.body[description]
//     await notice.save();

//     if (!notice) {
//       return res.status(404).send();
//     }

//     res.send(notice);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// router.delete("/notices/:id", auth, async (req, res) => {
//   try {
//     const notice = await Notice.findOneAndDelete({
//       _id: req.params.id
//     });

//     if (!notice) {
//       res.status(404).send();
//     }
//     notice.remove();
//     res.send(notice);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// module.exports = router
export default router;
