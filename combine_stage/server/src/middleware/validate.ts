import type { Request,Response,NextFunction } from 'express'; import { validationResult } from 'express-validator';
export function validateRequest(req:Request,res:Response,next:NextFunction):void {const result=validationResult(req);if(!result.isEmpty()){res.status(400).json({error:result.array().map(e=>({field:'path' in e?e.path:'request',message:e.msg}))});return;}next();}
