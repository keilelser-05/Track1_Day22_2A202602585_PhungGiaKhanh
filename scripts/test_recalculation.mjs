import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const w=await SpreadsheetFile.importXlsx(await FileBlob.load('PhungGiaKhanh_Day22_model.xlsx'));
const s=n=>w.worksheets.getItem(n);
const formulaList=JSON.parse(await fs.readFile('references/template_cells.json','utf8'));
function refresh(){
 for(const [sn,block]of Object.entries(formulaList))for(const row of block.rows)for(const c of row)if(typeof c.value==='string'&&c.value.startsWith('='))s(sn).getRange(c.cell).formulas=[[c.value]];
 w.recalculate();
}
const value=(sn,a)=>s(sn).getRange(a).values[0][0];
const checks=[];
function eq(name,actual,expected){if(Math.abs(actual-expected)>1e-7)throw new Error(`${name}: ${actual} != ${expected}`);checks.push({name,actual,expected,pass:true});}
const cogs=1042.266214;
s('1_Cost_Job').getRange('B10').values=[[0.5]];refresh();
eq('completion 50% -> completed',value('1_Cost_Job','B11'),10);
eq('completion 50% -> cost/completed',value('1_Cost_Job','B66'),cogs/10);
eq('completion 50% -> Hybrid invoice',value('2_Pricing','B59'),2700);
eq('completion 50% -> Hybrid GM',value('2_Pricing','B62'),1-cogs/2700);
eq('completion 50% -> ARPU',value('4_Channel_Fit','B5'),2700);
s('1_Cost_Job').getRange('B10').values=[[0.9]];
s('1_Cost_Job').getRange('B96').values=[[30]];refresh();
eq('support 30h -> COGS',value('2_Pricing','B61'),cogs+375);
eq('support 30h -> GM',value('2_Pricing','B62'),1-(cogs+375)/3660);
s('1_Cost_Job').getRange('B96').values=[[15]];refresh();
eq('restore -> COGS',value('2_Pricing','B61'),cogs);
eq('restore -> GM',value('2_Pricing','B62'),1-cogs/3660);
await fs.writeFile('tmp/qa/recalculation.json',JSON.stringify({status:'PASS',checks,scope:'In-memory disposable import; final workbook not modified. Native Excel not opened.'},null,2));
console.log(`PASS: ${checks.length} input-change recalculation checks`);
