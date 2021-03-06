import express from "express";
import Assignment from "../models/assignment.js";
import Subject from "../models/subject.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
const router = new express.Router();

router.post("/assignments", auth, async (req, res) => {
  console.log("request recieved")
  console.log(req.body);
  const assignment = new Assignment({
    ...req.body,
    teacher: req.user._id,
  });
  console.log("assignment generated", assignment)
  try {
    await assignment.save();
    console.log("assignment saved")
    // res.status(201).send(assignment);
    res.status(201).send(assignment);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/assignments", auth, async (req, res) => {
  // console.log(req.user, req.token);
  try {
    Assignment.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },{
        $lookup: {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: "$teacher",
      },
    ]).then((notices) => res.send(notices));
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

// router.patch("/notices/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   console.log(req.params.id, req.body);

//   try {
//     const notice = await Notice.findOne({
//       _id: req.params.id,
//     });
//     updates.forEach((update) => (notice[update] = req.body[update]));
//     await notice.save();
//     console.log("update completed");

//     if (!notice) {
//       return res.status(404).send();
//     }

//     res.send(notice);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.delete("/assignments/:id", auth, async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
    });

    if (!assignment) {
      res.status(404).send();
    }
    assignment.remove();
    res.status(200).send(assignment);
  } catch (e) {
    res.status(500).send();
  }
});

// module.exports = router
export default router;
