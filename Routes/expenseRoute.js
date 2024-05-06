const express = require('express');
const router = express.Router();

const userModel = require("../Model/userModel");
const model = require("../Model/expenseModel");

router.get('/:username', async (req, res) => {
    try {
        const data = await model.find({username: req.params.username});
        res.json(data);
    } catch (error) {
        console.error("Error fetching Data:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/:username/:month', async (req, res) => {
    try {
        const data = await model.find({username: req.params.username, month: req.params.month});
        res.json(data);
    } catch (error) {
        console.error("Error fetching Data:", error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({username: req.body.username});
        if(user){
            const existingExpense = await model.findOne({ 
                username: req.body.username,
                category: req.body.category,
                month: req.body.month
            });

            if (existingExpense) {
                // Update existing expense record
                existingExpense.amount += parseInt(req.body.amount);
                await existingExpense.save();
                res.status(200).json({ "status": "Successfully updated existing Expense" });
            } else {
                // Create new expense entry
                const expenseEntry = new model(req.body);
                await expenseEntry.save();
                res.status(200).json({ "status": "Successfully added new Expense" });
            }
        }
        else{
            res.status(400).json({"error": "Invalid username"});
        }
    } catch (error) {
        console.error("Error adding data:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Validation Error', details: error.errors });
        } else {
            res.status(500).json({ error: 'Server Error' });
        }
    }
});

module.exports = router;