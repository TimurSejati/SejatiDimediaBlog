import Tag from "../models/tag.model.js";

const createTag = async (req, res, next) => {
  try {
    const tag = new Tag({
      title: req.body.title,
    });

    const createTag = await tag.save();
    return res.json(createTag);
  } catch (error) {
    next(error);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.tagId);

    if (!tag) {
      const error = new Error("Tag was not found");
      next(error);
      return;
    }

    const updated = await Tag.findByIdAndUpdate(
      tag._id,
      {
        $set: {
          title: req.body.title,
        },
      },
      { new: true }
    );

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOneAndDelete({
      _id: req.params.tagId,
    });

    if (!tag) {
      const error = new Error("Tag was not found");
      return next(error);
    }

    return res.json({
      message: "Tag is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

export { getAllTags, createTag, deleteTag, updateTag };
