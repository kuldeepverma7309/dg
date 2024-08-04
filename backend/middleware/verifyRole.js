import { TryCatch } from "@kuldeepverma/errorhandler";
import { User } from "../model/user.model.js";

export const verifyRole = TryCatch(async (req, res, next)=>{
    const user = await User.findById(req.id)
    if(user.role === 'admin'){
        next();
    }
    else{
        res.status(403).json({message: 'Access Denied'});
    }
})