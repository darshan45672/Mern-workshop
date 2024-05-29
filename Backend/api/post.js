const express = require("express");
const router = express.Router();

const blogPost = require("../schema/blogPostSchema");

router.post("/insert", async (req, res) => {
  const { title, content, author } = req.body;
  // Find the maximum postid in the collection
  blogPost
    .findOne({}, {}, { sort: { postId: -1 } })
    .then((latestPost) => {
      let newPostId = 1;
      if (latestPost) {
        newPostId = latestPost.postId + 1;
      }

      const post = new blogPost({
        postId: newPostId,
        title: title,
        content: content,
        author: author,
      });

      post
        .save()
        .then((savedPost) => {
          res.status(201).json(savedPost);
          console.log("Post saved successfully");
        })
        .catch(() => {
          res.status(500).json({ error: "Error saving post" });
          console.log("Error saving post");
        });
    }) 
    .catch(() => {
      res.status(500).json({ error: "Error retrieving latest post" });
    });
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await blogPost.find();

    console.log(posts);
    console.log("Posts retrieved successfully");

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error retrieving posts");
    console.log(error);
    res.status(500).json({ error: "Error retrieving posts" });
  }
});

router.get('/post/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    blogPost.find({ postId: postId })
      .then((post) => {
        console.log(post);
        console.log('Post retrieved successfully');
        return res.status(200).json(post);
      })
      .catch(() => {
        console.log('Error retrieving post');
        res.status(500).json({ error: 'Error retrieving post' });
      });
    }catch (error) {
      console.log("Error retrieving post");
      console.log(error);
      res.status(500).json({ error: 'Error retrieving post' });
    }
});

router.delete('/delete/:id', async (req, res) => {
  console.log("called delete");
  const postId = req.params.id;

  try {
    const blogPostByID = await blogPost.findOne({ postId: postId });
    if (!blogPostByID) {
      return res.status(404).json({ error: 'Post not found' });
    }
    else{
      blogPost.findOneAndDelete({ postId: postId }).then((deletedPost) => {
        console.log(deletedPost);
        if (!deletedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }
        console.log('Post deleted successfully');
        return res.status(200).json(deletedPost);
      })
    }
  }catch(error){
    console.log("Error deleting post");
    console.log(error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

router.put('/update/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content, author } = req.body;

  try {
    const blogPostByID = await blogPost.findOne({ postId: postId });
    if (!blogPostByID) {
      return res.status(404).json({ error: 'Post not found' });
    }
    else{
      blogPost.findOneAndUpdate({ postId: postId }, { title: title, content: content, author: author }, { new: true }).then((updatedPost) => {
        console.log(updatedPost);
        if (!updatedPost) {
          return res.status(404).json({ error: 'Post not found' });
        }
        console.log('Post updated successfully');
        return res.status(200).json(updatedPost);
      })
    }
  }catch(error){
    console.log("Error updating post");
    console.log(error);
    res.status(500).json({ error: 'Error updating post' });
  }
});

module.exports = router;
