import { Router } from "express";
const router = Router();

import CarValidator from "../models/carValidator.mjs";
import { checkSchema } from "express-validator";

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

import CarController from "../controllers/carController.mjs";

router.get("/", CarController.autopark);
router.get("/addcar", CarController.createCar);
router.post(
  "/",
  upload.single("photo"),
  checkSchema(CarValidator.carSchema),
  CarController.addCar
);
router.delete("/deleteCar", CarController.deleteCar);
router.get("/edit/:id", CarController.updateCarForm);
router.post(
  "/edit/:id",
  upload.single("photo"),
  checkSchema(CarValidator.carSchema),
  CarController.updateCar
);

export default router;
