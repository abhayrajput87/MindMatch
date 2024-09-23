import User from "../models/User.js";
import Post from "../models/Post.js";

/* CREATE */

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      locaction: user.locaction,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find(); //This will grab all the post of the users
    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* READ */

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find(); //This will grab all the post of the users
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* READ */

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); //This will grab all the post of the users
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; //TO get post id
    const { userId } = req.body; // It will get id of the who is liking the post
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId); //If a user liked the post we will remove it
    } else {
      post.likes.set(userId, true); //If a user not like the post we will add the user likes
    }

    //Now we are updadting the post whether it is liked or not
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* ADD COMMENT */
export const newComment = async (req, res) => {
  const { id } = req.params; //TO get post id
  const { userId } = req.body; // It will get id of the who is liking the post
  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorHandler("Post Not Found", 404));
  }

  if (post.comments.includes(req.userId)) {
    return next(new ErrorHandler("Already Commented", 500));
  }

  post.comments.push({
    user: req.userId,
    comment: req.body.comment,
  });

  await post.save();
  const posts = await Post.findById(id); //This will grab liked post
  res.status(200).json(posts);
  console.log(posts);
};
