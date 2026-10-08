# RAV-26 Eval Results và kế hoạch bổ sung bằng chứng

Ngày chốt: 08/10/2026. Chủ trách nhiệm đề xuất: Phùng Gia Khánh. Deadline báo cáo eval: 23/10/2026 (`5_90Day_Plan!B42`).

## Bằng chứng thực sự hiện có

Theo thông tin chủ bài cung cấp: phiên bản gần đây có 192 định nghĩa test, các luồng trình duyệt mới đã pass; có kiểm soát PII, Curator/Reviewer/Admin, lịch sử/audit và review trước export. Con số này truy về `5_90Day_Plan!B37`. Không diễn giải thành “192 test đều pass”, containment 90% hay mAP tăng. Repo P-026 trả 404 với kết nối đã dùng; chưa đọc được CI logs, commit hoặc báo cáo QA để xác minh độc lập.

Các trường chưa có bằng chứng: precision của shortlist, PII leakage/recall theo slice, acceptance của Reviewer, thời gian curate, GPU throughput, tỷ lệ retry, completion và downstream mAP. Tỷ lệ 90% trong `1_Cost_Job!B10` là giả định kế hoạch, không phải kết quả eval.

## Định nghĩa và bộ eval phải chạy

- Job: batch tối đa 1.000 frame duy nhất, đã qua PII gate, có model/data version, scores/shortlist/manifest, được Reviewer khách duyệt và export thành công. Một `job_id` chỉ ghi nhận hoàn thành một lần.
- Completion kỹ thuật: số job hoàn thành / số job đầu vào hợp lệ đã nhận trong cửa sổ đo. Mọi batch cần Reviewer; completion không phải autonomy. Batch chờ duyệt hoặc bị chặn PII chưa hoàn thành, không tính phí usage.
- Retry: số lượt compute chạy thêm / số compute lần đầu. Model hiện giả định 8% batch cần một lần rerun tương đương đầy đủ; nếu rerun nhiều lần thì dùng hệ số thực đo, không chỉ % batch có retry.
- Chạy regression tối thiểu 20 batch, gồm thành công, timeout, export lỗi, Reviewer reject, quyền sai, duplicate và idempotent retry. Đo cả latency tính máy và thời gian chờ người, không gộp rồi nói AI chậm.
- Bộ eval dự kiến 500 frame (`5_90Day_Plan!B38`), chia 10 slice × 50 frame: ngày, đêm, mưa, ngược sáng, blur, che khuất, mặt nhỏ, biển số nhỏ, không PII, cảnh hiếm. Xác định slice chính để tránh double-count; lưu thêm multi-tags. Bộ này là kế hoạch, chưa có file hoặc ground truth đã xác nhận.
- Hai người annotate PII/reference relevance độc lập; xử lý bất đồng rồi khóa ground truth. Chỉ dùng dữ liệu được quyền sử dụng, không đưa ảnh người thật chưa được phép vào evidence công khai.
- Ghi false negative PII theo vùng/loại/slice; “0 critical leak trên bộ eval” là mục tiêu, không chứng minh rủi ro production bằng 0. Hard block export khi detector không chạy, config sai hoặc Reviewer chưa duyệt.
- Kiểm tra shortlist bằng relevance theo rubric đã được Reviewer khách đồng ý, coverage cảnh hiếm, diversity và duplicate rate; không tối ưu số frame được chọn để tăng hóa đơn.

## Mẫu bảng báo cáo

| Chỉ số | Hiện trạng | Cách đo / điều kiện |
| --- | --- | --- |
| Functional QA | Có theo người dùng; chưa kiểm chứng CI | Đính commit, môi trường, log chạy và danh sách test pass/fail/skipped |
| Completion | Chưa đo; kế hoạch 90% | Không lấy số test làm mẫu số; report số job và thời gian chờ review |
| PII critical leak | Chưa đo; target 0 trên 500 frame | Đếm vùng PII còn lộ sau pipeline, không chỉ frame đã phát hiện |
| GPU time/frame | Chưa đo; giả định 1,5 giây | Đo cold start/model load/idle billed và toàn bộ 3 bước CV |
| Retry compute factor | Chưa đo; giả định 8% | Log từng attempt, lỗi và phần pipeline chạy lại |
| Curator/Reviewer time | Chưa đo; giả định 5 giờ/job | Time-study baseline và assisted trên cùng độ khó dữ liệu |
| mAP uplift | Chưa đo; không dùng định giá | Matched random-sampling pilot, budget/seed/test set cố định |

Phải lưu dataset hash, model/license version, config, rubric, timestamp, ai review và raw cost logs. Báo cáo public chỉ chứa metadata/ảnh tổng hợp được phép. Nếu không chạy đủ bộ eval trước deadline, giữ trạng thái “chưa có”, không điền số mục tiêu vào cột kết quả.

## Liên hệ với pricing

Eval chức năng bảo vệ workflow; eval PII/relevance bảo vệ chất lượng dữ liệu; A/B downstream mới hỗ trợ attribution về mAP. Hiện Attribution 2/10 và Autonomy 1/10 (`3_Value_Metric!B10,B18`) nên Hybrid usage vẫn phù hợp. Ngưỡng GM 60% theo hợp đồng là completion 46,07% (`2_Pricing!B64`), chỉ áp dụng giả định 20 attempts và chi phí hiện tại; mục tiêu chất lượng/vận hành 90% cao hơn ngưỡng tài chính, không giảm chất lượng để chạm ngưỡng lãi.
