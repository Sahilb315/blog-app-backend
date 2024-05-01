import mongoose from "mongoose";
import bcrypt from "bcrypt";

//! author
const userSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: [6, "Password length must be at least 6 characters"],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
      bookmarks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",  
        default: [],
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// userSchema.virtual('bookmarksRef', {
//   ref: 'Blog',
//   localField: 'bookmarks',
//   foreignField: '_id',
//   populate: { path: 'bookmarks', model: 'Blog' },
// });


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

export { User };
