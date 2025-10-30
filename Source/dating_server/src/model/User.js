const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  photos: [{ type: String }],
  aboutMe: { type: String },
});

// --- Sub-schema: Location ---
const LocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

// --- Sub-schema: Detail ---
const DetailSchema = new mongoose.Schema({
  height: { type: Number },
  interested: [{ type: String }],
  education: { type: String },
});

// --- Main User schema ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: [true, "Vui lòng nhập mật khẩu"],
    minlength: 6,
    select: false,
  },
  phone: { type: String },
  status: { type: Boolean, default: true },
  profile: ProfileSchema,
  location: LocationSchema,
  detail: DetailSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.index({ location: "2dsphere" });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = Date.now();
    next();
  } catch (err) {
    next(err);
  }
});
UserSchema.methods.comparePassword = async function (enteredPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);
