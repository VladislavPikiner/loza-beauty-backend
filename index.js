import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  RecordController,
  ServiceController,
  LoginController,
  VacationController,
} from "./src/controllers/index.js";
import authCheck from "./src/authCheck.js";

mongoose
  .connect(
    "mongodb+srv://Pikinerius:74942270@loza.mvctolg.mongodb.net/records?retryWrites=true&w=majority"
  )
  .then(console.log("Success connection to DB!"))
  .catch((err) => console.error(err));

const app = express();

app.use(cors());
app.use(express.json());

app.post("/record", RecordController.create);
app.get("/record", RecordController.getAllRecords);

app.post("/time", RecordController.getRecordsOnDate);

app.get("/work", authCheck, RecordController.getAvailableRecords);
app.delete("/work/:id", authCheck, RecordController.deleteRecord);

app.post("/service", authCheck, ServiceController.create);
app.get("/service", ServiceController.getServices);
app.patch("/service", ServiceController.availableSwitcher);
app.delete("/service/:id", authCheck, ServiceController.deleteService);

app.get("/login", LoginController.getAllAdmins);
app.post("/login", LoginController.login);

app.post("/register", LoginController.register);

app.post(
  "/schedules",
  VacationController.getVacations,
  ServiceController.getAvailableTime
);
app.get("/schedules", RecordController.unavailableTime);

app.post("/vacations", VacationController.createVacations);
app.get("/vacations", VacationController.getVacations);

const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
  err
    ? console.error("Server fall " + err)
    : console.log("Server start on " + PORT);
});
