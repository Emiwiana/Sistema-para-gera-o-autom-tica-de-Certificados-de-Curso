/// <reference types="node" />
//app to be launched through this file
import {generateCertificates} from "./controllers/certificate/certificateGenerator";


const list = [
    { name: "Nilo Duarte", id: "48155", curso: "LEIM", data_inicio: "12-09-2023", data_fim: "17-07-2026" },
    { name: "Maria Silva", id: "48156", curso: "LEIM", data_inicio: "12-09-2023", data_fim: "17-07-2026" },
    { name: "João Pereira", id: "48157", curso: "LEIM", data_inicio: "12-09-2023", data_fim: "17-07-2026" }
];

generateCertificates(list);

//fs.writeFileSync("certificado.html", renderedHTML, "utf8");

//generatePDFs()






