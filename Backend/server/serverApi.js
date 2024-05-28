const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser')

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('../connection/connection');
connectDB();
const blogPost = require('../schema/blogPostSchema');
const user = require('../schema/userSchema');

// console.log(dotenv.parsed);

const port = process.env.PORT || 3001;

// console.log(port);

app.post('/insert', async (req, res) => {
    const { title, content, author } = req.body;
    // Find the maximum postid in the collection
    blogPost.findOne({}, {}, { sort: { postId: -1 } })
      .then((latestPost) => {
        let newPostId = 1;
        if (latestPost) {
          newPostId = latestPost.postId + 1;
        }
    
    const post = new blogPost({
      postId: newPostId,
      title: title,
      content: content,
      author: author
    });
  
    post.save()
          .then((savedPost) => {
            res.status(201).json(savedPost);
            console.log('Post saved successfully');
          })
          .catch(() => {
            res.status(500).json({ error: 'Error saving post' });
            console.log('Error saving post');
          });
      })
      .catch(() => {
        res.status(500).json({ error: 'Error retrieving latest post' });
    });
  });

app.get('/read', async (req, res) => {
  try {
    const posts = await blogPost.find();

    console.log(posts);
    console.log('Posts retrieved successfully');

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error retrieving posts");
    console.log(error);
    res.status(500).json({ error: 'Error retrieving posts' });
  }
});

app.get('/read/:id', async (req, res) => {
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

app.delete('/delete/:id', async (req, res) => {
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

app.put('/update/:id', async (req, res) => {
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

app.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;

  const userExists = await user.findOne({ email: email });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const newUser = new user({
    userName: userName,
    email: email,
    password: password
  });
   newUser.save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
      console.log('User saved successfully');
    })
    .catch(() => {
      res.status(500).json({ error: 'Error saving user' });
      console.log('Error saving user');
    });
  });

app.get('/users', async (req, res) => {
  try {
    const users = await user.find();

    console.log(users);
    console.log('Users retrieved successfully');

    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users");
    console.log(error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

app.put('/updateUser/:id', async (req, res) => {
  // const userId = req.params.id;
  const { userName, email, password } = req.body;

  try {
    const userByEmail = await user.findOne({ email: email });
    if (!userByEmail) {
      return res.status(404).json({ error: 'User not found' });
    }
    else{
      user.findOneAndUpdate({ }, { userName: userName, email: email, password: password }, { new: true }).then((updatedUser) => {
        console.log(updatedUser);
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        console.log('User updated successfully');
        return res.status(200).json(updatedUser);
      })
    }
  }catch(error){
    console.log("Error updating user");
    console.log(error);
    res.status(500).json({ error: 'Error updating user' });
  };
});

app.delete('/deleteUser/:id', async (req, res) => {
  const userId = req.params.id;
  const { email } = req.body;
  try {
    const userByEmail = await user.findOne({ email : email });
    if (!userByEmail) {
      return res.status(404).json({ error: 'User not found' });
    }
    else{
      user.findOneAndDelete({ email : email }).then((deletedUser) => {
        console.log(deletedUser);
        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        console.log('User deleted successfully');
        return res.status(200).json(deletedUser);
      })
    }
  }catch(error){
    console.log("Error deleting user");
    console.log(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userByEmail = await user.findOne({ email: email }); 
    if (!userByEmail) {
      return res.status(404).json({ error: 'User not found' });
    }
    else{
      if (userByEmail.password === password) {
        console.log('User logged in successfully');
        return res.status(200).json(userByEmail);
      }
      else{
        return res.status(404).json({ error: 'Incorrect password' });
      }
    } 
  }catch(error){
    console.log("Error logging in user");
    console.log(error);
    res.status(500).json({ error: 'Error logging in user' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});