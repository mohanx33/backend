const mongoose = require("mongoose");
const Blog = require("../Schema/blogSchema");
const Upload = require("../Schema/fileSchema");

exports.addBlog = (req, res) => {
  const { author, postedDate, blogHeading, blogBody } = req.body;

  const blogData = new Blog({
    author: author,
    postedDate: postedDate,
    blogHeading: blogHeading,
    blogBody: blogBody,
  });
  blogData
    .save()
    .then((data) => {
      if (!data) {
        return res.status(400).json({ error: "Error" });
      }
      return res.status(200).json({
        id: data.id,
        author: author,
        postedDate: postedDate,
        blogHeading: blogHeading,
        blogBody: blogBody,
      });
    })
    .catch((error) => {
      console.error("Error Adding Blog", error);
      res.status(500).send(`Error Adding Blog.${error}`);
    });
};

exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author");

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ error: "No Data Found" });
    }

    const blogsWithProfilePictures = await Promise.all(
      blogs.map(async (blog) => {
        const author = blog.author.toObject();
        if (author.profilePicture) {
          const upload = await Upload.findById(author.profilePicture);
          if (upload) {
            author.profilePictureUrl = upload.path;
          }
        }
        return { ...blog.toObject(), author };
      })
    );

    res.status(200).json(blogsWithProfilePictures);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const author = blog.author.toObject();
    if (author.profilePicture) {
      const upload = await Upload.findById(author.profilePicture);
      if (upload) {
        author.profilePictureUrl = upload.path;
      }
    }

    return res.status(200).json({ ...blog.toObject(), author });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllBlogByAuthorId = async (req, res) => {
  try {
    const authorId = req.params.id;
    const blogs = await Blog.find({ author: authorId }).populate("author");

    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "Blogs not found for the author" });
    }

    const blogsWithProfilePictures = await Promise.all(
      blogs.map(async (blog) => {
        const author = blog.author.toObject();
        if (author.profilePicture) {
          const upload = await Upload.findById(author.profilePicture);
          if (upload) {
            author.profilePictureUrl = upload.path;
          }
        }
        return { ...blog.toObject(), author };
      })
    );

    return res.status(200).json(blogsWithProfilePictures);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateBlog = (req, res) => {
  const blogId = req.params.id;
  const { postedDate, blogHeading, blogBody } = req.body;
  const authorId = req.user.user_id;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }
  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      if (blog.author.toString() !== authorId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this blog post" });
      }
      const updateObject = {};

      if (postedDate) updateObject.postedDate = postedDate;
      if (blogHeading) updateObject.blogHeading = blogHeading;
      if (blogBody) updateObject.blogBody = blogBody;

      // Update the blog post
      return Blog.findByIdAndUpdate(blogId, updateObject, { new: true });
    })
    .then((result) => {
      if (res.statusCode === 403 || res.statusCode === 404) return;
      if (!result) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error in update blog ", error);
      return res.status(500).send(`Error in updating blog.${error}`);
    });
};
