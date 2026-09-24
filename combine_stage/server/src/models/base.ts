import { Schema } from 'mongoose';
export function withIdTransform(schema:Schema):Schema {
  schema.set('toJSON',{virtuals:true,versionKey:false,transform:(_doc,ret)=>{ret.id=String(ret._id);delete ret._id;}});
  schema.set('toObject',{virtuals:true,versionKey:false,transform:(_doc,ret)=>{ret.id=String(ret._id);delete ret._id;}});
  return schema;
}
