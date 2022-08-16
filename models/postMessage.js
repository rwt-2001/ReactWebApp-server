import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    name: String,
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

//PostMessage Model
const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
