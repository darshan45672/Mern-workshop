/* eslint-disable no-undef */
const express = require('express');
const app = express();
const cors = require('cors');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('./connection');
connectDB();
const blogPost = require('./blogPostSchema');

const port = 3001;

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});