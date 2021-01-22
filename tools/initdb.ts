import dotenv from "dotenv";
import { Pool } from "../src/apiBase/pool";
import { DBCreator } from "../src/apiBase/tools/DBCreator"

const init = async () => {
    dotenv.config();
    console.log("Connecting");
    Pool.initPool();

    const attendanceTables: { title: string, file: string }[] = [
        { title: "Sessions", file: "sessions.mysql" },
        { title: "Visits", file: "visits.mysql" },
        { title: "VisitSessions", file: "visitSessions.mysql" }
    ];

    await initTables("Attendance", attendanceTables);
}

const initTables = async (displayName: string, tables: { title: string, file: string }[]) => {
    console.log("");
    console.log("SECTION: " + displayName);
    for (const table of tables) await DBCreator.runScript(table.title, "./tools/dbScripts/" + table.file, false);
}

init()
    .then(() => { console.log("Database Created"); process.exit(0); })
    .catch((ex) => {
        console.log(ex);
        console.log("Database not created due to errors");
        process.exit(0);
    });
