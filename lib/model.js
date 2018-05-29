const mongoose = require('mongoose');
const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const RewardNodes = new Schema({
EWRA: String,
Username: String,
MNV:String,
Signed_Message:String
});

const NodeModel = mongoose.model('NodeSchema', RewardNodes);
module.exports = NodeModel;