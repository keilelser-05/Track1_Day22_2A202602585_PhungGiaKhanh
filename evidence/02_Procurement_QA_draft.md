# RAV-26 Procurement và IT Q&A

Ngày 08/10/2026. Bản nháp cho pilot, không phải cam kết đã được kiểm chứng hoặc hợp đồng đã ký. Phùng Gia Khánh chịu trách nhiệm bổ sung tài liệu trước 30/10/2026 (`5_90Day_Plan!B43`).

## Ba câu trả lời bắt buộc

**AI chọn sai hoặc để lọt PII thì sao?** RAV-26 đề xuất scores/shortlist; Curator chỉnh và Reviewer duyệt trước export theo mô tả chủ bài. Không dùng lời giải thích do LLM tạo để thay evidence của detector. Uncertainty cao không đồng nghĩa frame chắc chắn có giá trị; phải đo relevance/coverage bằng rubric. Thiết kế pilot đề xuất chặn export khi PII job fail, thiếu model version, thiếu review hoặc cấu hình mask không hợp lệ. Chưa có đo leakage production nên chưa cam kết “không hallucinate/không lọt PII”. Cần gửi data-flow, negative-path tests, PII eval theo slice, runbook dừng/reprocess và người xử lý sự cố. Retry do lỗi hệ thống hoặc export thất bại không thu thêm; manifest đã gửi sai phải revoke phiên bản và thông báo IT khách theo SLA được thỏa thuận.

**Dữ liệu khách có bị dùng để train model không?** Chưa có DPA hoặc danh sách subprocessors để chứng minh chính sách thực tế. Điều khoản pilot đề xuất: khách giữ quyền dữ liệu; chỉ xử lý cho job được phép, không dùng để train/fine-tune hay phục vụ khách khác nếu không có chấp thuận riêng bằng văn bản. Không gọi API LLM trong phương án chi phí này. Modal chỉ là phương án GPU tham chiếu, chưa xác nhận triển khai. Trước dữ liệu thật phải kiểm tra provider terms/config, vùng lưu trữ/xử lý, outbound network, quyền model/license, log/snapshot và credential scopes; đính kết quả kiểm tra và hợp đồng tương ứng. Không dùng câu “không train” làm thay thế cho evidence cấu hình.

**Nếu startup ngừng hoạt động hoặc tôi hủy hợp đồng, data ở đâu?** Chưa thử đầy đủ exit/recovery. Đề xuất giữ bản gốc trong object storage do khách kiểm soát nếu khả thi, xuất manifest JSON/CSV kèm object URI, score, model/version, hash và audit; không bắt khách phụ thuộc một định dạng độc quyền. Nếu pilot lưu bản xử lý trên vendor, phải có lịch export định kỳ, thời gian tải về, quyền truy cập và quy trình xóa cả snapshot/backup được ký trong DPA. Retention 3 tháng ở Excel là giả định chi phí, không phải chính sách đã cam kết. Khánh phải diễn tập restore + export sang kho khách + xóa và lập biên bản trước deadline; on-prem/VPC riêng phải lập mô hình chi phí mới.

## Mười câu hỏi có thể chặn mua hàng

| Ưu tiên | Câu hỏi IT/Procurement | Tài liệu trả lời đạt yêu cầu | Tình trạng và bước tiếp theo |
| --- | --- | --- | --- |
| 1 | Ai sở hữu/được phép xử lý ảnh và PII? | DPA/SoW theo dataset, purpose, bên kiểm soát/xử lý và quyền export | Chưa có; chốt với design partner trước ingest dữ liệu thật |
| 2 | Dữ liệu đi đâu, qua vendor nào, có train không? | Data-flow, region/subprocessor inventory, provider terms và config evidence | Yếu nhất hiện tại; chưa xác nhận cloud/on-prem; Khánh bổ sung 30/10 |
| 3 | PII bị lọt có được export không? | Eval có ground truth, slice-level FN và negative-path gate tests | Chưa đo; report 23/10 và review gate trước pilot |
| 4 | Có tenant isolation và truy cập trái quyền không? | RBAC matrix + test API/object URI/cross-tenant; scoped credentials | Có mô tả phân quyền; chưa security test độc lập |
| 5 | Có dùng model có license hợp lệ không? | SBOM, model/weights license, commercial use và redistribution scope | Chưa xác nhận model/license; không giả định mọi YOLO đều miễn phí thương mại |
| 6 | Tôi tái hiện shortlist và tranh chấp hóa đơn được không? | Job ledger: frame hash, model/config version, reviewer, export event và dedup | Audit theo mô tả; cần sample ledger và reconciliation invoice |
| 7 | Có dữ liệu trong logs/backups, ai mở được? | Logging policy, retention matrix và mẫu log đã scrub | Ngân sách đã tính; chưa có config/log evidence |
| 8 | Lỗi/sự cố cần ai xử lý, trong bao lâu? | Runbook severity/owner/escalation, SLA được ký và drill | Chưa cam kết SLA; phí nền không tự động mua 24/7 support |
| 9 | Exit, restore và xóa có thực hiện được không? | Export schema, restore drill, deletion report bao gồm backup | Chưa diễn tập; deadline 30/10 |
| 10 | Pilot chứng minh ROI và phí được kiểm soát thế nào? | Baseline time-study, signed acceptance, cap, exclusions và pilot report | Chưa đo; report mục tiêu 10/12; không cam kết mAP uplift |

SOC 2 hoặc chứng nhận của nhà cung cấp hạ tầng không phải chứng nhận của RAV-26. Chưa tuyên bố RAV-26 có SOC 2, SSO, pen-test hay SLA production.

## Hồ sơ tối thiểu trước ingest pilot

Gói tối thiểu gồm SoW/DPA + quyền dữ liệu; data-flow và subprocessor/config; RBAC/PII gate test evidence; license inventory; job ledger/billing rule; retention/exit/restore rehearsal; incident owner và pilot acceptance. Chưa dùng dữ liệu khách nhạy cảm khi các mục kiểm soát đó chưa được khách duyệt. Đây là điều kiện pilot đề xuất, không mô tả một phê duyệt đã có.
