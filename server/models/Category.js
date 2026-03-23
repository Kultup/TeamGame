import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  isSpecial: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
export default Category;
