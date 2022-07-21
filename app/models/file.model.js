module.exports = mongoose => {
    const userSchema = new mongoose.Schema({
            originalName: {
                type: String,
            },
            storage: {
                type: String,
            },
            link: {
                type: String,
            },
            size: {
                type: Number,
            },
            uniqueCode: {
                type: String,
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user.model',
            },

        }, {
            timestamps: true
        }

    )
    const user = mongoose.model("files", userSchema);
    return user;
};