const Blog = require("./../models/blogModel");
const APIFeatures = require("./../utils/apiFeatures");

// GET BLOGS HANDLER
const getAllBlogs = async (req, res, next) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Blog.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const blogs = await features.query;

    res.status(200).json({
      status: "success",
      result: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE BLOG
const getBlog = async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    if (blog.state !== "published") {
      return res.status(403).json({
        status: "fail",
        message: "Requested blog is not published",
      });
    }

    // INCREMENTING THE READ COUNT
    blog.readCount += 1;
    await blog.save();

    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};


// CREATE BLOG HANDLER
const createBlog = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;

    const newBlog = await Blog.create({
      title,
      description: description || title,
      tags,
      body,
      authorId: req.user._id,
      authorName: req.user.firstName,
    });
    
    res.status(201).json({
      status: "success",
      data: newBlog,
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE BLOG STATE
const updateBlogState = async (req, res, next) => {
  try {
    let  state  = req.body.state;
    const id = req.params.id;

    const oldBlog = await Blog.findById(id);

    // Checking if the user attempting to update is the author 
    if (req.user._id.toString() !== oldBlog.authorId._id.toString()) {
      return res.status(404).json({
        status: "fail",
        message: "You cannot edit as you're not the author",
      });
    }

    if (
      !(
        state &&
        (state.toLowerCase() === "published" || state.toLowerCase() === "draft")
      )
    ) {
      throw new Error("Please provide a valid state");
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { state: state.toLowerCase() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE BLOG
const updateBlog = async (req, res, next) => {
  try {
    let blogUpdate = { ...req.body };
    const id = req.params.id;

    if (blogUpdate.state) delete blogUpdate.state;

    const oldBlog = await Blog.findById(id);

    // Checking if the user attempting to update is the author
    if (req.user._id.toString() !== oldBlog.authorId._id.toString()) {
      return res.status(404).json({
        status: "fail",
        message: "You cannot edit as you're not the author",
      });
    }

    const blog = await Blog.findByIdAndUpdate(id, blogUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: blogUpdate,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldBlog = await Blog.findById(id);

    // Checking if the user attempting to delete is the author 
    if (req.user._id.toString() !== oldBlog.authorId._id.toString()) {
      return res.status(404).json({
        status: "fail",
        message: "You cannot delete as you're not the author",
      });
      // console.log(req.user._id.toString(), oldBlog.authorId._id.toString());
    }
    await Blog.findByIdAndRemove(id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlogState,
  updateBlog,
  deleteBlog,
};
