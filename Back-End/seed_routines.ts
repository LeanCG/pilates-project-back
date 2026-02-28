/**
 * Seed script for Pilates routines.
 * Creates predefined class routines and links them to exercises from the catalog.
 * IMPORTANT: Run seed_exercises.ts FIRST so the exercise IDs exist.
 *
 * Run: npx tsx seed_routines.ts
 */
import { db } from "./src/connect.js";
import util from "util";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

interface RoutineExercise {
    /** The 'descripcion' of the exercise (used to look up its ID). */
    name: string;
    series: number;
    repeticiones: number;
    orden: number;
    descanso: number;
    numeroDia: number;
}

interface RoutineSeed {
    descripcion: string;
    exercises: RoutineExercise[];
}

const routines: RoutineSeed[] = [
    {
        descripcion: "Pilates Mat Principiante",
        exercises: [
            { name: "Cat-Cow (Gato-Vaca)", series: 2, repeticiones: 8, orden: 1, descanso: 15, numeroDia: 1 },
            { name: "The Hundred", series: 1, repeticiones: 100, orden: 2, descanso: 30, numeroDia: 1 },
            { name: "Roll Up", series: 3, repeticiones: 8, orden: 3, descanso: 20, numeroDia: 1 },
            { name: "Single Leg Circle", series: 2, repeticiones: 8, orden: 4, descanso: 15, numeroDia: 1 },
            { name: "Rolling Like a Ball", series: 3, repeticiones: 8, orden: 5, descanso: 15, numeroDia: 1 },
            { name: "Single Leg Stretch", series: 2, repeticiones: 10, orden: 6, descanso: 15, numeroDia: 1 },
            { name: "Double Leg Stretch", series: 2, repeticiones: 8, orden: 7, descanso: 20, numeroDia: 1 },
            { name: "Spine Stretch Forward", series: 3, repeticiones: 6, orden: 8, descanso: 15, numeroDia: 1 },
            { name: "Seal", series: 3, repeticiones: 8, orden: 9, descanso: 15, numeroDia: 1 },
        ],
    },
    {
        descripcion: "Pilates Mat Intermedio",
        exercises: [
            { name: "The Hundred", series: 1, repeticiones: 100, orden: 1, descanso: 30, numeroDia: 1 },
            { name: "Roll Up", series: 3, repeticiones: 10, orden: 2, descanso: 20, numeroDia: 1 },
            { name: "Roll Over", series: 3, repeticiones: 6, orden: 3, descanso: 20, numeroDia: 1 },
            { name: "Open Leg Rocker", series: 3, repeticiones: 8, orden: 4, descanso: 20, numeroDia: 1 },
            { name: "Corkscrew", series: 3, repeticiones: 6, orden: 5, descanso: 20, numeroDia: 1 },
            { name: "Saw", series: 3, repeticiones: 8, orden: 6, descanso: 15, numeroDia: 1 },
            { name: "Swan Dive", series: 3, repeticiones: 6, orden: 7, descanso: 20, numeroDia: 1 },
            { name: "Criss Cross", series: 3, repeticiones: 10, orden: 8, descanso: 15, numeroDia: 1 },
            { name: "Shoulder Bridge", series: 3, repeticiones: 8, orden: 9, descanso: 20, numeroDia: 1 },
            { name: "Swimming", series: 3, repeticiones: 10, orden: 10, descanso: 20, numeroDia: 1 },
            { name: "Push Up Pilates", series: 3, repeticiones: 8, orden: 11, descanso: 20, numeroDia: 1 },
        ],
    },
    {
        descripcion: "Pilates Mat Avanzado",
        exercises: [
            { name: "The Hundred", series: 1, repeticiones: 100, orden: 1, descanso: 20, numeroDia: 1 },
            { name: "Roll Over", series: 3, repeticiones: 8, orden: 2, descanso: 15, numeroDia: 1 },
            { name: "Neck Pull", series: 3, repeticiones: 8, orden: 3, descanso: 15, numeroDia: 1 },
            { name: "Scissors", series: 3, repeticiones: 10, orden: 4, descanso: 15, numeroDia: 1 },
            { name: "Bicycle", series: 3, repeticiones: 10, orden: 5, descanso: 15, numeroDia: 1 },
            { name: "Teaser", series: 3, repeticiones: 8, orden: 6, descanso: 20, numeroDia: 1 },
            { name: "Hip Circles", series: 3, repeticiones: 6, orden: 7, descanso: 20, numeroDia: 1 },
            { name: "Leg Pull Front", series: 3, repeticiones: 8, orden: 8, descanso: 20, numeroDia: 1 },
            { name: "Leg Pull Back", series: 3, repeticiones: 8, orden: 9, descanso: 20, numeroDia: 1 },
            { name: "Boomerang", series: 3, repeticiones: 6, orden: 10, descanso: 25, numeroDia: 1 },
            { name: "Jack Knife", series: 3, repeticiones: 6, orden: 11, descanso: 25, numeroDia: 1 },
            { name: "Control Balance", series: 3, repeticiones: 6, orden: 12, descanso: 25, numeroDia: 1 },
        ],
    },
    {
        descripcion: "Pilates Reformer Intro",
        exercises: [
            { name: "Footwork (Reformer)", series: 3, repeticiones: 10, orden: 1, descanso: 20, numeroDia: 1 },
            { name: "Running (Reformer)", series: 3, repeticiones: 20, orden: 2, descanso: 15, numeroDia: 1 },
            { name: "Knee Stretches (Reformer)", series: 3, repeticiones: 10, orden: 3, descanso: 20, numeroDia: 1 },
            { name: "Elephant (Reformer)", series: 3, repeticiones: 8, orden: 4, descanso: 20, numeroDia: 1 },
            { name: "Long Stretch (Reformer)", series: 3, repeticiones: 8, orden: 5, descanso: 20, numeroDia: 1 },
            { name: "Short Spine (Reformer)", series: 3, repeticiones: 6, orden: 6, descanso: 25, numeroDia: 1 },
            { name: "Mermaid (Reformer)", series: 2, repeticiones: 6, orden: 7, descanso: 15, numeroDia: 1 },
        ],
    },
    {
        descripcion: "Core Power",
        exercises: [
            { name: "The Hundred", series: 1, repeticiones: 100, orden: 1, descanso: 30, numeroDia: 1 },
            { name: "Plank (Tabla)", series: 3, repeticiones: 1, orden: 2, descanso: 30, numeroDia: 1 },
            { name: "Side Plank (Plancha lateral)", series: 2, repeticiones: 1, orden: 3, descanso: 20, numeroDia: 1 },
            { name: "Criss Cross", series: 3, repeticiones: 12, orden: 4, descanso: 15, numeroDia: 1 },
            { name: "Double Leg Stretch", series: 3, repeticiones: 10, orden: 5, descanso: 20, numeroDia: 1 },
            { name: "Teaser", series: 3, repeticiones: 8, orden: 6, descanso: 25, numeroDia: 1 },
            { name: "Swimming", series: 3, repeticiones: 12, orden: 7, descanso: 20, numeroDia: 1 },
            { name: "Leg Pull Front", series: 3, repeticiones: 8, orden: 8, descanso: 20, numeroDia: 1 },
            { name: "Bird Dog", series: 3, repeticiones: 10, orden: 9, descanso: 15, numeroDia: 1 },
        ],
    },
    {
        descripcion: "Glúteos y Piernas Pilates",
        exercises: [
            { name: "Shoulder Bridge", series: 3, repeticiones: 12, orden: 1, descanso: 20, numeroDia: 1 },
            { name: "Clam Shell", series: 3, repeticiones: 15, orden: 2, descanso: 15, numeroDia: 1 },
            { name: "Side Kick Series", series: 3, repeticiones: 10, orden: 3, descanso: 20, numeroDia: 1 },
            { name: "Single Leg Circle", series: 3, repeticiones: 10, orden: 4, descanso: 15, numeroDia: 1 },
            { name: "Single Leg Kick", series: 3, repeticiones: 10, orden: 5, descanso: 15, numeroDia: 1 },
            { name: "Double Leg Kick", series: 3, repeticiones: 8, orden: 6, descanso: 20, numeroDia: 1 },
            { name: "Leg Pull Side (Star)", series: 2, repeticiones: 8, orden: 7, descanso: 25, numeroDia: 1 },
        ],
    },
    {
        descripcion: "Movilidad y Flexibilidad",
        exercises: [
            { name: "Cat-Cow (Gato-Vaca)", series: 3, repeticiones: 10, orden: 1, descanso: 10, numeroDia: 1 },
            { name: "Spine Stretch Forward", series: 3, repeticiones: 8, orden: 2, descanso: 15, numeroDia: 1 },
            { name: "Spine Twist", series: 3, repeticiones: 8, orden: 3, descanso: 15, numeroDia: 1 },
            { name: "Saw", series: 3, repeticiones: 8, orden: 4, descanso: 15, numeroDia: 1 },
            { name: "Mermaid (Reformer)", series: 3, repeticiones: 6, orden: 5, descanso: 15, numeroDia: 1 },
            { name: "Rolling Like a Ball", series: 3, repeticiones: 8, orden: 6, descanso: 15, numeroDia: 1 },
            { name: "Seal", series: 3, repeticiones: 8, orden: 7, descanso: 15, numeroDia: 1 },
        ],
    },
];

async function seed() {
    const beginTransaction = util.promisify(db.beginTransaction).bind(db);
    const commit = util.promisify(db.commit).bind(db);
    const rollback = util.promisify(db.rollback).bind(db);

    try {
        console.log("📋 Seeding routines...\n");

        // Cache exercise name → ID
        const allExercises: any[] = await query("SELECT id, descripcion FROM ejercicio");
        const exerciseMap = new Map<string, number>();
        for (const ex of allExercises) {
            exerciseMap.set(ex.descripcion, ex.id);
        }

        for (const routine of routines) {
            await beginTransaction();
            try {
                const result: any = await query(
                    "INSERT INTO rutina (descripcion, tipo_estado_id) VALUES (?, 1)",
                    [routine.descripcion]
                );
                const rutinaId = result.insertId;

                for (const ex of routine.exercises) {
                    const exerciseId = exerciseMap.get(ex.name);
                    if (!exerciseId) {
                        console.warn(`  ⚠️  Ejercicio "${ex.name}" no encontrado, saltando...`);
                        continue;
                    }
                    await query(
                        `INSERT INTO rutina_ejercicio
                         (rutina_id, ejercicio_id, series, repeticiones, orden, descanso, numero_dia, tipo_estado_id, dias_semana_id)
                         VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)`,
                        [rutinaId, exerciseId, ex.series, ex.repeticiones, ex.orden, ex.descanso, ex.numeroDia]
                    );
                }

                await commit();
                console.log(`  ✅ ${routine.descripcion} (${routine.exercises.length} ejercicios)`);
            } catch (err) {
                await rollback();
                console.error(`  ❌ Error en rutina "${routine.descripcion}":`, err);
            }
        }

        console.log(`\n🎉 ${routines.length} rutinas insertadas exitosamente.`);
    } catch (error) {
        console.error("❌ Error general:", error);
    } finally {
        process.exit(0);
    }
}

seed();
