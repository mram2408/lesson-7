import CarsDBService from "../models/CarsDBService.mjs";
import { validationResult } from "express-validator";
import Car from "../models/Vehicle.mjs";

class CarController {
  static async autopark(req, res) {
    const carsList = await CarsDBService.getList();
    console.log(carsList[0]._id);

    res.render("autopark", { title: "Автопарк", carsList: carsList });
  }
  static createCar(req, res) {
    res.render("addCar", {
      title: "Додати новий автомобіль",
      errors: [],
      carData: {},
    });
  }
  static async addCar(req, res) {
    const data = req.body;
    const errors = validationResult(req);
    console.log("====errors====");
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(400).render("addCar", {
        title: "Додати новий автомобіль",
        errors: errors.array(),
        carData: data,
      });
    }

    const carData = { imgSrc: req.file.filename, ...req.body };
    await CarsDBService.create(carData);
    res.redirect("autopark");
  }
  static async deleteCar(req, res) {
    try {
      await CarsDBService.deleteById(req.body.id);
      res.redirect("/autopark");
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete car" });
    }
  }
  static async updateCarForm(req, res) {
    const carData = await CarsDBService.getById(req.params.id);
    res.render("addCar", {
      title: "Змінити дані про авто",
      errors: [],
      carData: carData,
    });
  }
  static async updateCar(req, res) {
    const carData = { imgSrc: req.file.filename, ...req.body };
    await CarsDBService.update(req.params.id, carData);
    res.redirect("/autopark");
  }
}

export default CarController;
