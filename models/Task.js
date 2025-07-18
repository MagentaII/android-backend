const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    done: {type: Boolean, default: false},
    dueDate: {type: Date},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', taskSchema);