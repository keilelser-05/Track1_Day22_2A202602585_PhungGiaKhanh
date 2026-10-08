# RAV-26 Pilot Report và protocol đo lường

Trạng thái: chưa có design partner hoặc pilot thực tế. VinFast là target account, không được ghi là khách, partner hay bên đã đồng ý dùng. Phùng Gia Khánh là owner đề xuất; Reviewer/IT khách chưa chỉ định.

Kế hoạch: 08/11–05/12/2026, 4 tuần; report trước 10/12/2026 (`5_90Day_Plan!C25:D25,B39:B44`). Khối lượng mục tiêu: 20 batch thử × tối đa 1.000 frame/batch = 20.000 frame; hoàn thành 90% là giả định ban đầu, không kết quả. Model tháng thường xuyên dùng 20 attempts, nhưng pilot ngắn không phải cam kết volume production.

## Phạm vi có thể ký

Chỉ camera 2D, ưu tiên cảnh đêm/mưa; không gán nhãn thuê, không huấn luyện toàn bộ stack ADAS, không chứng nhận an toàn xe. Chốt model/data version, kích thước và retention, quyền xử lý, quality rubric, lỗi tính phí và workflow review bằng văn bản. Connector CVAT/manifest là bề mặt đề xuất, chưa có chứng cứ đã triển khai. Được phép bắt đầu bằng import/export manifest có kiểm soát, đo thời gian thao tác thay vì gọi đó là zero-friction đã đạt.

## Đo completion và economics

Với mỗi `job_id`, lưu: timestamp ingest, số frame hợp lệ/duplicate, hash/model/config, PII status, GPU/CPU/RAM billable time (kể cả model load/idle), attempts và lý do retry, shortlist, số chỉnh của Curator, người/giờ review, export event, bytes lưu/egress và hóa đơn. Chốt cửa sổ completion trước pilot, ví dụ hoàn thành trong cùng tuần đo; job đang chờ review báo riêng, không xóa khỏi mẫu số.

Tách số frame được chọn/được gán nhãn khỏi số frame xử lý. Billing batch dựa trên phạm vi đầu vào và workflow hoàn thành; không lấy selection yield làm containment. Không tạo job mới để tính lại retry kỹ thuật; re-run có mục tiêu/model mới chỉ tính nếu khách duyệt trước.

So cost logs với `1_Cost_Job!B83:B122`. Thay từng giả định throughput/lương/retry/support bằng thực đo; invoice = phí nền + số batch hoàn thành × unit price. COGS gồm cả batch không hoàn thành. QA/support do vendor trả là COGS; Curator/Reviewer/annotation do khách trả không đưa vào vendor COGS nhưng phải trừ khi tính tiết kiệm.

## Đo giá trị và attribution

1. **Time-study:** so chọn batch thủ công với RAV-26 trên dữ liệu có độ khó tương đương. Ghi active time của Curator và Reviewer riêng; tính cả thời gian chỉnh/reject/reprocess, không chỉ thời gian GPU.
2. **Selection quality:** khóa rubric relevance/rare-scene coverage và annotation budget với khách. Reviewer đánh giá blind, không thấy nhãn phương pháp. Báo diversity, duplicate và PII failure cùng utility, tránh chỉ chọn cảnh dễ để nâng tỷ lệ duyệt.
3. **Downstream mAP A/B nếu đủ nhãn:** nhánh control random sampling, nhánh RAV selection; cùng số frame gán nhãn, label QA, base model, training recipe, compute budget và seed set. Test set độc lập khóa trước, tách theo drive/session để tránh frame kề nhau rò train-test. Báo overall và slice-level mAP, biến thiên giữa seeds, recall cảnh hiếm và PII incidents; không lựa riêng run tốt nhất. Nếu thiếu nhãn/compute, ghi mAP “chưa đo”, không dùng proxy time-saving thay mAP.
4. **Economic ROI:** tiết kiệm = (giờ manual − giờ assisted kể cả review/rework) × fully-loaded cost đã xác nhận. Không cộng tránh gán nhãn nếu chưa có contract/invoice chứng minh khoản đó thực sự giảm. Không cộng cùng một giờ vào cả nhân sự tiết kiệm và model-quality upside.

## Tiêu chí go/no-go đề xuất

| Điều kiện | Target / cách xử lý | Liên kết Excel |
| --- | --- | --- |
| Completion kỹ thuật | Mục tiêu ≥90%, mọi batch có review; không phải claim hiện tại | `1_Cost_Job!B10`; `5_90Day_Plan!C17` |
| PII | Không có critical leak trên eval 500 frame; production vẫn kiểm soát review | `5_90Day_Plan!B38,B41` |
| Chi phí | GM ≥60% với invoice/cost thực đo và stress support | `2_Pricing!B62,B64,B75` |
| Giá trị | Neo 25% cần baseline manual ≥2,252 phút/frame ở giả định 5 giờ review/job | `2_Pricing!B74` |
| Sales | Có buyer/budget/acceptance và một bên trả tiền thật; không lấy “thích demo” làm PMF | `5_90Day_Plan!C13` |
| Mở rộng | Chỉ sau renewal và cùng ngách đạt quality/GM; chưa mở LiDAR đa camera | `5_90Day_Plan!D13:D17` |

Nếu support thực tế hoặc yêu cầu VPC làm COGS tăng, giới hạn service/báo giá lại; không cắt review PII để giữ margin. Giá dưới trần “lý thuyết” không chứng minh khách sẵn lòng trả.

## Khung report sẽ điền sau pilot

| Trường | Giá trị hiện tại |
| --- | --- |
| Tên khách, buyer, Reviewer và chấp thuận dữ liệu | Chưa xác nhận |
| Ngày thực chạy và commit/model/dataset hash | Chưa chạy |
| Attempts/completed/reject/pending | Chưa đo |
| Retry, billable compute, retention/egress | Chưa đo |
| COGS, invoice, GM và cap | Chưa đo; Excel hiện là giả định |
| PII leakage và sự cố export | Chưa đo |
| Giờ manual/assisted và saving | Chưa đo |
| mAP random control vs RAV, per-slice và biến thiên | Chưa đo |
| Go/no-go, quyết định khách và renewal | Chưa có |

Không thay “chưa đo” bằng target sau khi pilot hết thời gian. Đính evidence thô có quyền truy cập phù hợp và lập bản public đã bỏ dữ liệu nhận dạng.
