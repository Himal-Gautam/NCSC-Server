import express from "express";
import Subject from "../models/subject.js";
import auth from "../middleware/auth.js";
const router = new express.Router();

router.post("/subjects", auth, async (req, res) => {
  console.log(req.body);
  const subject = new Subject(req.body);
  try {
    await subject.save();
    res.status(201).send(subject);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/subjects", auth, async (req, res) => {
  try {
    Subject.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: "$teacher",
      },
    ]).then((subjects) => res.send(subjects));
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

router.patch("/subjects/:id", auth, async (req, res) => {
  console.log("request recieved")
  const updates = Object.keys(req.body);

  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
    });
    console.log(subject)

    updates.forEach((update) => (subject[update] = req.body[update]));

    console.log(subject)

    await subject.save();

    if (!subject) {
      return res.status(404).send();
    }

    res.send(subject);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/subjects/:id", auth, async (req, res) => {
  console.log("requestrecieved");
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
    });
    console.log("SUJECT FOUND");
    if (!subject) {
      res.status(404).send();
    }
    subject.remove();
    res.send(subject);
  } catch (e) {
    res.status(500).send();
  }
});

// module.exports = router
export default router;
