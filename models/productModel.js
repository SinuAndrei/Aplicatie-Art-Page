import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artType: { type: String, required: true },
  image: { type: String, required: true },
  coLLection: { type: String },
  description: { type: String, required: true },
  fabricationYear: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
