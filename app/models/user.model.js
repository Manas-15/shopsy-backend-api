module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      firstname: {
        type: String,
        trim: true,
        required: true,
      },
      lastname: {
        type: String,
        trim: true,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        trim: true,
        required: true,
      },
      phone: {
        type: String,
        trim: true,
        required: true,
      },
      gender: {
        type: String,
        trim: true,
        required: true,
      },
      otp: {
        type: String,
        trim: true,
      },
      TempResetPassward: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );
  const user = mongoose.model("userDetails", userSchema);
  return user;
};
