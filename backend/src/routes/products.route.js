import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createProduct,
  listAllProducts,
} from "../controllers/product.controller.js";
import { createProductValidator } from "../validators/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 1 * 1024 * 1024,
  },
});

const router = Router();

/**
 * @method POST
 * @route /api/products/
 * @description creates the product and save its data into the DB, images will be store on imagekit.
 * req.body=>{title,description:price:{amount,currency},sizes:[{size,stock},{size,stock}]}
 */

router.post(
  "/",
  // –––––––––––––– check is user authenticate ––––––––––––––––––––
  authenticate,
  // –––––––––––––– check the role is seller or not ––––––––––––––––––––
  (req, res, next) => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "user is not authorize to create products",
      });
    }
    next();
  },
  // –––––––––––––– required for reading the data from req.body if the formate is form-data(multipart-form-data) ––––––––––––––––––––
  upload.array("images"),
  // –––––––––––––– parse the complex data like object and array into json ––––––––––––––––––––
  (req, res, next) => {
    try {
      if (typeof req.body.price === "string") {
        req.body.price = JSON.parse(req.body.price);
      }
      if (typeof req.body.sizes === "string") {
        req.body.sizes = JSON.parse(req.body.sizes);
      }
      next();
    } catch {
      return res.status(400).json({
        message: "price and sizes must be valid JSON",
      });
    }
  },
  createProductValidator,
  createProduct,
);

/**
 * @method GET
 * @route /api/product
 * @description Read all the products from the DB
 * @access user
 */

router.get("/", authenticate, listAllProducts);

export default router;
