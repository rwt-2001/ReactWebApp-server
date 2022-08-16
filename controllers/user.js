import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signIn = async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
        //If there is no password then the user is a google user and hasn't create a password
        if (!existingUser.password) {
            return res.status(500).json({ message: "Please Sign In using Google" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const token = jwt.sign({ email: existingUser.email, name: existingUser.name, id: existingUser._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }

}
export const signUp = async (req, res) => {
    const { password, firstName, lastName, confirmPassword } = req.body;
    const email = req.body.email.toLowerCase();
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exist" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords not matched" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, name: result.name, id: result._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result, token });

    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const googleSignIn = async (req, res) => {
    const { password, picture, firstName, lastName } = req.body;
    const email = req.body.email.toLowerCase();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const token = jwt.sign({ email: existingUser.email, name: existingUser.name, id: existingUser._id }, 'test', { expiresIn: "1h" });
            res.status(200).json({ result: existingUser, token });
        }
        else {
            const newUser = await User.create({ email, password, name: `${firstName} ${lastName}`, picture });
            const token = jwt.sign({ email: newUser.email, name: newUser.name, id: newUser._id }, 'test', { expiresIn: "1h" });
            res.status(200).json({ result: newUser, token });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}