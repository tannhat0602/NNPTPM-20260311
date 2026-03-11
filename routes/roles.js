var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles (chua bi xoa)
router.get('/', async function (req, res, next) {
    let data = await roleModel.find({ isDeleted: false });
    res.send(data);
});

// GET role theo id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// GET tat ca user co role la :id
router.get('/:id/users', async function (req, res, next) {
    try {
        let id = req.params.id;
        let role = await roleModel.findById(id);
        if (!role || role.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        let users = await userModel.find({ role: id, isDeleted: false }).populate('role');
        res.send(users);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// POST tao role moi
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send(error);
    }
});

// PUT cap nhat role theo id
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE xoa mem role theo id
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
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
