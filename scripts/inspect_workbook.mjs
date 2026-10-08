import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const w=await SpreadsheetFile.importXlsx(await FileBlob.load('references/Day22_template.xlsx'));
console.log((await w.inspect({kind:'sheet',include:'id,name',maxChars:2000})).ndjson);
const p=await w.render({sheetName:'1_Cost_Job',range:'A1:D12',scale:1.5,format:'png'});
await fs.writeFile('tmp/qa/template_cost.png',new Uint8Array(await p.arrayBuffer()));
console.log('template rendered');
