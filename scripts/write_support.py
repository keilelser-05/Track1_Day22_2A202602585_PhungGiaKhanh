from pathlib import Path
import openpyxl
w=openpyxl.load_workbook('PhungGiaKhanh_Day22_model.xlsx',data_only=True)
def x(sn,a):return w[sn][a].value
def money(v):return f'${v:,.2f}'
def pct(v):return f'{100*v:.2f}%'
c=x('2_Pricing','B61');n=x('1_Cost_Job','B9');p=x('2_Pricing','B19');base=x('2_Pricing','B57');usage=x('2_Pricing','B58')
rows='\n'.join(f'| {pct(s)} | {money(c/(n*s))} | {pct(1-c/(n*s*p))} | {money(base+usage*n*s)} | {pct(1-c/(base+usage*n*s))} |' for s in [.5,.6,.7,.8,.9])
critique=f'''# Nhật ký phản biện AI Day 22

Ngày 08/10/2026. Áp dụng các vai CFO/infrastructure và investor trong phiên làm bài này, dùng số từ workbook, không nhận kết quả từ một pilot chưa xảy ra. Prompt giữ tiếng Anh; nhận xét và xử lý bằng tiếng Việt. Cột accept/reject/partial là quyết định sửa **đề xuất cho bản nháp**, không phải bằng chứng Phùng Gia Khánh đã duyệt hay tự viết lại. Chủ bài cần rà soát trước nộp, đúng nguyên tắc AI là công cụ critique của lab.

## Prompt 4.7.1 đã áp dụng

```text
Act as a ruthless CFO and a skeptical infrastructure engineer.
Review the Cost/Job model for an AI product below.

Do NOT rewrite my numbers. Perform a stress test:

1. MISSING COST CATEGORIES
   List every cost category I have omitted or underestimated for
   THIS specific product type. Focus especially on:
   - Retry and timeout costs
   - Human-in-the-loop cost, and WHO actually bears it
   - Observability, logging, eval running costs
   - Egress, storage, vector DB growth over time
   For each, estimate a realistic value at my stated volume.

2. DENOMINATOR CHECK
   Am I dividing by jobs ATTEMPTED or jobs COMPLETED?
   Recalculate Cost/Job using completed jobs only.
   State the difference as a percentage.

3. TOKEN MATH AUDIT
   Recompute my LLM cost per job from the token counts and
   list prices I provided. Flag any arithmetic error.
   Tell me how much prompt caching and batch pricing would save,
   and whether batch is viable for my latency requirement.

4. PRICE VOLATILITY
   Which of the prices I used are promotional or likely to change
   within 6 months? Recompute Cost/Job at list price.

5. BREAKEVEN SENSITIVITY
   Solve for the minimum success/containment rate required to hit
   60% gross margin at my proposed price. Show the algebra.
   Then show Cost/Job and gross margin at success rates of
   50%, 60%, 70%, 80%, 90%.

6. THE ONE NUMBER THAT KILLS ME
   Identify the single input that, if wrong by 2x, breaks the model.

Be direct and highly critical. Use my numbers, show your arithmetic.
Do not be encouraging. Find the problems before my investors do.

Product: RAV-26 / P-026, ADAS frame curation and batch export.
Job: up to 1,000 unique frames, PII gate, CV scores and shortlist,
versioned manifest, customer Reviewer approval, successful export.
20 attempts/month; 90% assumed technical completion; 18 completed.
No measured autonomous containment or downstream mAP attribution.
HITL A: customer pays Curator, Reviewer and annotation; vendor pays QA,
delivery support and security/eval operations.
No LLM, speech or telephony; token count and token API cost are zero.
Modal L4 $0.000222/GPU-second; Functions CPU $0.0000131/core-second;
RAM $0.00000222/GiB-second; volumes $0.09/GiB-month;
egress $0.04/GiB; Team plan $250/month. Checked 2026-10-08.
Assumed 1.5 GPU-seconds/frame; 3,000 CPU-seconds/batch, 2 physical cores,
8 GiB RAM, region multiplier 1.75; 8% one-full-rerun equivalent.
2 MiB/frame; original plus derivative factor 2; rolling retention 3 months;
2 GiB egress/job; $0.10 request/IO reserve/job.
DB/API $100/month; logs/backups $50/month;
delivery support 15 hours/month; security/eval 5 hours/month;
loaded labor $25/hour; QA 10% of batches for 120 minutes each.
R&D overhead $900/month; sales overhead $300/month, outside gross margin.
All operations are estimates, not measured invoices or benchmark timings.
Price: $1,500/workspace/month plus $120/completed batch.
Base invoice $3,660/month, effective $203.3333/completed batch.
Keep the original template fixed-effective-price calculation separate
from the actual Hybrid contract. Do not grant an unverified 50% batch discount.
```

### Kết quả CFO và infrastructure

**Mẫu số.** COGS tháng {money(c)}. Chia 20 attempts ra {money(c/n)}, nhưng phải chia 18 completed ra {money(c/18)}: tăng 11,11%. Tất cả batch lỗi vẫn có COGS. Tỷ lệ 90% không phải eval hay autonomy; chỉ là giả định để tính số job được nghiệm thu.

**API/token.** Không có LLM chat hay voice trong phương án giả định này. Không áp biểu giá token lên ảnh và không bịa 30–40% tiết kiệm cache. GPU 1.000 × 1,5 × 1,75 × 0,000222 = $0,58275/batch. CPU $0,13755 và RAM $0,09324; tổng compute $0,81354. Retry 8% = $0,0650832/batch, tức $1,301664/tháng. Retry được cộng trong Infra B41; dòng retry token của template = 0 hợp lệ, không dùng nó làm con số retry thật.

**Khoản có thể thiếu/đánh giá thấp.** Cold start, model load, billable idle, video decode thực tế chưa đo; 1,5 giây/frame có thể thấp. GPU time ×2 chỉ đưa GM về {pct(x('2_Pricing','C91'))}, nên GPU không phải rủi ro sinh tử hiện tại. Budget DB/API $100 và logs/backups $50 là dự phòng, không invoice. Retention rolling tính 234,375 GiB, tránh chỉ tính tháng đầu. Requests/IO $0,10/job chưa đủ để bảo đảm mọi vendor phí. Model commercial license, dedicated VPC/on-prem, pen-test/insurance và SLA support riêng chưa có báo giá; phải tách SoW/quote, không tuyên bố gói hiện tại cover. Khoản lớn nhất là fixed delivery COGS $900/tháng, trong đó labor support/security $500.

**HITL.** QA $100/tháng đã tính. Vendor còn chịu $375 support và $125 security/eval trong fixed delivery COGS; các khoản này hiện nằm ở schedule Infra, không bị quên. Khách chịu Curator/Reviewer và annotation, không được gọi là AI tự trị hoặc thay toàn bộ lao động. Chi phí khách vẫn làm được trừ khỏi neo tiết kiệm. Overhead $1.200 tách riêng; full cost {money(x('1_Cost_Job','B67'))}/job và marge sau COGS/OPEX {pct(x('2_Pricing','B63'))}, không phải GM hay lợi nhuận ròng.

**Biến động giá.** Model dùng list và gross allowances, không khuyến mại hay credits startup. Async batch hợp workflow nhưng không xác nhận có giảm 50% của provider. List rate +25% đưa GM về {pct(x('2_Pricing','C95'))}. Modal chỉ là phương án cost proxy; data residency/architecture khác phải re-cost.

**Breakeven.** Đặt c là completion kỹ thuật, N=20 và C={c:.6f}. Hóa đơn Hybrid = 1.500 + 120 × 20 × c. Để GM ≥60%:

```text
1 - C / (1500 + 2400*c) >= 0.60
1500 + 2400*c >= C / 0.40
c >= (1042.266214 / 0.40 - 1500) / 2400
c >= 0.4606939729
```

Vậy ngưỡng đúng là {pct(x('2_Pricing','B64'))}; theo job nguyên cần ít nhất 10/20, không bán một phần job. B33 mẫu giữ giá hiệu dụng {money(p)} cố định cho ngưỡng {pct(x('2_Pricing','B33'))}; không trình bày nó là ngưỡng hợp đồng Hybrid. Ngưỡng cố định cần ít nhất 13/20 job. Hai số không mâu thuẫn vì khác giả định doanh thu.

| Completion giả định | Cost/completed job | GM giá hiệu dụng cố định | Hóa đơn Hybrid | GM Hybrid |
| --- | --- | --- | --- | --- |
{rows}

**Một số có thể giết model.** Fixed delivery COGS ×2, từ $900 lên $1.800/tháng, khiến GM {pct(x('2_Pricing','C93'))}, dưới 50%. Support riêng tăng từ 15 lên 30 giờ còn {pct(x('2_Pricing','C92'))}; vượt {x('2_Pricing','B75'):.2f} giờ/tháng mất mục tiêu 60%, vượt {x('2_Pricing','B76'):.2f} giờ xuống dưới 50%. Không dùng demo hoặc giá GPU giảm để che rủi ro service/tenant costs.

### Accept / reject / partial và sửa trong bản nháp

| Nhận xét | Quyết định đề xuất | Thay đổi có thể kiểm tra |
| --- | --- | --- |
| GPU không phải token API; retry mẫu chưa bao GPU | Accept | Schedule CV B105:B118; B41 liên kết all-in, giữ công thức xám gốc |
| Mẫu số phải completed | Accept | B66/B117 chia 18; B120 nêu 11,11% chênh lệch |
| Không nhận giảm Batch/cache chưa chứng minh | Reject ưu đãi giả định | Không dùng -50%, không savings cache vào giá |
| Thiếu model license/on-prem/security dedicated quote | Partial | Tách phạm vi commercial quote; Procurement checklist yêu cầu license + data-flow. Chi phí chưa thể xác nhận |
| Phải phân biệt fixed-price và Hybrid break-even | Accept | B64/B65 + sensitivity Hybrid; One-Pager hiện cả B33 và B64 |
| Giá sàn nên hiển thị gồm mọi overhead | Partial | GM dùng COGS theo lab; full cost/OPEX hiển thị riêng, không gọi overhead là COGS |

## Prompt 4.7.5 đã áp dụng

```text
I wrote this Monetization One-Pager for an AI product:

"RAV-26 curates ADAS driving frames into review-approved labeling batches.
Target users are Curator, Reviewer and Admin. VinFast is only a target account;
no paying customer, confirmed design partner or customer-approved billing exists.
Sponsor and buyer roles are assumptions: Head of Data/ADAS and R&D/data operations
budget owner, with IT and Procurement review.
One completed job contains up to 1,000 frames, PII gate, CV scores/shortlist,
versioned manifest and successful export after customer Reviewer approval.
Hybrid $1,500/workspace/month plus $120/completed batch.
Attribution 2/10, Autonomy 1/10; 192 test definitions are functional QA evidence,
not measured containment, selection utility or downstream mAP.
20 attempts, 90% assumed completion, 18 completed; COGS $1,042.266214/month,
cost/job $57.90367856; floor $173.71103567; invoice $3,660;
effective price $203.3333333; GM 71.52278104%.
True Hybrid completion threshold for 60% GM 46.06939729%; fixed-effective-price
template threshold 64.07374266%. Full cost including OPEX $124.57034522/job.
Assumed manual time 2.5 minutes/frame; customer still spends 5 hours/job;
loaded labor $25/hour; savings $16,500/month; 25% ceiling $4,125.
Actual baseline must be at least 2.252 minutes/frame to justify that price anchor.
Fixed delivery COGS doubled leads to 46.93261656% GM.
Only one 90-day channel: founder-led Sales-Led.
CAC ceiling $62,825.610864 using Enterprise 24-month payback;
internal 12-month ceiling $31,412.805432.
ICONIQ Mid-market/Enterprise CPO $8,000; assumed win 25%; rep CAC $32,000;
quota $300,000/year; ACV $43,920; 250 workdays; 0.0273224 deals/day.
Founder CPO $1,000 from 30 hours at $25/hour plus $250 cash;
estimated CAC $4,000; payback 1.528 months, not measured.
Hypothetical pain moment: 16:30 Friday, preparing a labeling shortlist in CVAT.
Proposed manifest import/webhook integration is not verified implemented.
Owner Phung Gia Khanh: 5 interviews and 1 design partner in month 1;
2 pilots and 1 paying customer by day 90; expansion after renewal and quality/GM gates.
Functional QA is user-reported; quantitative eval due 2026-10-23;
Procurement data-flow/DPA/config review due 2026-10-30;
pilot report due 2026-12-10; human stranger test pending by 2026-10-15."

Evaluate it the way a Series A investor reading 50 decks today would:
1. For each number, can you tell WHY it is that number and not another?
   List any number that appears unjustified.
2. Which claim would you push back on first, and what exactly would you ask?
3. Could a competing founder write this same one-pager with their own numbers
   swapped in? If yes, point to the generic sentences.
4. Is pricing internally consistent? Check Cost/Job, price, gross margin
   and breakeven success rate arithmetically.
5. Does the channel follow logically from ARPU and the pain moment?
6. Suggest ONE specific edit that would make this 10x more defensible.
Be brutally honest. I would rather hear it from you now.
```

### Kết quả kiểm tra defensibility

Các phép tính khớp, nhưng **khớp Excel không biến giả định thành bằng chứng thị trường**. Giá trị yếu nhất là 2,5 phút manual/frame và 5 giờ review/job: chưa có time-study. Giá gói $1.500 + $120 là quote giả thuyết để thử, không willingness-to-pay đã xác nhận. Mỗi khoản vận hành có lý do/config/cap, nhưng throughput 1,5 giây và hourly cost $25 chưa đo; cần điều chỉnh theo log/invoice.

Attribution/autonomy được chấm thấp vì test QA không chứng minh mAP; chọn Hybrid thay vì Outcome là đúng giới hạn hiện tại. Completion 90% chỉ lập kế hoạch, không gọi là eval. Câu hỏi investor đầu tiên: “Cho tôi baseline chọn frame và invoice gán nhãn, rồi cho biết ai ký chấp thuận shortlist và giá.” Nếu baseline thực đo thấp hơn 2,252 phút/frame, neo 25% này không đứng vững; phải thay pricing/scope, không thay dữ liệu baseline cho đẹp.

Phần “Sales-Led cho doanh nghiệp” còn generic. Chi tiết ít generic hơn: shortlist frame cảnh đêm/mưa, Curator → Reviewer → export, PII gate, CVAT manifest surface và không bán causal mAP trước A/B. Tuy nhiên CVAT/16:30 chưa được khách xác nhận, nên vẫn là interview hypothesis. Phải sửa pain moment nếu interview cho thấy họ dùng công cụ/giờ khác.

Rep benchmark CAC $32.000 vừa vượt budget nội bộ 12 tháng ({x('4_Channel_Fit','B60'):.3f}×), dù dưới trần lab 24 tháng. Founder CAC $4.000 khả thi trên giấy; chưa có conversion hoặc sales-cycle thực tế. Chốt founder motion, không tuyển AE ngay. Budget CAC là trần unit economics, không chứng minh tiền mặt đủ chạy kênh.

Chỉnh sửa có giá trị nhất đã đưa vào One-Pager: **nêu baseline tối thiểu 2,25 phút/frame để giá đứng vững và yêu cầu đo trước commercial quote**. Không để “tiết kiệm $16.500” đứng một mình như kết quả khách hàng.

| Nhận xét | Quyết định đề xuất | Chỗ sửa / còn thiếu |
| --- | --- | --- |
| Giá trị tiết kiệm chưa được đo | Accept | Gắn nhãn giả định + break-even value anchor B74; time-study trong protocol |
| QA 192 ≠ eval giá trị | Accept | Evidence tách known functional QA và missing mAP/PII eval |
| Procurement “no train” chưa đủ proof | Accept | Q&A draft nêu DPA/subprocessor/config chưa có, không bảo đảm suông |
| Rep-driven CAC không phải founder CAC | Accept | Tính 2 motion riêng B22 vs B50; cap internal 12 tháng |
| Tăng giá ngay để model đẹp hơn | Reject | Không tăng giá để đạt GM; giữ thử quote và quality/time-study gates |
| Stranger test bằng AI thay nhóm khác | Reject | Chỉ self-check; người ngoài chưa đọc, không ghi pass/0 câu hỏi |

## Self-check đọc hiểu (không thay stranger test)

1. Bán workflow chuẩn bị batch frame ADAS cho data team, fee nền + batch hoàn thành, không mAP.
2. COGS/job {money(x('1_Cost_Job','B66'))}, giá hiệu dụng {money(p)}, GM {pct(x('2_Pricing','B21'))} dưới giả định; full cost/OPEX riêng.
3. Chỉ Sales-Led do founder, vì buyer cần IT/data/security approval; CAC dự kiến $4.000 nhưng chưa đo.

Không có người lạ thật đọc trong phiên này. Phùng Gia Khánh cần ghi số câu hỏi thực tế và phản hồi trước 15/10/2026; không dùng self-check để tuyên bố đạt rubric này.
'''
Path('critique_log.md').write_text(critique,encoding='utf-8')

readme=f'''# Day 22 Monetization Lab — RAV-26 / P-026

**Phùng Gia Khánh · 2A202602585 · ngày chốt 08/10/2026.**

RAV-26 chọn lọc ảnh/frame lái xe để đưa đi gán nhãn: nhập dữ liệu → PII gate → CV/uncertainty → shortlist → Curator chỉnh → Reviewer duyệt → export. Khách mục tiêu là đội dữ liệu/AI ADAS, như VinFast; **chưa có khách trả tiền được xác nhận**.

## File nộp

- [PhungGiaKhanh_Day22_model.xlsx](PhungGiaKhanh_Day22_model.xlsx): đủ 5 tab làm việc và 2 tab tham chiếu theo mẫu; đầu vào vàng, công thức xám.
- [PhungGiaKhanh_Day22_onepager.pdf](PhungGiaKhanh_Day22_onepager.pdf): đúng 1 trang, giữ 3 khối Pricing / GTM / Evidence; mỗi số có tham chiếu ô Excel.
- [Nhật ký phản biện](critique_log.md): áp dụng prompt 4.7.1 và 4.7.5, có phản hồi và accept/reject/partial đề xuất.
- [Evidence Pack](evidence/): ba tài sản bằng văn bản, phân biệt evidence hiện có với việc chưa làm và deadline.

## Quyết định và kết quả cơ sở

Chọn **Hybrid**: {money(base)}/workspace/tháng + {money(usage)}/batch hoàn thành, tối đa 1.000 frame/batch. Phí nền mua workflow/phân quyền/audit/support, không mua credits; batch lỗi/duplicate/retry không tính thêm. Có Curator/Reviewer nên chưa bán Outcome mAP; Attribution 2/10, Autonomy 1/10.

| Chỉ số | Giá trị dưới giả định | Ô Excel |
| --- | --- | --- |
| Attempts/tháng | 20 | `1_Cost_Job!B9` |
| Completion kỹ thuật, chưa đo | 90% → 18 completed | `1_Cost_Job!B10:B11` |
| Cost/job completed chưa OPEX | {money(x('1_Cost_Job','B66'))} | `1_Cost_Job!B66` |
| Full cost gồm OPEX | {money(x('1_Cost_Job','B67'))} | `1_Cost_Job!B67` |
| Giá sàn = 3 × COGS/job | {money(x('2_Pricing','B7'))} | `2_Pricing!B7` |
| Giá hiệu dụng cơ sở | {money(p)} | `2_Pricing!B19` |
| Hóa đơn tháng cơ sở | {money(x('2_Pricing','B59'))} | `2_Pricing!B59` |
| GM | {pct(x('2_Pricing','B21'))} | `2_Pricing!B21` |
| Completion đạt GM ≥60%, hợp đồng Hybrid | {pct(x('2_Pricing','B64'))}; cần ≥10/20 job nguyên | `2_Pricing!B64` |
| Ngưỡng giá hiệu dụng cố định của mẫu | {pct(x('2_Pricing','B33'))}; khác mô hình doanh thu | `2_Pricing!B33` |
| Trần hóa đơn, 25% saving giả định | {money(x('2_Pricing','B73'))} | `2_Pricing!B73` |
| Baseline manual tối thiểu để bảo vệ neo giá | {x('2_Pricing','B74'):.3f} phút/frame | `2_Pricing!B74` |
| COGS cố định ×2 → GM | {pct(x('2_Pricing','C93'))} | `2_Pricing!C93` |
| Budget CAC trần lab Enterprise | {money(x('4_Channel_Fit','B9'))} | `4_Channel_Fit!B9` |
| Deal/AE/ngày | {x('4_Channel_Fit','B16'):.4f} | `4_Channel_Fit!B16` |
| CAC rep benchmark / budget lab | {money(x('4_Channel_Fit','B22'))} / {x('4_Channel_Fit','B23'):.3f}× | `4_Channel_Fit!B22:B23` |
| CAC founder giả định | {money(x('4_Channel_Fit','B50'))} | `4_Channel_Fit!B50` |

**Kênh duy nhất:** Sales-Led do founder Phùng Gia Khánh. Pain moment giả thuyết: 16:30 thứ Sáu chuẩn bị batch gán nhãn trong CVAT; điểm nhúng đề xuất là manifest import/webhook. Chưa có connector hoặc workflow khách được xác nhận. 90 ngày: 09/10/2026–06/01/2027; 5 interview + 1 design partner trong tháng đầu; 2 pilot và 1 khách trả tiền mục tiêu trước ngày 90; mở rộng sau renewal/quality/GM gates.

## Cách đọc mô hình

Template là calculator CSKH, có tiêu đề DAY 28 và nhãn containment “AI tự làm xong”. Giữ nguyên nội dung ô không vàng và mọi công thức xám gốc, bổ sung schedule RAV-26 trong cùng 7 tab. Những nhãn đó phải đọc theo ghi chú sản phẩm:

- `1_Cost_Job!B10` là **completion kỹ thuật sau human review**, không phải autonomy hay attribution mAP.
- Không có LLM/speech/telephony nên các khoản này bằng 0 có lý do; CV compute dùng GPU ở Infra.
- Retry GPU/CPU/RAM nằm ở `B109 → B114 → B41`, tiền tháng ở `B118`; dòng Retry API token gốc bằng 0 không có nghĩa retry sản phẩm bằng 0.
- HITL A: khách chịu Curator/Reviewer và gán nhãn. Vendor chịu QA, support/security/eval; labor fixed delivery có trong schedule Infra, không bị bỏ sót. R&D/Sales là OPEX tách GM; GM không phải lợi nhuận ròng.
- `2_Pricing!B64` là ngưỡng đúng của Hybrid; `B33` là ngưỡng mô hình fixed-effective-price của mẫu. Không dùng nhầm khi thay completion.
- Bảng giá mẫu dòng 5–41 chưa kiểm tra lại và không dùng cho RAV-26. Giá đã kiểm tra đặt tại `6_Benchmarks!A45:D62`.
- Chưa có test report độc lập/CI access. 192 định nghĩa test theo chủ bài, không đồng nghĩa 192 tests pass, containment 90%, PII leak 0 hay mAP tăng.

## Nguồn đã kiểm tra

1. [File mẫu Day 22 trên Drive](https://drive.google.com/drive/folders/1lAN_fxwtTr1fOHm1SoPR7OH3F0Z8D5Ya): tải được cả XLSX và DOCX. PDF giữ các khối nội dung của DOCX, nén về một trang theo yêu cầu.
2. [Modal pricing](https://modal.com/pricing): Functions GPU/CPU/RAM, Volumes, network, Team và hệ số region; kiểm tra 08/10/2026. Dùng gross list, không credits/free allowances. Modal là giả định kiến trúc để lập giá, chưa phải stack repo đã kiểm chứng.
3. [Vietcombank](https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx): USD bán 26.100 VND lúc 19:11:46 ngày 08/10/2026. Giá chính dùng USD trước VAT; FX phục vụ quy đổi.
4. [Encord pricing](https://encord.com/pricing/): curation/active learning theo platform/volume tiers; Enterprise không công bố số USD, không bịa đơn giá.
5. [Roboflow pricing](https://roboflow.com/pricing) và [credits](https://roboflow.com/credits): Core 39 USD/tháng, tổng 20 credits; flex 6 USD/credit; 1.000 auto-labeled images/credit là job liền kề, không tương đương RAV curation. Giá kiểm tra 08/10/2026.
6. [ICONIQ State of GTM 2026](https://www.iconiq.com/growth/reports/state-of-go-to-market-2026), PDF tr.22: CPO 2026 SMB 6.300; Mid-market/Enterprise 8.000; Strategic 11.200. Đã xem trang gốc và chọn đúng phân khúc. Win 25% là giả định của bài.
7. [P-026](https://github.com/AI20K-Build-Phase-Cohort-4/P-026): GitHub connector trả 404; facts sản phẩm dựa trên thông tin người dùng, chưa đọc được code. Không suy ra repo bị xóa hoặc không có sản phẩm.

## Kiểm tra đã thực hiện

- 16 phép đối chiếu tính toán độc lập bằng Python từ các input, bao gồm COGS, GM, giá sàn, break-even Hybrid và fixed-price, CAC và quota.
- 9 kiểm tra đổi input trong bản import dùng riêng: completion 50%, support 30 giờ, khôi phục cơ sở; xác nhận Cost/Job, invoice, GM và ARPU thay đổi đúng.
- Không thay công thức xám gốc; không thay nội dung ô không vàng; không còn ô vàng bắt buộc trống, không lỗi công thức trong XLSX lưu ra; tổng tỷ trọng chi phí =100%.
- Đã render và xem các vùng chính của cả 7 tab; PDF render đúng 1 trang, font tiếng Việt đầy đủ, không clipping/overlap.
- Chưa mở native Microsoft Excel. Artifact calculation + cached XLSX đã kiểm tra, không tuyên bố đã test native Excel.

## Việc cần dữ liệu/người thật trước khi coi là validated

- Eval định lượng/CI evidence: 23/10/2026, Khánh phụ trách.
- DPA/subprocessor/config/license/restore evidence: 30/10/2026.
- Pilot Report: 10/12/2026, design partner chưa xác nhận.
- **Stranger test chưa thực hiện**: người ngoài dự án đọc 2 phút, ghi số câu hỏi thật; mục tiêu ≤3 câu, deadline 15/10/2026. AI self-check không thay bước này.
- Chủ bài cần rà soát giả định và quyết định accept/reject/partial; chưa có bằng chứng người dùng đã tự viết lại nội dung AI như yêu cầu lab.

Không dùng mục tiêu/deadline làm kết quả đã đạt và không tự chấm điểm Outstanding khi thiếu buyer/eval/pilot.

## Nộp bài

Repo trong workspace đã có remote: `https://github.com/keilelser-05/Track1_Day22_2A202602585_PhungGiaKhanh`.
Nộp link repo trên Vlearn sau khi đưa các file lên GitHub. Việc nộp trên Vlearn và liên hệ khách hàng chưa được thực hiện.

## Tái tạo

Scripts nằm trong `scripts/`. `inputs.json` là input machine-readable; `build_model.mjs` dùng `@oai/artifact-tool`, `build_onepager.py` đọc kết quả XLSX và tạo PDF, `check_model.py` đối chiếu độc lập. Tải 2 file mẫu từ Drive vào `references/Day22_template.xlsx` và `references/Day22_template.docx`, chạy `scripts/inspect_templates.py` để tạo `template_cells.json`; thư mục references/tmp và dependency junction không cần nộp. Đây là môi trường Codex Windows; đường dẫn runtime/fonts phải thay khi chạy ở máy khác. Không cần scripts để mở Excel hoặc PDF nộp bài.
'''
Path('README.md').write_text(readme,encoding='utf-8')
print('README.md and critique_log.md generated from saved workbook values')
