import express, { Application, Request, Response, NextFunction } from "express";
const {
  workoutController,
} = require("../../controller/koujou/workout.controller");
import authMiddleware from "../../middleware/auth.middleware";
import { withSupabase } from "../../middleware/auth.middleware";

const router = express.Router();

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // GET /v1/koujou/workouts - Alle Workouts abrufen
  router.get(
    "/workouts",
    authMiddleware,
    withSupabase,
    workoutController.getWorkouts
  );

  // GET /v1/koujou/workouts/:id - Einzelnes Workout mit Exercises
  router.get(
    "/workouts/:id",
    authMiddleware,
    withSupabase,
    workoutController.getWorkoutById
  );

  // POST /v1/koujou/workouts - Neues Workout erstellen
  router.post(
    "/workouts",
    authMiddleware,
    withSupabase,
    workoutController.createWorkout
  );

  // PUT /v1/koujou/workouts/:id - Workout aktualisieren
  router.put(
    "/workouts/:id",
    authMiddleware,
    withSupabase,
    workoutController.updateWorkout
  );

  // DELETE /v1/koujou/workouts/:id - Workout löschen
  router.delete(
    "/workouts/:id",
    authMiddleware,
    withSupabase,
    workoutController.deleteWorkout
  );

  // POST /v1/koujou/workouts/:id/copy - Workout duplizieren
  router.post(
    "/workouts/:id/copy",
    authMiddleware,
    withSupabase,
    workoutController.copyWorkout
  );

  // GET /v1/koujou/workouts/:id/sessions - Sessions eines Workouts
  router.get(
    "/workouts/:id/sessions",
    authMiddleware,
    withSupabase,
    workoutController.getWorkoutSessions
  );

  app.use("/v1/koujou", router);
};
