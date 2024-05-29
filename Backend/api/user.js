const express = require("express");
const router = express.Router();

const user = require("../schema/userSchema");

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  const userExists = await user.findOne({ email: email });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }
  user
    .findOne({}, {}, { sort: { userId: -1 } })
    .then((latestUserId) => {
      let newUserId = 1;
      if (latestUserId) {
        newUserId = latestUserId.userId + 1;
      }
      const newUser = new user({
        userId: newUserId,
        userName: userName,
        email: email,
        password: password,
      });
      newUser
        .save()
        .then((savedUser) => {
          res.status(201).json(savedUser);
          console.log("User saved successfully");
        })
        .catch(() => {
          res.status(500).json({ error: "Error saving user" });
          console.log("Error saving user");
        });
    }) 
    .catch(() => {
      res.status(500).json({ error: "Error retrieving latest user" });
    });
});

router.get("/users", async (req, res) => {
  try {
    const users = await user.find();

    console.log(users);
    console.log("Users retrieved successfully");

    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users");
    console.log(error);
    res.status(500).json({ error: "Error retrieving users" });
  }
});

router.put("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("called");
  const { userName, email, password } = req.body;
console.log(userId, userName, email, password);
  try {
    const userById = await user.findOne({ userId: userId });
    if (!userById) {
      return res.status(404).json({ error: "User not found" });
    } else {
      user
        .findOneAndUpdate(
          {},
          { userName: userName, email: email, password: password },
          { new: true }
        )
        .then((updatedUser) => {
          console.log(updatedUser);
          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }
          console.log("User updated successfully");
          return res.status(200).json(updatedUser);
        });
    }
  } catch (error) {
    console.log("Error updating user");
    console.log(error);
    res.status(500).json({ error: "Error updating user" });
  }
});

router.delete('/deleteUser/:id', async (req, res) => {
    console.log("called delete");
    const userId = req.params.id;
    const { email } = req.body;
    try {
      const userById = await user.findOne({ userId : userId  });
      if (!userById) {
        return res.status(404).json({ error: 'User not found' });
      }
      else{
        user.findOneAndDelete({ userId : userId }).then((deletedUser) => {
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

  router.post('/login', async (req, res) => {
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
  

module.exports = router;
