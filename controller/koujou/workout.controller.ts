import { Request, Response } from "express";
import { ReqWithSupabase } from "../../types/SupabaseClient";

const getWorkouts = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { user_id, weekday, from, to } = req.query;

    let query = supabase
      .from("koujou_workouts")
      .select("*, koujou_exercises(count)")
      .eq("user_id", user_id as string)
      .order("weekday", { ascending: true });

    if (weekday) {
      query = query.eq("weekday", Number(weekday));
    }

    if (from && to) {
      query = query.range(Number(from), Number(to));
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getWorkoutById = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { id } = req.params;
    const { user_id } = req.query;

    const { data, error } = await supabase
      .from("koujou_workouts")
      .select(
        `
        *,
        koujou_exercises(
          id,
          name,
          planned_sets,
          planned_reps,
          planned_weight,
          planned_rest_seconds,
          planned_notes,
          notes,
          created_at
        )
      `
      )
      .eq("id", id)
      .eq("user_id", user_id as string)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Workout not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createWorkout = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const body = req.body;

    // Validierung: weekday muss zwischen 1 und 7 sein
    if (body.weekday && (body.weekday < 1 || body.weekday > 7)) {
      return res.status(400).json({ error: "Weekday must be between 1 and 7" });
    }

    const { data, error } = await supabase
      .from("koujou_workouts")
      .insert(body)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateWorkout = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { id } = req.params;
    const body = req.body;
    const { user_id } = req.query;

    // Validierung: weekday muss zwischen 1 und 7 sein
    if (body.weekday && (body.weekday < 1 || body.weekday > 7)) {
      return res.status(400).json({ error: "Weekday must be between 1 and 7" });
    }

    const { data, error } = await supabase
      .from("koujou_workouts")
      .update(body)
      .eq("id", id)
      .eq("user_id", user_id as string)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Workout not found or not authorized" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteWorkout = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { id } = req.params;
    const { user_id } = req.query;

    const { data, error } = await supabase
      .from("koujou_workouts")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id as string)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Workout not found or not authorized" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const copyWorkout = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { id } = req.params;
    const { user_id } = req.query;

    // Original Workout laden
    const { data: originalWorkout, error: fetchError } = await supabase
      .from("koujou_workouts")
      .select(
        `
        *,
        koujou_exercises(*)
      `
      )
      .eq("id", id)
      .eq("user_id", user_id as string)
      .single();

    if (fetchError || !originalWorkout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    // Neues Workout erstellen
    const { data: newWorkout, error: createError } = await supabase
      .from("koujou_workouts")
      .insert({
        user_id: originalWorkout.user_id,
        name: `${originalWorkout.name} (Copy)`,
        weekday: originalWorkout.weekday,
      })
      .select()
      .single();

    if (createError || !newWorkout) {
      return res.status(400).json({ error: createError?.message || "Failed to create workout copy" });
    }

    // Exercises kopieren, falls vorhanden
    if (originalWorkout.koujou_exercises && originalWorkout.koujou_exercises.length > 0) {
      const exercisesToCopy = originalWorkout.koujou_exercises.map((exercise: any) => ({
        user_id: exercise.user_id,
        workout_id: newWorkout.id,
        name: exercise.name,
        planned_sets: exercise.planned_sets,
        planned_reps: exercise.planned_reps,
        planned_weight: exercise.planned_weight,
        planned_rest_seconds: exercise.planned_rest_seconds,
        planned_notes: exercise.planned_notes,
        notes: exercise.notes,
      }));

      const { error: exercisesError } = await supabase
        .from("koujou_exercises")
        .insert(exercisesToCopy);

      if (exercisesError) {
        console.error("Error copying exercises:", exercisesError.message);
      }
    }

    // Vollständiges Workout mit Exercises zurückgeben
    const { data: completeWorkout, error: finalError } = await supabase
      .from("koujou_workouts")
      .select(
        `
        *,
        koujou_exercises(*)
      `
      )
      .eq("id", newWorkout.id)
      .single();

    if (finalError) {
      return res.status(400).json({ error: finalError.message });
    }

    return res.status(201).json(completeWorkout);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getWorkoutSessions = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { id } = req.params;
    const { user_id, from, to } = req.query;

    let query = supabase
      .from("koujou_workout_sessions")
      .select("*")
      .eq("workout_id", id)
      .eq("user_id", user_id as string)
      .order("performed_at", { ascending: false });

    if (from) {
      query = query.gte("performed_at", from as string);
    }

    if (to) {
      query = query.lte("performed_at", to as string);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const workoutController = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  copyWorkout,
  getWorkoutSessions,
};