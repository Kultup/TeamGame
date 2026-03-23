import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);
export default Question;
