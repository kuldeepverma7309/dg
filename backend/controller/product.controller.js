import { TryCatch } from "@kuldeepverma/errorhandler";
import { Product } from "../model/product.model.js";

export const createProduct = TryCatch(async(req,res,next)=>{
    req.body.user = req.id;
    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    });
})