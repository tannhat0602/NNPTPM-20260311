var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users (chua bi xoa)
router.get('/', async function (req, res, next) {
    let data = await userModel.find({ isDeleted: false }).populate('role');
    res.send(data);
});

// GET user theo id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id).populate('role');
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// POST tao user moi
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role
        });
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
});

// POST kich hoat user (chuyen status -> true)
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let result = await userModel.findOne({ email: email, username: username, isDeleted: false });
        if (!result) {
            return res.status(404).send({ message: "Thong tin khong chinh xac" });
        }
        result.status = true;
        await result.save();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// POST vo hieu hoa user (chuyen status -> false)
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let result = await userModel.findOne({ email: email, username: username, isDeleted: false });
        if (!result) {
            return res.status(404).send({ message: "Thong tin khong chinh xac" });
        }
        result.status = false;
        await result.save();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// PUT cap nhat user theo id
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE xoa mem user theo id
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        result.isDeleted = true;
        await result.save();
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

module.exports = router;
