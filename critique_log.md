# Nhật ký phản biện AI Day 22

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

**Mẫu số.** COGS tháng $1,042.27. Chia 20 attempts ra $52.11, nhưng phải chia 18 completed ra $57.90: tăng 11,11%. Tất cả batch lỗi vẫn có COGS. Tỷ lệ 90% không phải eval hay autonomy; chỉ là giả định để tính số job được nghiệm thu.

**API/token.** Không có LLM chat hay voice trong phương án giả định này. Không áp biểu giá token lên ảnh và không bịa 30–40% tiết kiệm cache. GPU 1.000 × 1,5 × 1,75 × 0,000222 = $0,58275/batch. CPU $0,13755 và RAM $0,09324; tổng compute $0,81354. Retry 8% = $0,0650832/batch, tức $1,301664/tháng. Retry được cộng trong Infra B41; dòng retry token của template = 0 hợp lệ, không dùng nó làm con số retry thật.

**Khoản có thể thiếu/đánh giá thấp.** Cold start, model load, billable idle, video decode thực tế chưa đo; 1,5 giây/frame có thể thấp. GPU time ×2 chỉ đưa GM về 71.18%, nên GPU không phải rủi ro sinh tử hiện tại. Budget DB/API $100 và logs/backups $50 là dự phòng, không invoice. Retention rolling tính 234,375 GiB, tránh chỉ tính tháng đầu. Requests/IO $0,10/job chưa đủ để bảo đảm mọi vendor phí. Model commercial license, dedicated VPC/on-prem, pen-test/insurance và SLA support riêng chưa có báo giá; phải tách SoW/quote, không tuyên bố gói hiện tại cover. Khoản lớn nhất là fixed delivery COGS $900/tháng, trong đó labor support/security $500.

**HITL.** QA $100/tháng đã tính. Vendor còn chịu $375 support và $125 security/eval trong fixed delivery COGS; các khoản này hiện nằm ở schedule Infra, không bị quên. Khách chịu Curator/Reviewer và annotation, không được gọi là AI tự trị hoặc thay toàn bộ lao động. Chi phí khách vẫn làm được trừ khỏi neo tiết kiệm. Overhead $1.200 tách riêng; full cost $124.57/job và marge sau COGS/OPEX 38.74%, không phải GM hay lợi nhuận ròng.

**Biến động giá.** Model dùng list và gross allowances, không khuyến mại hay credits startup. Async batch hợp workflow nhưng không xác nhận có giảm 50% của provider. List rate +25% đưa GM về 69.54%. Modal chỉ là phương án cost proxy; data residency/architecture khác phải re-cost.

**Breakeven.** Đặt c là completion kỹ thuật, N=20 và C=1042.266214. Hóa đơn Hybrid = 1.500 + 120 × 20 × c. Để GM ≥60%:

```text
1 - C / (1500 + 2400*c) >= 0.60
1500 + 2400*c >= C / 0.40
c >= (1042.266214 / 0.40 - 1500) / 2400
c >= 0.4606939729
```

Vậy ngưỡng đúng là 46.07%; theo job nguyên cần ít nhất 10/20, không bán một phần job. B33 mẫu giữ giá hiệu dụng $203.33 cố định cho ngưỡng 64.07%; không trình bày nó là ngưỡng hợp đồng Hybrid. Ngưỡng cố định cần ít nhất 13/20 job. Hai số không mâu thuẫn vì khác giả định doanh thu.

| Completion giả định | Cost/completed job | GM giá hiệu dụng cố định | Hóa đơn Hybrid | GM Hybrid |
| --- | --- | --- | --- | --- |
| 50.00% | $104.23 | 48.74% | $2,700.00 | 61.40% |
| 60.00% | $86.86 | 57.28% | $2,940.00 | 64.55% |
| 70.00% | $74.45 | 63.39% | $3,180.00 | 67.22% |
| 80.00% | $65.14 | 67.96% | $3,420.00 | 69.52% |
| 90.00% | $57.90 | 71.52% | $3,660.00 | 71.52% |

**Một số có thể giết model.** Fixed delivery COGS ×2, từ $900 lên $1.800/tháng, khiến GM 46.93%, dưới 50%. Support riêng tăng từ 15 lên 30 giờ còn 61.28%; vượt 31.87 giờ/tháng mất mục tiêu 60%, vượt 46.51 giờ xuống dưới 50%. Không dùng demo hoặc giá GPU giảm để che rủi ro service/tenant costs.

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

Rep benchmark CAC $32.000 vừa vượt budget nội bộ 12 tháng (1.019×), dù dưới trần lab 24 tháng. Founder CAC $4.000 khả thi trên giấy; chưa có conversion hoặc sales-cycle thực tế. Chốt founder motion, không tuyển AE ngay. Budget CAC là trần unit economics, không chứng minh tiền mặt đủ chạy kênh.

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
2. COGS/job $57.90, giá hiệu dụng $203.33, GM 71.52% dưới giả định; full cost/OPEX riêng.
3. Chỉ Sales-Led do founder, vì buyer cần IT/data/security approval; CAC dự kiến $4.000 nhưng chưa đo.

Không có người lạ thật đọc trong phiên này. Phùng Gia Khánh cần ghi số câu hỏi thực tế và phản hồi trước 15/10/2026; không dùng self-check để tuyên bố đạt rubric này.
