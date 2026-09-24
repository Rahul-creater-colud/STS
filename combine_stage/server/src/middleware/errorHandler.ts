import type { Request,Response,NextFunction } from 'express';
export class HttpError extends Error {constructor(public status:number,message:string){super(message);this.name='HttpError';}}
export function notFound(_req:Request,res:Response):void{res.status(404).json({error:'Not found'});}
export function errorHandler(err:Error|HttpError,_req:Request,res:Response,_next:NextFunction):void {console.error(err);const status=err instanceof HttpError?err.status:500;res.status(status).json({error:status===500?'Internal server error':err.message});}
