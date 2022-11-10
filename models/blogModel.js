const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A blog must have a title"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    authorName: {
      type: String,
      ref: "User",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    state: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    readCount: {
      type: Number,
      default: 0,
    },
    readingTime: Number,
    tags: [String],
    body: {
      type: String,
      required: [true, "A blog must have a body"],
    },
  },
  { timestamps: true }
);

const estimatedReadingTime = (blogPost) => {
  const numberOfWords = blogPost.split(" ").length;
  // Assume an average person reads 200 words per minute
  const wordsPerMinute = numberOfWords / 200;
  return Math.round(wordsPerMinute) === 0 ? 1 : Math.round(wordsPerMinute);
};

blogSchema.pre("save", function (next) {
  let blog = this;

  // calculate time in minutes
  const timeToRead = estimatedReadingTime(this.body);

  blog.readingTime = timeToRead;
  next();
});

// Calculate reading time before updating document
blogSchema.pre("findOneAndUpdate", function (next) {
  let blog = this._update;

  // calculate the time in minutes
  if (blog.body) {
    const timeToRead = estimatedReadingTime(blog.body);
    blog.reading_time = timeToRead;
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
