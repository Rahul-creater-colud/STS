import type { Response } from 'express';
export const data=(res:Response,value:unknown,status=200)=>res.status(status).json({data:value});
export const json=(doc:{toJSON:()=>unknown}|null)=>doc?.toJSON()??null;
export const jsonList=(docs:Array<{toJSON:()=>unknown}>)=>docs.map(x=>x.toJSON());
