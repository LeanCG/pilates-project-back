/**
 * Seed script for Pilates exercises.
 * Populates the 'ejercicio' table with a comprehensive catalog of Pilates exercises
 * covering Mat, Reformer, and complementary disciplines.
 *
 * Run: npx tsx seed_exercises.ts
 */
import { db } from "./src/connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

interface Exercise {
    descripcion: string;
    observacion: string;
    grupo_muscular: string;
    url_video: string;
    calorias_promedio: string;
    nivel_dificultad: string;
}

const exercises: Exercise[] = [
    // ── Mat Básico ──────────────────────────────────────────
    { descripcion: "The Hundred", observacion: "Ejercicio de calentamiento clásico. Bombear brazos 100 veces coordinando con la respiración.", grupo_muscular: "Core / Abdominales", url_video: "", calorias_promedio: "30", nivel_dificultad: "Principiante" },
    { descripcion: "Roll Up", observacion: "Articular la columna vertebra por vertebra desde posición supina hasta sentado.", grupo_muscular: "Core / Flexores de cadera", url_video: "", calorias_promedio: "25", nivel_dificultad: "Principiante" },
    { descripcion: "Roll Over", observacion: "Elevar las piernas y rodar hasta pasar por encima de la cabeza.", grupo_muscular: "Core / Espalda baja", url_video: "", calorias_promedio: "35", nivel_dificultad: "Intermedio" },
    { descripcion: "Single Leg Circle", observacion: "Círculos controlados con una pierna manteniendo la pelvis estable.", grupo_muscular: "Cadera / Core", url_video: "", calorias_promedio: "20", nivel_dificultad: "Principiante" },
    { descripcion: "Rolling Like a Ball", observacion: "Equilibrio sobre isquiones y rodar hacia atrás manteniendo la forma.", grupo_muscular: "Core / Espalda", url_video: "", calorias_promedio: "20", nivel_dificultad: "Principiante" },
    { descripcion: "Single Leg Stretch", observacion: "Alternar piernas mientras se mantiene la cabeza elevada.", grupo_muscular: "Core / Cuádriceps", url_video: "", calorias_promedio: "30", nivel_dificultad: "Principiante" },
    { descripcion: "Double Leg Stretch", observacion: "Extender brazos y piernas simultáneamente desde posición fetal.", grupo_muscular: "Core completo", url_video: "", calorias_promedio: "35", nivel_dificultad: "Principiante" },
    { descripcion: "Spine Stretch Forward", observacion: "Sentado con piernas separadas, flexionar la columna hacia adelante.", grupo_muscular: "Espalda / Isquiotibiales", url_video: "", calorias_promedio: "15", nivel_dificultad: "Principiante" },

    // ── Mat Intermedio ──────────────────────────────────────
    { descripcion: "Open Leg Rocker", observacion: "Equilibrio en V con piernas abiertas, rodar hacia atrás.", grupo_muscular: "Core / Isquiotibiales", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Corkscrew", observacion: "Piernas al techo, realizar círculos controlados con ambas piernas.", grupo_muscular: "Core / Oblicuos", url_video: "", calorias_promedio: "25", nivel_dificultad: "Intermedio" },
    { descripcion: "Saw", observacion: "Sentado, rotación del tronco con estiramiento hacia el pie opuesto.", grupo_muscular: "Oblicuos / Isquiotibiales", url_video: "", calorias_promedio: "20", nivel_dificultad: "Intermedio" },
    { descripcion: "Swan Dive", observacion: "Extensión de espalda desde posición prona, mecerse entre extensión y flexión.", grupo_muscular: "Extensores de espalda / Glúteos", url_video: "", calorias_promedio: "35", nivel_dificultad: "Intermedio" },
    { descripcion: "Single Leg Kick", observacion: "Boca abajo, patadas alternas a los glúteos.", grupo_muscular: "Isquiotibiales / Glúteos", url_video: "", calorias_promedio: "25", nivel_dificultad: "Intermedio" },
    { descripcion: "Double Leg Kick", observacion: "Boca abajo, doble patada a glúteos seguida de extensión de espalda.", grupo_muscular: "Espalda / Isquiotibiales", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Neck Pull", observacion: "Similar al Roll Up pero con manos detrás de la cabeza.", grupo_muscular: "Core / Flexores de cadera", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Scissors", observacion: "Supino, alternar piernas estiradas hacia el techo.", grupo_muscular: "Core / Isquiotibiales", url_video: "", calorias_promedio: "25", nivel_dificultad: "Intermedio" },
    { descripcion: "Bicycle", observacion: "Supino, movimiento de pedaleo con las piernas en el aire.", grupo_muscular: "Core / Cuádriceps / Isquiotibiales", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Shoulder Bridge", observacion: "Puente de hombros con extensión de una pierna.", grupo_muscular: "Glúteos / Core / Isquiotibiales", url_video: "", calorias_promedio: "25", nivel_dificultad: "Intermedio" },

    // ── Mat Avanzado ────────────────────────────────────────
    { descripcion: "Teaser", observacion: "Subir desde supino a posición V manteniendo piernas a 45°.", grupo_muscular: "Core completo", url_video: "", calorias_promedio: "40", nivel_dificultad: "Avanzado" },
    { descripcion: "Hip Circles", observacion: "Sentado en V, dibujar círculos con las piernas.", grupo_muscular: "Core / Flexores de cadera", url_video: "", calorias_promedio: "35", nivel_dificultad: "Avanzado" },
    { descripcion: "Swimming", observacion: "Boca abajo, alternar elevación de brazos y piernas opuestos.", grupo_muscular: "Espalda / Glúteos", url_video: "", calorias_promedio: "35", nivel_dificultad: "Intermedio" },
    { descripcion: "Leg Pull Front", observacion: "Plancha con elevación alternada de piernas.", grupo_muscular: "Core / Hombros / Glúteos", url_video: "", calorias_promedio: "40", nivel_dificultad: "Avanzado" },
    { descripcion: "Leg Pull Back", observacion: "Plancha invertida con elevación alternada de piernas.", grupo_muscular: "Tríceps / Core / Glúteos", url_video: "", calorias_promedio: "40", nivel_dificultad: "Avanzado" },
    { descripcion: "Side Kick Series", observacion: "Decúbito lateral, serie de patadas frontales y traseras.", grupo_muscular: "Abductores / Glúteos / Oblicuos", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Boomerang", observacion: "Combina Roll Over, Teaser y estiramiento de brazos.", grupo_muscular: "Core completo", url_video: "", calorias_promedio: "45", nivel_dificultad: "Avanzado" },
    { descripcion: "Seal", observacion: "Similar a Rolling Like a Ball con palmadas de pies.", grupo_muscular: "Core / Coordinación", url_video: "", calorias_promedio: "20", nivel_dificultad: "Principiante" },
    { descripcion: "Control Balance", observacion: "Parado de hombros con piernas alternadas.", grupo_muscular: "Core / Equilibrio", url_video: "", calorias_promedio: "35", nivel_dificultad: "Avanzado" },
    { descripcion: "Push Up Pilates", observacion: "Roll Down hasta plancha, flexiones y retorno a posición de pie.", grupo_muscular: "Pecho / Tríceps / Core", url_video: "", calorias_promedio: "40", nivel_dificultad: "Intermedio" },

    // ── Reformer ────────────────────────────────────────────
    { descripcion: "Footwork (Reformer)", observacion: "Serie de trabajo de pies en el carro: paralelo, V, talones.", grupo_muscular: "Cuádriceps / Glúteos / Pantorrillas", url_video: "", calorias_promedio: "30", nivel_dificultad: "Principiante" },
    { descripcion: "Long Stretch (Reformer)", observacion: "Plancha dinámica en el Reformer empujando el carro.", grupo_muscular: "Core / Hombros / Pecho", url_video: "", calorias_promedio: "40", nivel_dificultad: "Intermedio" },
    { descripcion: "Short Spine (Reformer)", observacion: "Articulación de columna usando las correas de los pies.", grupo_muscular: "Espalda / Core / Isquiotibiales", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Elephant (Reformer)", observacion: "De pie en el Reformer con manos en la barra, empujar el carro.", grupo_muscular: "Isquiotibiales / Core / Hombros", url_video: "", calorias_promedio: "25", nivel_dificultad: "Intermedio" },
    { descripcion: "Knee Stretches (Reformer)", observacion: "Arrodillado, empujar el carro con control abdominal.", grupo_muscular: "Core / Cuádriceps", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Running (Reformer)", observacion: "Correr en posición supina sobre el Reformer.", grupo_muscular: "Pantorrillas / Cuádriceps", url_video: "", calorias_promedio: "25", nivel_dificultad: "Principiante" },
    { descripcion: "Mermaid (Reformer)", observacion: "Estiramiento lateral sentado en el Reformer.", grupo_muscular: "Oblicuos / Dorsal ancho", url_video: "", calorias_promedio: "15", nivel_dificultad: "Principiante" },

    // ── Complementarios / Accesorios ────────────────────────
    { descripcion: "Plank (Tabla)", observacion: "Mantener posición de plancha con alineación correcta.", grupo_muscular: "Core / Hombros / Glúteos", url_video: "", calorias_promedio: "35", nivel_dificultad: "Principiante" },
    { descripcion: "Side Plank (Plancha lateral)", observacion: "Plancha lateral sobre antebrazo o mano.", grupo_muscular: "Oblicuos / Hombros", url_video: "", calorias_promedio: "30", nivel_dificultad: "Intermedio" },
    { descripcion: "Cat-Cow (Gato-Vaca)", observacion: "Movilización de columna en cuadrupedia.", grupo_muscular: "Columna / Core", url_video: "", calorias_promedio: "10", nivel_dificultad: "Principiante" },
    { descripcion: "Bird Dog", observacion: "En cuadrupedia, extender brazo y pierna opuestos.", grupo_muscular: "Core / Espalda / Glúteos", url_video: "", calorias_promedio: "20", nivel_dificultad: "Principiante" },
    { descripcion: "Clam Shell", observacion: "Decúbito lateral, abrir rodillas manteniendo pies juntos.", grupo_muscular: "Glúteo medio / Cadera", url_video: "", calorias_promedio: "15", nivel_dificultad: "Principiante" },
    { descripcion: "Criss Cross", observacion: "Supino, codo hacia rodilla opuesta alternando.", grupo_muscular: "Oblicuos / Core", url_video: "", calorias_promedio: "35", nivel_dificultad: "Intermedio" },
    { descripcion: "Spine Twist", observacion: "Sentado, rotación del tronco con brazos extendidos.", grupo_muscular: "Oblicuos / Columna", url_video: "", calorias_promedio: "15", nivel_dificultad: "Principiante" },
    { descripcion: "Jack Knife", observacion: "Elevar piernas hasta vertical y articular la columna.", grupo_muscular: "Core / Espalda baja", url_video: "", calorias_promedio: "40", nivel_dificultad: "Avanzado" },
    { descripcion: "Rocking (Mecedora)", observacion: "Boca abajo, agarrar tobillos y mecerse.", grupo_muscular: "Extensores de espalda / Cuádriceps", url_video: "", calorias_promedio: "30", nivel_dificultad: "Avanzado" },
    { descripcion: "Leg Pull Side (Star)", observacion: "Plancha lateral con elevación de pierna superior.", grupo_muscular: "Oblicuos / Glúteos / Hombros", url_video: "", calorias_promedio: "35", nivel_dificultad: "Avanzado" },
];

async function seed() {
    try {
        console.log("🏋️ Seeding exercises...\n");

        for (const ex of exercises) {
            await query(
                `INSERT INTO ejercicio (descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [ex.descripcion, ex.observacion, ex.grupo_muscular, ex.url_video, ex.calorias_promedio, ex.nivel_dificultad]
            );
            console.log(`  ✅ ${ex.descripcion} (${ex.nivel_dificultad})`);
        }

        console.log(`\n🎉 ${exercises.length} ejercicios insertados exitosamente.`);
    } catch (error) {
        console.error("❌ Error seeding exercises:", error);
    } finally {
        process.exit(0);
    }
}

seed();
