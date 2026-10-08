# Day 22 Monetization Lab — RAV-26 / P-026

**Phùng Gia Khánh · 2A202602585 · ngày chốt 08/10/2026.**

RAV-26 chọn lọc ảnh/frame lái xe để đưa đi gán nhãn: nhập dữ liệu → PII gate → CV/uncertainty → shortlist → Curator chỉnh → Reviewer duyệt → export. Khách mục tiêu là đội dữ liệu/AI ADAS, như VinFast; **chưa có khách trả tiền được xác nhận**.

## File nộp

- [PhungGiaKhanh_Day22_model.xlsx](PhungGiaKhanh_Day22_model.xlsx): đủ 5 tab làm việc và 2 tab tham chiếu theo mẫu; đầu vào vàng, công thức xám.
- [PhungGiaKhanh_Day22_onepager.pdf](PhungGiaKhanh_Day22_onepager.pdf): đúng 1 trang, giữ 3 khối Pricing / GTM / Evidence; mỗi số có tham chiếu ô Excel.
- [Nhật ký phản biện](critique_log.md): áp dụng prompt 4.7.1 và 4.7.5, có phản hồi và accept/reject/partial đề xuất.
- [Evidence Pack](evidence/): ba tài sản bằng văn bản, phân biệt evidence hiện có với việc chưa làm và deadline.

## Quyết định và kết quả cơ sở

Chọn **Hybrid**: $1,500.00/workspace/tháng + $120.00/batch hoàn thành, tối đa 1.000 frame/batch. Phí nền mua workflow/phân quyền/audit/support, không mua credits; batch lỗi/duplicate/retry không tính thêm. Có Curator/Reviewer nên chưa bán Outcome mAP; Attribution 2/10, Autonomy 1/10.

| Chỉ số | Giá trị dưới giả định | Ô Excel |
| --- | --- | --- |
| Attempts/tháng | 20 | `1_Cost_Job!B9` |
| Completion kỹ thuật, chưa đo | 90% → 18 completed | `1_Cost_Job!B10:B11` |
| Cost/job completed chưa OPEX | $57.90 | `1_Cost_Job!B66` |
| Full cost gồm OPEX | $124.57 | `1_Cost_Job!B67` |
| Giá sàn = 3 × COGS/job | $173.71 | `2_Pricing!B7` |
| Giá hiệu dụng cơ sở | $203.33 | `2_Pricing!B19` |
| Hóa đơn tháng cơ sở | $3,660.00 | `2_Pricing!B59` |
| GM | 71.52% | `2_Pricing!B21` |
| Completion đạt GM ≥60%, hợp đồng Hybrid | 46.07%; cần ≥10/20 job nguyên | `2_Pricing!B64` |
| Ngưỡng giá hiệu dụng cố định của mẫu | 64.07%; khác mô hình doanh thu | `2_Pricing!B33` |
| Trần hóa đơn, 25% saving giả định | $4,125.00 | `2_Pricing!B73` |
| Baseline manual tối thiểu để bảo vệ neo giá | 2.252 phút/frame | `2_Pricing!B74` |
| COGS cố định ×2 → GM | 46.93% | `2_Pricing!C93` |
| Budget CAC trần lab Enterprise | $62,825.61 | `4_Channel_Fit!B9` |
| Deal/AE/ngày | 0.0273 | `4_Channel_Fit!B16` |
| CAC rep benchmark / budget lab | $32,000.00 / 0.509× | `4_Channel_Fit!B22:B23` |
| CAC founder giả định | $4,000.00 | `4_Channel_Fit!B50` |

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
