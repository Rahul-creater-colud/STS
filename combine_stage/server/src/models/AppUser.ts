import { model, Schema } from 'mongoose';
import { withIdTransform } from './base.js';

const schema = withIdTransform(new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['admin', 'donor', 'ngo', 'volunteer'], required: true },
  passwordSalt: { type: String, required: true, select: false },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true }));

schema.index({ email: 1 }, { unique: true });
export default model('AppUser', schema);
