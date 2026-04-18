const DAY_COLUMNS = [
    { label: "L", code: "l" },
    { label: "M", code: "m" },
    { label: "W", code: "w" },
    { label: "J", code: "j" },
    { label: "V", code: "v" },
    { label: "S", code: "s" },
];
const MODULE_COUNT = 8;

const SALAS_NONSENSE = new Set([
    "A-SALA1", "A-SALA17", "A-SALA2", "A-SALA3", "ALFERO", "AREA VERDE", "ASILVA", "ATACAMA", "AUD GASTON",
    "AUD-1", "AUD-2", "AUD-41", "AUD-51", "AUD-61", "AUD-71", "AUD-81", "AUD-POSG", "AUDITORIO", "AUD_201", "AUD_202", "AUD_203",
    "AUD_AGRONO", "AUD_AP", "AUD_CGONZA", "AUD_DECON", "AUD_EDUC", "AUD_FIL", "AUD_J", "AUD_LCERE", "AUD_N", "AUD_S", "AUD_VET", "AULA-MAGNA", "A_FIDEL_S", "A_MAGNACEX",
    "B.SZELEKY", "BOULDER", "C- RUGBY", "C-CORO", "C-FUTBOL", "C-SINTETIC", "CAPILLA", "CAR_OVIEDO", "CELIAPEREZ", "CINE_CEX", "CITEDUC-B", "CLARO", "CMPC", "COMPOSICIO",
    "CONDEMARIN", "CORPORAL1", "CORPORAL2", "CRISOL-H1", "CRISOL-SJ2", "CRISOL_CC1", "CV", "C_TENIS_DU", "DOJO", "E.ROSALES", "EDO_FREI_M", "FADEU", "FCAP", "FCO_CLARO",
    "FCV", "GIMNASIO A", "GIMNASIO B", "GORZIGLIA", "G_MISTRAL", "HLARRAIN", "I_BAIXAS", "J-ORAL", "JECOEYMANS", "JGUZMAN",
    "LAB-CB4", "LAB-CB5", "LAB-CREATI", "LAB-ELECT", "LAB-FAR2", "LAB-I", "LAB-ILUM", "LAB-INTRUM", "LAB-ME", "LAB-ORG1", "LAB-QCA1", "LAB-QCA2", "LAB-QCA3", "LAB-QCA4", "LAB-QCA5", "LAB-QCA6", "LAB-S", "LAB-T",
    "LABCYT GEO", "LABCYT PRM", "LABETRONIC", "LABROBOTIC", "LAB_INGL\u00c9S", "LAMPARA", "LD_DECON_1", "LD_DECON_2", "LMONTECINO", "LMORENO",
    "MAGISTER", "MAG_ANTROP", "MATTE_CEX", "MDIDIER", "MECESUP-1", "MEDIACION", "MOSCATTI", "MSANTANDER", "MULTICANCH", "MULTIUSO", "M_OYANEDEL", "M_PALMER", "M_ROJAS",
    "P-ATLETICA", "P-CIA", "PE\u00d1ALOLEN", "PISCINA", "PLIRA", "POSGEO", "P_AYLWIN_A", "RAULSILVAH", "REFECTORIO",
    "S-COMP3", "S-CONSEJO", "S-DIE", "S-INSTRUC", "S-LARRAIN", "S-MULTIUSO", "S-MUSICA", "S-PESAS", "S-REUNION1", "S-REUNION4", "S-REUNION5", "S-REUNION6", "S.MALTES",
    "SALA 1", "SALA 2", "SALA 3", "SALA 4", "SALA 5", "SALA 6", "SALA STEAM", "SALA STEM", "SALA-LATEM", "SALA-MA", "SALA-MC", "SALA-T", "SALA101", "SALA102", "SALA103", "SALA104", "SALA11", "SALA8_9", "SALA_DILAB", "SALA_TP",
    "SAN JUAN", "SAN LUCAS", "SAN MARCOS", "SAN_ANDRES", "SCOM2", "SDEPTO-ICE", "SEA_BASICA", "SEA_PARV",
    "SEM 2", "SEM 4", "SEM-4", "SEM13", "SEM1_V2", "SEM3", "SEMINARIO4", "SEMINARIO5", "SEMINARIO6", "SEM_1_P2", "SEM_1_P4", "SEM_2_P2", "SEM_2_P4", "SEM_3_P2", "SEM_3_P4", "SEM_4_P2", "SEM_4_P4", "SEM_5_P2", "SEM_5_P4", "SEM_6_P2", "SEM_6_P4", "SEM_HGCP",
    "SIN SALA", "SPG", "SYULIS", "S_FACULTAD", "S_MAG_SOC", "S_PI\u00d1ERA_E", "S_SPINNING", "TALLER9", "TUNEL_ORIE", "TUNEL_PONI", "VB. PLAYA", "V_PARRA"
]);

const grid = document.getElementById("grid");
const campusSelect = document.getElementById("campus");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultContainer = document.getElementById("resultado");
const status = document.getElementById("status");

const selectedModules = new Set();
let db = null;

function renderMatrix() {
    const headerCorner = document.createElement("div");
    headerCorner.className = "cell corner";
    headerCorner.textContent = "Mod";
    grid.appendChild(headerCorner);

    DAY_COLUMNS.forEach((day) => {
        const header = document.createElement("div");
        header.className = "cell day-header";
        header.textContent = day.label;
        grid.appendChild(header);
    });

    for (let module = 1; module <= MODULE_COUNT; module += 1) {
        const rowLabel = document.createElement("div");
        rowLabel.className = "cell row-label";
        rowLabel.textContent = String(module);
        grid.appendChild(rowLabel);

        DAY_COLUMNS.forEach((day) => {
            const moduleKey = `${day.code}${module}`;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "cell module-cell";
            button.setAttribute("aria-pressed", "false");
            button.setAttribute("aria-label", `Modulo ${day.label}${module}`);
            button.dataset.module = moduleKey;
            button.textContent = "";

            button.addEventListener("click", () => {
                if (selectedModules.has(moduleKey)) {
                    selectedModules.delete(moduleKey);
                    button.classList.remove("active");
                    button.setAttribute("aria-pressed", "false");
                } else {
                    selectedModules.add(moduleKey);
                    button.classList.add("active");
                    button.setAttribute("aria-pressed", "true");
                }
            });

            grid.appendChild(button);
        });
    }
}

function clearSelection() {
    selectedModules.clear();
    grid.querySelectorAll(".module-cell").forEach((cell) => {
        cell.classList.remove("active");
        cell.setAttribute("aria-pressed", "false");
    });
    resultContainer.innerHTML = "";
    status.textContent = "Seleccion limpiada.";
}

function buscar() {
    if (!db) {
        status.textContent = "Cargando base de datos, intenta nuevamente en unos segundos.";
        return;
    }

    const campus = campusSelect.value;
    const modules = [...selectedModules];
    const moduleSet = new Set(modules);
    const campusByNrc = new Map(db.secciones.map((s) => [String(s.nrc), s.campus]));
    const horariosCampus = db.horarios.filter((h) => campusByNrc.get(String(h.nrc)) === campus);

    const allRooms = new Set();
    horariosCampus.forEach((h) => {
        if (h.sala) {
            allRooms.add(h.sala);
        }
    });

    const occupiedRooms = new Set();
    if (modules.length > 0) {
        horariosCampus.forEach((h) => {
            if (moduleSet.has(h.module) && h.sala) {
                occupiedRooms.add(h.sala);
            }
        });
    }

    const availableRooms = [...allRooms]
        .filter((room) => !occupiedRooms.has(room))
        .filter((room) => !SALAS_NONSENSE.has(room))
        .sort((a, b) => a.localeCompare(b, "es"));

    renderResults(availableRooms, campus, modules.length);
}

function renderResults(rooms, campus, selectedCount) {
    resultContainer.innerHTML = "";

    if (rooms.length === 0) {
        status.textContent = `No se encontraron salas disponibles en ${campus} para los modulos seleccionados.`;
        return;
    }

    status.textContent = `${rooms.length} sala(s) disponible(s) en ${campus}.`;

    rooms.forEach((room) => {
        const chip = document.createElement("div");
        chip.className = "sala";
        chip.textContent = room;
        resultContainer.appendChild(chip);
    });
}

searchBtn.addEventListener("click", buscar);
clearBtn.addEventListener("click", clearSelection);

renderMatrix();

fetch("db.json")
    .then((r) => r.json())
    .then((data) => {
        db = data;
        status.textContent = "Base de datos cargada. Selecciona modulos y busca salas.";
    })
    .catch(() => {
        status.textContent = "No se pudo cargar db.json. Verifica que el archivo exista en la raíz del sitio.";
    });
