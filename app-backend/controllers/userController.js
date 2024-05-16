const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = user => {
    return jwt.sign({userId: user.id, isAdmin: user.isAdmin},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    );
};

exports.registerUser = async (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);

    try {
        const count = await User.count();
        const isAdmin = count === 0;

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username:username,
            password: hashedPassword,
            isAdmin:isAdmin,
            isEnabled: false
        });
        res.status(201).send('User registered, awaiting activation');
    } catch (error) {
        res.status(500).send(error.message);
    }
}
;

exports.loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (!user) {
            console.log(user.username);
            return res.status(404).send('User not found');
        }
        if (!user.isEnabled) {
            return res.status(403).send('Account is disabled');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = generateToken(user);
        const userResponse = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            isEnabled: user.isEnabled,
            token
        }
        res.json(userResponse);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getUsers = async (req, res) => {
    console.log("OK");
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {isAdmin, isEnabled} = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
        if (isEnabled !== undefined) {
            user.isEnabled = isEnabled;
        }
        if (isAdmin !== undefined) {
            user.isAdmin = isAdmin;
        }

        await user.save();
        res.send('User account updated');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        console.log(user);

        if (!user) {
            return res.status(404).send('User not found');
        }

        await user.destroy();
        res.send('User account deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

