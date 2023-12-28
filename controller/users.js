import users from "../models/usersModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
    try {
        const Users = await users.findAll({
            attributes:['id', 'name', 'email']
        });
        res.json(Users);
    } catch (error) {
        console.log(error)
    }
}

export const register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "password dan confirm password tidak cocok" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({ msg: "register berhasil" })
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await users.findOne({
            where: {
                email: req.body.email
            }
        });
        console.log(JSON.stringify(user, null, 2))
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) return res.status(400).json({ msg: 'wrong password' });
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        console.log(userId)
        console.log(name)
        console.log(email)
        console.log(match)
        console.log(refreshToken)
        console.log(accessToken)
        await users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refresh token'.refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.json({ accessToken })
    } catch (error) {
        res.status(404).json({ msg: 'email tidak ditemukan' })
    }
}