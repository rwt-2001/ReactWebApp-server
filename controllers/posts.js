import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
/*
Getting Posts
*/
export const getPosts = async (req, res) => {
    try {
        //Retrieve All Posts from DataBase and save into the const postMessages
        const postMessages = await PostMessage.find({}).sort({ createdAt: -1 });
        //If Retrieved successfully send a 200 http status code with postMessages object in json format
        res.status(200).json(postMessages);

    } catch (error) {
        //If NOT Retrieved successfully send a 404 http status code with error message in an object
        res.status(404).json({ message: error.message });
    }
}

/*
Creating Posts
*/
export const createPost = async (req, res) => {

    const postBody = req.body;
    if (postBody.message === "") {
        res.status(406)
        return
    }
    const newPost = new PostMessage({ ...postBody, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        /* If New Post is saved in database then we will respond to client side with status 201 (Req Success) along with new Post */
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        /* If not the send status 409 (req not successful) */

        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {

    const { id: _id } = req.params; //renamed id to _id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No Post with given id');
    }
    const post = req.body;
    const updatedpost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatePost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No Post with given id');
    }

    await PostMessage.findByIdAndRemove(id);
    res.json({ message: 'Post Deleted Successfully' });
}

export const likePost = async (req, res) => {

    const { id } = req.params;
    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No Post with given id');
    }
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        post.likes.push(req.userId);

    }
    else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
}
