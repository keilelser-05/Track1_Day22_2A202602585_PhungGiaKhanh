import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const data=JSON.parse(await fs.readFile('scripts/inputs.json','utf8'));
const i=data.inputs, r=data.rates;
const w=await SpreadsheetFile.importXlsx(await FileBlob.load('references/Day22_template.xlsx'));
const yellow='#FFF2CC', gray='#F2F2F2', navy='#1F2937';
const S=n=>w.worksheets.getItem(n);
const val=(s,a,v)=>S(s).getRange(a).values=[[v]];
const form=(s,a,f)=>S(s).getRange(a).formulas=[[f]];
const input=(s,a,v)=>{val(s,a,v);S(s).getRange(a).format.fill=yellow;S(s).getRange(a).format.font={name:'Arial',size:10,color:'#0000FF'};};
const calc=(s,a,f,fmt='0.0000')=>{form(s,a,f);S(s).getRange(a).format.fill=gray;S(s).getRange(a).setNumberFormat(fmt);};
const section=(s,row,t)=>{const x=S(s).getRange(`A${row}:D${row}`);x.merge();x.values=[[t]];x.format={fill:navy,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:25};};
const detail=(s,row,label,value,note,fmt)=>{val(s,`A${row}`,label);input(s,`B${row}`,value);val(s,`D${row}`,note);if(fmt)S(s).getRange(`B${row}`).setNumberFormat(fmt);};
const note=(s,row,text)=>{const x=S(s).getRange(`A${row}:D${row}`);x.merge();x.values=[[text]];x.format={fill:yellow,font:{name:'Arial',size:10,color:'#0000FF'},wrapText:true,rowHeight:50,verticalAlignment:'center'};};
const cost='1_Cost_Job', price='2_Pricing', metric='3_Value_Metric', channel='4_Channel_Fit', plan='5_90Day_Plan', bench='6_Benchmarks', readme='0_README';

// Keep every existing gray formula and reference price row unchanged.
section(bench,45,'GIÁ DÙNG CHO RAV-26 — KIỂM TRA NGÀY 08/10/2026');
S(bench).getRange('A46:D46').values=[['Hạng mục','Giá trị số','Đơn vị','Nguồn và điều kiện']];
const rates=[
 ['Modal L4',r.gpu_second,'USD/GPU-giây','https://modal.com/pricing — list; không trừ credits'],
 ['Modal Functions CPU',r.cpu_core_second,'USD/core-giây','https://modal.com/pricing — physical core, không phải Sandbox'],
 ['Modal Functions memory',r.memory_gib_second,'USD/GiB-giây','https://modal.com/pricing — không phải Sandbox'],
 ['Modal Volumes',r.storage_gib_month,'USD/GiB-tháng','https://modal.com/pricing — dự phòng gross list; không trừ 1 TiB miễn phí'],
 ['Modal network egress',r.egress_gib,'USD/GiB','https://modal.com/pricing — không trừ allowance; không nhân hệ số vùng'],
 ['Modal Team',r.modal_team_month,'USD/tháng','https://modal.com/pricing — phân bổ toàn bộ cho một khách; không trừ credits'],
 ['FX Vietcombank USD bán',r.usd_vnd_sell,'VND/USD','https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx — 08/10/2026 19:11:46'],
 ['ICONIQ Mid-market/Enterprise CPO',r.enterprise_cpo,'USD/opportunity','https://www.iconiq.com/growth/reports/state-of-go-to-market-2026 — PDF tr.22; Strategic là 11.200'],
 ['Hệ số region upper bound',i.region_multiplier,'lần','https://modal.com/pricing — range 1,15–1,75x; giả định áp dụng 1,75 cho compute'],
 ['Roboflow Core monthly',39,'USD/tháng','https://roboflow.com/pricing — 20 credits tổng; Enterprise báo giá riêng'],
 ['Roboflow flex credit',6,'USD/credit','https://roboflow.com/pricing — on-demand; rates có thể thay đổi'],
 ['Roboflow AI auto labeling',1000,'ảnh/credit','https://roboflow.com/credits — cập nhật 02/10/2026; job liền kề, không tương đương curation'],
 ['Encord Enterprise','Báo giá riêng','không công bố đơn giá','https://encord.com/pricing/ — volume-tier platform; liên hệ sales']
];
for(let z=0;z<rates.length;z++){const row=47+z;S(bench).getRange(`A${row}:D${row}`).values=[rates[z]];S(bench).getRange(`A${row}:D${row}`).format.fill=yellow;S(bench).getRange(`B${row}`).setNumberFormat(typeof rates[z][1]==='number'?'0.000000':'@');}
input(bench,'B3',new Date('2026-10-08T00:00:00Z'));S(bench).getRange('B3').setNumberFormat('dd/mm/yyyy');
note(bench,61,'Chỉ các dòng 47–59 được mở và kiểm tra cho bài này. Giá mẫu ở dòng 5–41 giữ nguyên, chưa kiểm tra lại và KHÔNG dùng làm chi phí RAV-26. Không giả định có khuyến mại hay giảm Batch 50% cho GPU.');
note(bench,62,'Nguồn sản phẩm: thông tin người dùng ngày 08/10/2026. Repo P-026 trả 404 với kết nối hiện có; chưa kiểm chứng độc lập test report, kiến trúc hay model license. Modal là phương án pilot giả định, không phải stack đã xác nhận.');

// Extension schedule for computer vision rather than token-priced LLM.
section(cost,80,'RAV-26 — GIẢ ĐỊNH VÀ CHI PHÍ CV BỔ SUNG');
note(cost,81,'B10 là tỷ lệ batch hoàn thành kỹ thuật sau khi Reviewer khách duyệt, KHÔNG phải AI tự trị hay tỷ lệ tăng mAP. 90% chỉ là giả định lập kế hoạch: 18/20 batch hoàn thành; chưa có đo lường thực tế. Reviewer bắt buộc mọi batch.');
const defs=[
 [83,'Frame đầu vào / job',i.frames_per_job,'Gói pilot cố định; tối đa 1.000 frame duy nhất, độ phân giải tối đa 1080p.','#,##0'],
 [84,'GPU-giây / frame',i.gpu_seconds_per_frame,'Giả định 3 bước CV × 0,5 giây: PII, detector/uncertainty, embedding. Phải benchmark.','0.00'],
 [85,'CPU-giây / batch',i.cpu_seconds_per_job,'Giả định 3 giây/frame cho decode, metadata, manifest; không phải throughput đã đo.','#,##0'],
 [86,'Physical cores',i.cpu_cores,'Giả định cấu hình worker; 2 physical cores ≈ 4 vCPU.','0'],
 [87,'RAM GiB',i.memory_gib,'Giả định worker decode/CV.','0'],
 [88,'Region multiplier',i.region_multiplier,'Dùng upper bound công khai; phải chọn vùng khách chấp thuận trước pilot.','0.00'],
 [89,'MiB / frame',i.frame_mib,'Cap thiết kế pilot; frame lớn hơn phải báo giá lại.','0.0'],
 [90,'Bản gốc + derivative',i.derivative_multiplier,'Giả định 2 bản tương đương; hạn chế export/cache trùng.','0.0'],
 [91,'Retention rolling (tháng)',i.retention_months,'Chi phí steady state 3 tháng; retention là đề xuất, chưa có cam kết DPA.','0'],
 [92,'GiB egress / batch',i.egress_gib_per_job,'Giả định tối đa 2 GiB; cùng khu vực, không tải xuống nhiều lần miễn phí.','0.0'],
 [93,'Request/IO reserve USD/batch',i.request_reserve_per_job,'Dự phòng PUT/GET/index/IO chưa có giá xác nhận; cần đối chiếu invoice.','0.00'],
 [94,'DB/API hosting USD/tháng',i.db_monthly,'Ngân sách giả định dedicated DB/API; không phải báo giá vendor.','0.00'],
 [95,'Logs + backup USD/tháng',i.logs_backups_monthly,'Ngân sách giả định audit metadata, backups; không lưu ảnh PII trong log.','0.00'],
 [96,'Delivery support giờ/tháng',i.delivery_support_hours,'Giả định 3 giờ/tuần × 5 tuần; là COGS vendor, không phải sales.','0.0'],
 [97,'Security + eval giờ/tháng',i.security_eval_hours,'Giả định 1 giờ/tuần × 5 tuần, duy trì kiểm tra và vận hành.','0.0'],
 [98,'R&D overhead USD/tháng',i.rd_overhead,'36 giờ × 25 USD/giờ; OPEX ngoài GM, phân bổ cho một tenant.','0.00'],
 [99,'Sales overhead USD/tháng',i.sales_overhead,'12 giờ × 25 USD/giờ; OPEX ngoài GM. CAC là góc nhìn cohort riêng, không cộng lại.','0.00'],
 [100,'QA minutes vendor / mẫu',i.qa_minutes,'10% batch × 2 giờ: kiểm tra export, lỗi PII/workflow; khách vẫn tự curate/review.','0'],
 [101,'QA fraction vendor',i.qa_fraction,'10% = 2 batch/20; giả định kiểm tra mẫu nội bộ, không thay Reviewer khách.','0.0%'],
 [102,'Lao động fully-loaded USD/giờ',i.hourly_cost,'Giả định 25 = 20 công + 5 chi phí quản lý/bảo hiểm/thiết bị; cần xác nhận thực tế.','0.00']
];
for(const d of defs)detail(cost,...d);
const builds=[
 [105,'GPU / job thử',"=B83*B84*B88*'6_Benchmarks'!B47"],
 [106,'CPU / job thử',"=B85*B86*B88*'6_Benchmarks'!B48"],
 [107,'Memory / job thử',"=B85*B87*B88*'6_Benchmarks'!B49"],
 [108,'CV compute trước retry','=SUM(B105:B107)'],
 [109,'Retry GPU+CPU+RAM / job','=B108*B46'],
 [110,'Storage steady state GiB','=B9*B83*B89/1024*B90*B91'],
 [111,'Storage USD/tháng',"=B110*'6_Benchmarks'!B50"],
 [112,'Network egress / job',"=B92*'6_Benchmarks'!B51"],
 [113,'Fixed delivery COGS/tháng',"='6_Benchmarks'!B52+B94+B95+(B96+B97)*B102"],
 [114,'Infra/CV all-in / job thử','=B108+B109+B111/B9+B112+B93+B113/B9'],
 [115,'QA USD/job thử','=B101*B100/60*B102'],
 [116,'COGS all-in tháng','=B9*(B114+B115)'],
 [117,'COGS/job hoàn thành','=B116/B11'],
 [118,'Retry CV USD/tháng','=B9*B109'],
 [119,'COGS chia job thử (sai mẫu số)','=B116/B9'],
 [120,'% tăng do dùng mẫu số đúng','=B117/B119-1'],
 [121,'Overhead tháng','=SUM(B98:B99)'],
 [122,'COGS + OPEX / job','=B117+B121/B11']
];
for(const [row,label,f] of builds){val(cost,`A${row}`,label);calc(cost,`B${row}`,f,row===120?'0.0%':'0.0000');}
note(cost,124,'Retry CV đã cộng tại B109 → B114 → ô vàng B41. B47/B75 gốc chỉ tính Retry API token/voice = 0 vì không dùng API đó. Retry thật B118 > 0; không cộng B118 thêm lần nữa. Không sửa bất kỳ công thức xám gốc nào.');
note(cost,125,'API LLM, cache, speech, telephony = 0 có lý do: pipeline CV định lượng, không có chat/voice; CV inference tính bằng GPU trong Infra. Batch async khả thi nhưng không có giảm giá 50% được xác nhận. Cache embedding/hash giảm tính lại là kế hoạch chưa đo; model không nhận savings.');
note(cost,126,'HITL A: khách chịu 100% Curator/Reviewer và annotation; vendor chịu QA + delivery support + security/eval. Chi phí khách được trừ khi neo giá. Không gán nhãn, không huấn luyện hay cam kết mAP trong gói này. License model, private VPC/on-prem, SLA riêng cần báo giá bổ sung.');
note(cost,127,'GPU throughput, storage, retention và lương đều là giả định có cap/đơn vị. Vendor không dùng free credits/allowance để làm đẹp GM. Chưa gồm thuế VAT; doanh thu/COGS trước thuế. Không nêu claim dữ liệu production an toàn tuyệt đối.');

// Populate only pre-existing yellow input cells.
const costVals={B5:'1 batch tối đa 1.000 frame đã PII gate, có scores/shortlist + manifest theo model/data version; Reviewer khách duyệt và xuất thành công, đếm 1 lần/job_id.',B6:'A',B9:i.attempts,B10:i.completion,B15:0,B16:0,B17:0,B18:0,B19:1,B20:0,B21:0,B22:0,B30:0,B34:0,B35:0,B36:0,B37:0,B42:0,B46:i.retry_rate,B53:0};
for(const [a,v] of Object.entries(costVals))val(cost,a,v);
form(cost,'B41','=B114');form(cost,'B50','=B102');form(cost,'B51','=B101');form(cost,'B52','=B100');form(cost,'B59','=B121');form(cost,'B68',"='6_Benchmarks'!B53");

section(price,56,'HYBRID THỰC TẾ — PHÍ WORKSPACE + BATCH ĐÃ HOÀN THÀNH');
detail(price,57,'Phí workspace USD/tháng',i.base_fee,'RBAC, audit, workflow duyệt, support; không bao gồm batch credits.','0.00');
detail(price,58,'Giá USD/batch hoàn thành',i.usage_fee,'Batch thất bại, retry hệ thống, duplicate cùng job_id không tính thêm.','0.00');
val(price,'A59','Hóa đơn tháng cơ sở');calc(price,'B59',"=B57+B58*'1_Cost_Job'!B11",'0.00');
val(price,'A60','Giá hiệu dụng cơ sở / job');calc(price,'B60',"=B59/'1_Cost_Job'!B11",'0.00');
val(price,'A61','COGS tháng');calc(price,'B61',"='1_Cost_Job'!B116",'0.00');
val(price,'A62','GM Hybrid tháng');calc(price,'B62','=1-B61/B59','0.0%');
val(price,'A63','Marge sau COGS + OPEX phân bổ');calc(price,'B63',"=1-(B61+'1_Cost_Job'!B121)/B59",'0.0%');
val(price,'A64','Completion tối thiểu GM 60% — Hybrid');calc(price,'B64',"=MAX(0,(B61/(1-B32)-B57)/(B58*'1_Cost_Job'!B9))",'0.0%');
val(price,'A65','Completion tối thiểu GM 50% — Hybrid');calc(price,'B65',"=MAX(0,(B61/0.5-B57)/(B58*'1_Cost_Job'!B9))",'0.0%');
detail(price,67,'Baseline phút chọn / frame',i.manual_minutes_per_frame,'Giả định manual 2,5 phút/frame cần đọc cảnh/bối cảnh. Phải time-study, không claim tiết kiệm đã đo.','0.0');
detail(price,68,'Review/curate giờ khách / job',i.customer_review_hours_per_job,'Giả định 5 giờ/batch còn lại sau AI; mọi batch cần Reviewer.','0.0');
val(price,'A69','Giờ manual cơ sở');calc(price,'B69',"='1_Cost_Job'!B11*'1_Cost_Job'!B83*B67/60",'0.0');
val(price,'A70','Giờ khách vẫn làm sau AI');calc(price,'B70',"='1_Cost_Job'!B11*B68",'0.0');
val(price,'A71','Tiết kiệm giả định USD/tháng');calc(price,'B71',"=(B69-B70)*'1_Cost_Job'!B102",'0.00');
detail(price,72,'Pool nhân sự so sánh USD/tháng',16000,'4 FTE × 160 giờ × 25 USD; alternative ceiling, không tuyên bố sa thải/thay hết 4 người.','0.00');
val(price,'A73','Trần hóa đơn theo 25% giá trị');calc(price,'B73','=B71*0.25','0.00');
val(price,'A74','Phút manual tối thiểu để hợp neo 25%');calc(price,'B74',"=(B59/0.25/'1_Cost_Job'!B102+B70)*60/('1_Cost_Job'!B11*'1_Cost_Job'!B83)",'0.00');
val(price,'A75','Giờ support/tháng tối đa GM 60%');calc(price,'B75',"='1_Cost_Job'!B96+((1-B32)*B59-B61)/'1_Cost_Job'!B102",'0.00');
val(price,'A76','Giờ support/tháng tối đa GM 50%');calc(price,'B76',"='1_Cost_Job'!B96+(0.5*B59-B61)/'1_Cost_Job'!B102",'0.00');
note(price,78,'B19/B21/B33 của mẫu là đơn giá HIỆU DỤNG tại 18 job hoàn thành. B33 giữ giá hiệu dụng cố định, không phải ngưỡng hợp đồng Hybrid. Ngưỡng đúng theo hóa đơn B57 + B58 × 20 × c là B64; nếu >100% thì không có tỷ lệ hoàn thành nào cứu được giá hiện tại.');
note(price,79,'Gói pilot: tối đa 20 job thử/tháng; tối đa 3.900 USD khi cả 20 hoàn thành. Không thu hai lần: phí nền mua workflow/support, không mua credits; phần batch thu từ job đầu tiên. Vượt volume/size/retention hoặc đổi model cần khách phê duyệt trước.');
S(price).getRange('A81:D81').values=[['Completion giả định','COGS/job','Hóa đơn Hybrid/tháng','GM Hybrid']];
for(let k=0;k<6;k++){const row=82+k;input(price,`A${row}`,[.5,.6,.7,.8,.9,.95][k]);S(price).getRange(`A${row}`).setNumberFormat('0%');calc(price,`B${row}`,`=$B$61/('1_Cost_Job'!$B$9*A${row})`,'0.00');calc(price,`C${row}`,`=$B$57+$B$58*'1_Cost_Job'!$B$9*A${row}`,'0.00');calc(price,`D${row}`,`=1-$B$61/C${row}`,'0.0%');}
val(price,'B6',3);form(price,'B10','=B71');form(price,'B11',"='1_Cost_Job'!B11");form(price,'B14','=B72');form(price,'B19','=B60');val(price,'B32',.6);
section(price,89,'STRESS TEST — COGS THAY ĐỔI');
S(price).getRange('A90:D90').values=[['Kịch bản','COGS tháng','GM Hybrid','Cách tính / phạm vi']];
const scenarios=[
 ['GPU giây/frame × 2',"=$B$61+'1_Cost_Job'!B9*'1_Cost_Job'!B105*(1+'1_Cost_Job'!B46)",'Chỉ tăng GPU; giữ CPU/RAM/time-study khác'],
 ['Support hours × 2',"=$B$61+'1_Cost_Job'!B96*'1_Cost_Job'!B102",'15 → 30 giờ/tháng, cùng hourly rate'],
 ['Fixed delivery COGS × 2',"=$B$61+'1_Cost_Job'!B113",'Tenant/VPC/support/security dự phòng đồng loạt tăng'],
 ['Unit labor rate × 2',"=$B$61+('1_Cost_Job'!B96+'1_Cost_Job'!B97)*'1_Cost_Job'!B102+'1_Cost_Job'!B9*'1_Cost_Job'!B115",'QA + delivery support + security/eval; OPEX chưa cộng'],
 ['Vendor list rates +25%',"=$B$61+0.25*('1_Cost_Job'!B9*('1_Cost_Job'!B108+'1_Cost_Job'!B109+'1_Cost_Job'!B112)+'1_Cost_Job'!B111+'6_Benchmarks'!B52)",'Tăng compute/storage/egress/Team; không đổi lương']
];
for(let z=0;z<scenarios.length;z++){const row=91+z;val(price,`A${row}`,scenarios[z][0]);calc(price,`B${row}`,scenarios[z][1],'0.00');calc(price,`C${row}`,`=1-B${row}/$B$59`,'0.0%');val(price,`D${row}`,scenarios[z][2]);}

const attr=[1,0,0,0,1], auto=[0,0,1,0,0];
attr.forEach((x,z)=>val(metric,`B${5+z}`,x));auto.forEach((x,z)=>val(metric,`B${13+z}`,x));
S(metric).getRange('A26:D27').values=[['Encord Index / Active','Platform + volume tiers','Enterprise: báo giá riêng; không công bố USD','https://encord.com/pricing/'],['Roboflow Data / Active Learning','Credits / Hybrid','Core 39 USD/tháng; tổng 20 credits; flex 6 USD/credit','https://roboflow.com/pricing ; https://roboflow.com/credits']];
const decisions={B30:'Hybrid',B31:'Khớp gợi ý SEAT hoặc HYBRID. Khách ADAS cần budget cap, RBAC/audit và review theo batch; chi phí chạy theo volume nên seat thuần có rủi ro.',B32:'Chọn 1.500 USD/workspace/tháng + 120 USD/batch hoàn thành (tối đa 1.000 frame); không bán mAP, không tính theo seat.',B33:'Attribution 2/10, Autonomy 1/10: audit và định nghĩa job có một phần; 192 test là QA chức năng. Chưa có customer acceptance, eval giá trị, mAP; Curator/Reviewer vẫn bắt buộc.',B34:'Lỗ nếu nhận dữ liệu/retention không cap, support kéo dài hoặc batch không được duyệt; dừng pilot khi GM stress <60%, đo và báo giá lại trước mở rộng.'};
for(const [a,v] of Object.entries(decisions))val(metric,a,v);
section(metric,37,'BẰNG CHỨNG CHO ĐIỂM — 0 CHƯA CÓ, 1 MỘT PHẦN, 2 RÕ RÀNG');
const scoreNotes=[
 ['Attribution Q1','1: có audit theo mô tả; chưa xác nhận lineage toàn bộ job→export→training.'],
 ['Attribution Q2','0: chưa có eval chọn dữ liệu/PII định lượng; 192 định nghĩa test không phải eval giá trị.'],
 ['Attribution Q3','0: chưa có khách trả tiền, chưa ký acceptance criteria.'],
 ['Attribution Q4','0: chưa A/B random sampling trên cùng budget/seed/test split; chưa causal mAP.'],
 ['Attribution Q5','1: định nghĩa billing đã đề xuất, chưa được khách nghiệm thu.'],
 ['Autonomy Q1','0: Curator chỉnh, Reviewer duyệt trước export.'],
 ['Autonomy Q2','0: chưa có đo chạy đêm/end-to-end vận hành.'],
 ['Autonomy Q3','1: có workflow review, chưa đo exception routing.'],
 ['Autonomy Q4','0: tất cả batch có người tham gia.'],
 ['Autonomy Q5','0: QA mẫu vendor không thay review từng batch của khách.']
];
scoreNotes.forEach(([a,b],z)=>{val(metric,`A${38+z}`,a);input(metric,`B${38+z}`,b);S(metric).getRange(`B${38+z}:D${38+z}`).merge();});
note(metric,49,'Roboflow là job liền kề (dataset/labeling/inference), không phải cùng hợp đồng curation ADAS; 1 credit = 1.000 auto-labeled images, theo credits page. Encord là benchmark curation gần nhất nhưng không công khai đơn giá. Không bịa USD/asset hoặc ép so giá ngang.');
detail(metric,51,'Phiên bản A — công cụ','Nền tảng AI hỗ trợ đội ADAS chọn lọc frame lái xe để gán nhãn.','Dễ rơi vào ngân sách phần mềm; Head of Data đề xuất, IT/CIO duyệt tool. Vai trò chưa xác nhận.');
detail(metric,52,'Phiên bản B — công việc','Chuẩn bị batch frame lái xe đã lọc PII, có scores/shortlist và manifest được Reviewer duyệt để đưa đi gán nhãn.','Ngân sách R&D/data operations; tiết kiệm giờ chọn batch thủ công, không cam kết tự thay Reviewer.');
detail(metric,53,'Chọn phiên bản B','Chọn B vì có thể đối chiếu với dòng ngân sách chuẩn bị dữ liệu và giờ Curator; không neo với phí chatbot.','Định vị không biến thành bán outcome mAP; vẫn billing Hybrid usage có kiểm soát.');
detail(metric,54,'Người đề xuất / ký duyệt','Head of Data/ADAS là sponsor; chủ ngân sách R&D/data operations ký, Procurement/IT đánh giá.','Giả định buying committee cần xác nhận trong 5 phỏng vấn, chưa có hợp đồng.');
detail(metric,55,'Ngân sách thanh toán','R&D / vận hành dữ liệu ADAS; không dùng ngân sách marketing.','Khách mục tiêu gồm OEM/đội ADAS như VinFast, chưa có buyer hoặc willingness-to-pay được xác nhận.');

form(channel,'B5',"='2_Pricing'!B59");val(channel,'B7','Enterprise');val(channel,'B13',i.ae_quota);val(channel,'B14',i.working_days);form(channel,'B20',"='6_Benchmarks'!B54");val(channel,'B21',i.win_rate);
const scores=[[3,4,2],[1,3,1],[2,2,1],[2,3,1],[2,4,2],[3,4,1]];
scores.forEach((row,z)=>S(channel).getRange(`B${28+z}:D${28+z}`).values=[row]);
const cv={B38:'Sales-Led',B39:'Không áp dụng: không chọn Partner-Led.',B40:'Chưa',B41:'Không áp dụng: chưa có partner/quan hệ được xác nhận.',B42:'Founder-led Sales-Led: thử 5 phỏng vấn và 1 design partner; giới hạn CPO 1.000 USD. Chưa tuyển AE, chưa chi acquisition 32.000 USD/khách.'};
for(const [a,v] of Object.entries(cv))val(channel,a,v);
section(channel,45,'CHI PHÍ MOTION CỦA RAV-26 — TẤT CẢ LÀ GIẢ ĐỊNH');
detail(channel,46,'Founder hours / opportunity',i.founder_hours_per_opportunity,'10 discovery + 12 presales/security + 8 follow-up; không tính vận hành pilot lại trong CAC.','0.0');
detail(channel,47,'Founder hourly cost USD',i.hourly_cost,'Fully-loaded 20 công + 5 phân bổ; không coi công founder là miễn phí.','0.00');
detail(channel,48,'Travel/tool/pre-sale USD/opp',i.founder_cash_per_opportunity,'Giả định 150 đi gặp + 100 tooling; chưa có hóa đơn.','0.00');
val(channel,'A49','CPO founder USD');calc(channel,'B49','=B46*B47+B48','0.00');
val(channel,'A50','CAC founder dự kiến');calc(channel,'B50','=B49/B21','0.00');
val(channel,'A51','CAC founder / budget lab');calc(channel,'B51','=B50/B9','0.00');
val(channel,'A52','Payback founder tháng');calc(channel,'B52','=B50/(B5*B6)','0.00');
detail(channel,53,'Payback target nội bộ (tháng)',12,'Thận trọng hơn trần Enterprise 24 tháng của mẫu; cần cash trước scale.','0');
val(channel,'A54','Budget CAC target nội bộ');calc(channel,'B54','=B5*B6*B53','0.00');
detail(channel,55,'AE fully-loaded USD/tháng',i.ae_monthly_cost,'Giả định Việt Nam: 2.000 fixed + 600 variable + 400 phụ phí; chưa tuyển.','0.00');
detail(channel,56,'Quota attainment',i.ae_attainment,'Giả định 75%, không phải kết quả sales hiện tại.','0.0%');
val(channel,'A57','Deals/year at attainment');calc(channel,'B57','=B13*B56/B10','0.00');
val(channel,'A58','AE cost/account chưa lead cost');calc(channel,'B58','=B55*12/B57','0.00');
val(channel,'A59','LTV:CAC tối thiểu thời gian giữ khách');calc(channel,'B59','=3*B50/(B5*B6)','0.00');
val(channel,'A60','Rep benchmark / target nội bộ');calc(channel,'B60','=B22/B54','0.00');
note(channel,62,'ICONIQ tr.22: 2026 CPO SMB 6.300; Mid-market/Enterprise 8.000; Strategic 11.200 USD. Chọn 8.000; win 25% là giả định RAV-26. Benchmark rep-driven không phải CAC đo của founder và không cộng chồng với AE-only cost B58.');
note(channel,63,'Ngưỡng deal/ngày chỉ kiểm tra số học, không chứng minh buyer access hay sales cycle. ACV chỉ là annualized run-rate khi dùng đều, chưa có hợp đồng năm. Trần CAC payback không phải tiền mặt sẵn có. Chưa thể công bố LTV do thiếu churn/retention.');
note(channel,64,'Scorecard là phán đoán có điều kiện: Sales-Led có budget và cần IT/procurement nhưng founder chưa xác nhận contact nên năng lực 2/5. PLG thấp do security/data approval; Partner thấp vì chưa có công ty/quan hệ đã nói chuyện. Chỉ chạy Sales-Led trong 90 ngày.');

const pv={
 B5:'16:30 thứ Sáu trước khi khóa batch gán nhãn (giả thuyết cần interview).',
 B6:'Curator rà frame cảnh hiếm/thiếu sáng và lập shortlist; Reviewer chờ duyệt manifest để chuyển vendor gán nhãn.',
 B7:'CVAT và kho object storage nội bộ (giả thuyết workflow, chưa được khách xác nhận).',
 B8:'Nút Import shortlist trong CVAT qua manifest JSON + object URI; webhook job/status. Chưa có connector được xác nhận đã triển khai.',
 B12:'Sales-Led do founder',C12:'Sales-Led do founder',D12:'Sales-Led — chỉ sau go/no-go',
 B13:'5 phỏng vấn; 1 design partner mục tiêu, chưa xác nhận.',C13:'2 pilot mục tiêu; 1 khách trả tiền trước ngày 90.',D13:'3 khách cùng ngách; chỉ sau 1 renewal và pilot đạt ngưỡng.',
 B14:'09/10–07/11/2026: Khánh gặp 5 data lead; xin baseline time-study.',C14:'08/11/2026–06/01/2027: pilot 4 tuần trên dữ liệu cho phép.',D14:'Từ 07/01/2027: tiếp tục ngách camera 2D cảnh đêm/mưa.',
 B15:'Chốt job/billing, quyền dữ liệu, acceptance và cap; xác nhận CVAT.',C15:'Chạy 20 batch thử, 1.000 frame/batch; log cost và reason fail.',D15:'Chỉ mở OEM thứ hai khi 1 renewal, GM ≥60% và PII gate đạt.',
 B16:'Test PII và export; lập DPA/data-flow draft; không tuyên bố mAP.',C16:'So matched random sampling bằng cùng annotation budget/seed/test split.',D16:'LiDAR/đa camera là phạm vi mới, phải benchmark và báo giá riêng.',
 B17:'5 interview; 1 acceptance draft; eval 500 frame; chưa coi là khách.',C17:'Completion mục tiêu ≥90%; critical PII=0 trên bộ 500; review ≤5h/job; GM ≥60%.',D17:'3 khách mục tiêu; 1 renewal; CAC founder ≤4.000 USD; chưa đo thực tế.',
 B18:'Phùng Gia Khánh (owner); QA/IT khách chỉ định khi ký pilot.',C18:'Phùng Gia Khánh + Reviewer khách (chưa chỉ định).',D18:'Phùng Gia Khánh; chỉ phân công thêm khi có capacity.',
 B23:'Chưa',C23:'Có QA chức năng theo người dùng: 192 định nghĩa test + browser flows pass. Chưa có eval PII/selection/containment/mAP.',D23:'Khánh · 23/10/2026: report 500 frame + 20 batch regression, commit/hash và CI logs.',
 B24:'Chưa',C24:'Draft Q&A: sai/PII → gate review; data train → cần DPA/config; exit → export manifest và delete proof.',D24:'Khánh · 30/10/2026: data-flow, subprocessor list, retention/export rehearsal; IT khách review.',
 B25:'Chưa',C25:'1 design partner ADAS chưa xác nhận; dự kiến 08/11–05/12/2026, 4 tuần, 20 batch/20.000 frame.',D25:'Khánh · 10/12/2026: report completion/cost/time-saving + mAP A/B nếu đủ nhãn; chưa có kết quả.',
 B29:'Tự kiểm: Được. Người lạ thật: chưa kiểm tra.',B30:'Tự kiểm: Được, dưới các giả định ghi rõ. Người lạ thật: chưa kiểm tra.',B31:'Tự kiểm: Được. Người lạ thật: chưa kiểm tra.',B32:'Chưa đo; không ghi 0. Khánh mời người ngoài dự án đọc và ghi số câu trước 15/10/2026.'
};
for(const [a,v] of Object.entries(pv))val(plan,a,v);
section(plan,35,'THÔNG TIN CẦN TRUY XUẤT CHO ONE-PAGER');
detail(plan,36,'Chủ bài / product','Phùng Gia Khánh · RAV-26 / P-026','Mã học viên 2A202602585; không có tên khách hàng paying.');
detail(plan,37,'Số định nghĩa test (theo người dùng)',192,'Nguồn: người dùng 08/10/2026; chưa phải 192 tests chạy pass; chưa kiểm chứng CI.','0');
detail(plan,38,'Eval frame mục tiêu',500,'50 mỗi slice: đêm/mưa/ngược sáng/blur/v.v.; benchmark mô tả trong evidence pack.','0');
detail(plan,39,'Pilot weeks mục tiêu',4,'08/11–05/12/2026; design partner chưa xác nhận.','0');
detail(plan,40,'Pilot batch thử mục tiêu',20,'1.000 frame/batch; 20.000 frame toàn pilot.','0');
detail(plan,41,'PII critical leaks mục tiêu',0,'Chỉ là acceptance target; chưa có kết quả đo và không suy ra rủi ro bằng 0.','0');
detail(plan,42,'Ngày eval due',new Date('2026-10-23T00:00:00Z'),'Phùng Gia Khánh chịu trách nhiệm.','dd/mm/yyyy');
detail(plan,43,'Ngày procurement due',new Date('2026-10-30T00:00:00Z'),'Draft chưa phải DPA/certification đã ký.','dd/mm/yyyy');
detail(plan,44,'Ngày pilot report due',new Date('2026-12-10T00:00:00Z'),'Không bịa pilot với VinFast.','dd/mm/yyyy');
detail(plan,45,'Ngày stranger test due',new Date('2026-10-15T00:00:00Z'),'Cần người ngoài đọc thật; kiểm tra AI không thay bước này.','dd/mm/yyyy');
detail(plan,46,'Ngày bắt đầu plan',new Date('2026-10-09T00:00:00Z'),'Day 1.','dd/mm/yyyy');
detail(plan,47,'Ngày kết thúc 90 ngày',new Date('2027-01-06T00:00:00Z'),'Day 90, tính cả ngày bắt đầu.','dd/mm/yyyy');
note(plan,49,'Ngách đầu: curated batch camera 2D cho cảnh đêm/mưa ADAS; VinFast là target account được đề xuất, chưa có contact/pilot/LOI. Không chạy Partner-Led hoặc PLG song song. Không gửi outreach trong bài này.');
note(plan,50,'Evals → attribution: regression chức năng bảo vệ workflow; PII/selection eval đo quality; matched random-sampling pilot đo causal downstream mAP. Chỉ khi đủ attribution mới xem xét outcome pricing; hiện giữ Hybrid usage.');

section(readme,27,'BÀI DAY 22 — PHÙNG GIA KHÁNH — RAV-26 / P-026');
note(readme,28,'Bài này dùng sản phẩm thật theo mô tả người dùng; giá và kênh là giả thuyết thử nghiệm, chưa có khách trả tiền. Các số vận hành không được trình bày như kết quả pilot. Repo chưa truy cập được (404).');
note(readme,29,'Template có tiêu đề DAY 28 và calculator CSKH; giữ nguyên nhãn/công thức mẫu. Phần bổ sung RAV-26 phía dưới mỗi tab giải thích đơn vị batch, CV compute, Hybrid và nguồn số. 5 tab làm việc + README và Benchmarks đúng cấu trúc gốc.');
note(readme,30,'Chỉ đổi nội dung ô vàng có sẵn. Đã thêm các block cần thiết trong cùng 7 tab: input vàng, công thức mới xám. Không đổi công thức xám gốc, không sửa bảng giá mẫu 26/08/2026; bảng giá hiện dùng đặt ở 6_Benchmarks!A45:D62.');
note(readme,31,'Các ô gốc B10/B33 có chữ containment: đọc là completion kỹ thuật, không phải autonomy. Ngưỡng Hybrid thực tế ở 2_Pricing!B64; nguyên mẫu B33 là ngưỡng giá hiệu dụng cố định.');
note(readme,32,'Giá USD trước VAT, FX là USD sell Vietcombank ngày 08/10/2026. API LLM/voice =0 có lý do, GPU tính vào Infra; retry GPU trong 1_Cost_Job!B109/B118. R&D/Sales tách OPEX, GM không phải lợi nhuận ròng.');
note(readme,33,'Evidence: xem evidence/ gồm Eval Results readiness, Procurement Q&A draft và Pilot Report protocol. Chưa có customer eval/mAP hay pilot; có owner/deadline. Phản biện AI được ghi accept/reject/partial trong critique_log.md, cần chủ bài rà soát quyết định trước nộp.');
note(readme,34,'One-Pager giữ 3 khối của mẫu DOCX và nén về 1 trang PDF theo yêu cầu. Mọi số đều có cell reference. Stranger test bằng người thật còn chờ; không tự công bố đã pass.');

// Fix only display dimensions needed to fit populated input text and new notes.
for(const sname of [cost,price,metric,channel,plan,bench,readme]){
 const s=S(sname);s.showGridLines=false;
 s.getRange('A1:A130').format.columnWidth=64;
 s.getRange('B1:B130').format.columnWidth=27;
 s.getRange('C1:C130').format.columnWidth=15;
 s.getRange('D1:D130').format.columnWidth=67;
 const last={ [cost]:127,[price]:95,[metric]:55,[channel]:64,[plan]:50,[bench]:62,[readme]:34}[sname];
 s.getRange(`A1:D${last}`).format.font.name='Arial';
 s.getRange(`A1:D${last}`).format.verticalAlignment='center';
 s.getRange(`D3:D${last}`).format.wrapText=true;
 s.freezePanes.freezeRows(2);
}
// Long input entries get their own height rather than overflowing adjoining columns.
S(cost).getRange('B5:C5').merge();S(cost).getRange('B5').format.wrapText=true;S(cost).getRange('A5:D5').format.rowHeight=100;
for(const [sn,rows] of [[metric,[31,32,33,34]],[channel,[39,41]],[plan,[5,6,7,8,29,30,31,32]]]){
 for(const row of rows){const end=(sn===channel&&row===39)||(sn===plan&&row===8)?'C':'D';const x=S(sn).getRange(`B${row}:${end}${row}`);x.merge();x.format.wrapText=true;S(sn).getRange(`A${row}:D${row}`).format.rowHeight=sn===metric?58:52;}
}
S(metric).getRange('A26:D27').format.wrapText=true;S(metric).getRange('A26:D27').format.rowHeight=76;
S(metric).getRange('B51:B55').format.wrapText=true;S(metric).getRange('A51:D55').format.rowHeight=150;
S(plan).getRange('B11:D25').format.columnWidth=42;
S(plan).getRange('B12:D25').format.wrapText=true;
S(plan).getRange('A12:D18').format.rowHeight=88;
S(plan).getRange('A23:D25').format.rowHeight=130;
S(plan).getRange('B35:B47').format.columnWidth=42;
S(bench).getRange('D47:D59').format.rowHeight=48;
S(bench).getRange('B47:B55').setNumberFormat('0.000000');
S(bench).getRange('B52:B54').setNumberFormat('#,##0.00');
S(bench).getRange('B47:B49').setNumberFormat('0.00000000');
S(bench).getRange('C47:C59').format.wrapText=true;
val(channel,'B42','Founder-led: xem B46:B60; 5 interview + 1 design partner trong tháng đầu; chưa tuyển AE.');
S(channel).getRange('B42:C42').format.wrapText=true;S(channel).getRange('A42:D42').format.rowHeight=100;
S(price).getRange('A81:D81').format.wrapText=true;S(price).getRange('A81:D81').format.rowHeight=40;
for(const sn of [cost,price,channel]){
 for(const row of (sn===cost?[83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102]:sn===price?[57,58,67,68,72]:[46,47,48,53,55,56])){
  S(sn).getRange(`A${row}:D${row}`).format.rowHeight=48;
 }
}
for(const [sn,addr] of [[price,'D82:D87'],[price,'C91:C95']]){
 S(sn).getRange(addr).conditionalFormats.add('cellIs',{operator:'lessThan',formula:0.6,format:{fill:'#FECACA',font:{color:'#991B1B'}}});
 S(sn).getRange(addr).conditionalFormats.add('cellIs',{operator:'greaterThanOrEqual',formula:0.6,format:{fill:'#DCFCE7',font:{color:'#166534'}}});
}

// Imported example caches can survive ordinary recalculation. Rebind the identical
// formula text to invalidate these caches without changing any template formula.
const original=JSON.parse(await fs.readFile('references/template_cells.json','utf8'));
for(const [sn,block] of Object.entries(original)) for(const row of block.rows) for(const cell of row){
 if(typeof cell.value==='string'&&cell.value.startsWith('='))form(sn,cell.cell,cell.value);
}
w.recalculate();
console.log((await w.inspect({kind:'table',range:"'2_Pricing'!A57:D76",include:'values,formulas',tableMaxRows:20,tableMaxCols:4,maxChars:5500})).ndjson);
console.log((await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:50},maxChars:2000})).ndjson);
const keys={cost:S(cost).getRange('B66:B67').values,price:S(price).getRange('B57:B76').values,channel:S(channel).getRange('B5:B23').values,founder:S(channel).getRange('B49:B60').values,attr:S(metric).getRange('B10').values,auto:S(metric).getRange('B18').values};
await fs.writeFile('tmp/qa/results.json',JSON.stringify(keys,null,2));
const refs=[[readme,'A27:D34'],[cost,'A62:D77'],[price,'A57:D65'],[metric,'A30:D34'],[channel,'A5:D24'],[plan,'A22:D25'],[bench,'A45:D59'],[price,'A81:D95'],[cost,'A105:D122']];
for(let z=0;z<refs.length;z++){const [sheetName,range]=refs[z];const p=await w.render({sheetName,range,scale:1.3,format:'png'});await fs.writeFile(`tmp/qa/model_${z}.png`,new Uint8Array(await p.arrayBuffer()));}
const output=await SpreadsheetFile.exportXlsx(w);await output.save('PhungGiaKhanh_Day22_model.xlsx');
console.log('Exported PhungGiaKhanh_Day22_model.xlsx');
