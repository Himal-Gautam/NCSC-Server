import express from "express";
import Notice from "../models/notice.js";
import User from "../models/user.js";
import AssignmentSubmission from "../models/assignmentSubmit.js";
import auth from "../middleware/auth.js";
const router = new express.Router();

router.post("/assignment-submission", auth, async (req, res) => {
  console.log(req.file);
  const assignment = new AssignmentSubmission({
    subject: req.body.subject,
    student: req.user._id,
    file: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }})
  try {
    await assignemnt.save();
    res.status(201).send(notice);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/assignment-submission", auth, async (req, res) => {
  try {
    AssignmentSubmission.find({}).then((assignments) => res.send(assignments));
  } catch (e) {
    res.status(500).send();
  }
});

// router.get("/notices", auth, async (req, res) => {
//   // console.log(req.user, req.token);
//   try {
//     Notice.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "owner",
//           foreignField: "_id",
//           as: "owner_info",
//         },
//       },
//       {
//         $unwind: "$owner_info",
//       },
//     ]).then((notices) => res.send(notices));
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
//   const updates = Object.keys(req.body);
//   // const allowedUpdates = ["description", "title"];
//   // const isValidOperation = updates.every((update) =>
//   //   allowedUpdates.includes(update)
//   // );

//   // if (!isValidOperation) {
//   //   return res.status(400).send({ error: "Invalid updates!" });
//   // }

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

// router.delete("/notices/:id", auth, async (req, res) => {
//   try {
//     const notice = await Notice.findOneAndDelete({
//       _id: req.params.id,
//     });

//     if (!notice) {
//       res.status(404).send();
//     }
//     notice.remove();
//     res.status(200).send(notice);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

export default router;
