const getAllUsers = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "all users goes here",
    });
  };
  
  const getUSer = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "a single user",
    });
  };
  
  const createUser = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "create new user",
    });
  };
  
  const updateUser = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "update a blog",
    });
  };
  
  const deleteUSer = (req, res) => {
    res.status(200).json({
      status: "success",
      data: "delete a user",
    });
  };
  
  module.exports = {
    getAllUsers,
    getUSer,
    createUser,
    updateUser,
    deleteUSer,
  };
  