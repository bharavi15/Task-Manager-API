const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res, next) => {
	const task = new Task({
		...req.body,
		owner: req.user._id
	})
	try {
		await task.save()
		res.status(201).send(task)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
})
//GET /tasks
//GET /tasks?sortBy=createdAt_desc
//GET /tasks?limit=5&skip=5
//GET /tasks?completed=true

router.get('/tasks', auth, async (req, res) => {
	const match = {},
		sort = {}
	if (req.query.completed) {
		match.completed = req.query.completed === 'true'
	}
	if (req.query.sortBy) {
		const parts = req.query.sortBy.split('_')
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	}
	try {
		//const tasks = await Task.find({owner:req.user._id})
		await req.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort
			}
		}).execPopulate()
		res.status(200).send(req.user.tasks);
	} catch (error) {
		res.status(500).send(error)
	}
})

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		//const task = await Task.findById(_id)
		const task = await Task.findOne({
			_id,
			owner: req.user._id
		})
		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(404).send();
	}
})


router.patch('/tasks/:id', auth, async (req, res, next) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	if (!isValidOperation) {
		return res.status(400).send({
			error: 'Invalid field present'
		});
	}
	try {
		// const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
		//     new: true,
		//     runValidators: true
		// })
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id
		})
		//const task = await Task.findById(req.params.id)
		if (!task) {
			return res.status(404).send();
		}
		updates.forEach((update) => task[update] = req.body[update])
		await task.save()

		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(400).send(error)
	}
})

router.delete('/tasks/:id', auth, async (req, res, next) => {
	try {
		const task = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id
		});

		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(400).send(error)
	}
})

module.exports = router