import mongoose from 'mongoose';

const exhibitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imageProducts: [{ type: String, required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Exhibition =
  mongoose.models.Exhibition || mongoose.model('Exhibition', exhibitionSchema);

export default Exhibition;
