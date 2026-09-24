import { model, Schema } from 'mongoose'; import { withIdTransform } from './base.js';
const schema=withIdTransform(new Schema({title:{type:String,required:true},message:{type:String,required:true},timestamp:{type:String,default:()=>new Date().toISOString()},type:{type:String,enum:['match','dispatch','pickup','delivery','urgent'],required:true},read:{type:Boolean,default:false},actionUrl:String}));
schema.index({read:1,timestamp:-1}); export default model<any>('AppNotification',schema);
