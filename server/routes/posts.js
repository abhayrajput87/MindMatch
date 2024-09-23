import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  newComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */

//To grab the feed posts when a user is on homepage
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/*UPDATE*/
router.patch("/:id/like", verifyToken, likePost);

router.post("/:id/comment", verifyToken, newComment);

export default router;
