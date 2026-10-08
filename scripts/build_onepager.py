from pathlib import Path
import openpyxl
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from xml.sax.saxutils import escape

ROOT=Path.cwd()
w=openpyxl.load_workbook(ROOT/'PhungGiaKhanh_Day22_model.xlsx',data_only=True)
def n(sheet,cell):return w[sheet][cell].value
def usd(x):return f'${x:,.2f}'
def whole(x):return f'${x:,.0f}'
def pc(x):return f'{x*100:.1f}%'
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold')
styles={
 'title':ParagraphStyle('title',fontName='Arial-Bold',fontSize=18,leading=22,textColor=colors.HexColor('#111827'),spaceAfter=5),
 'meta':ParagraphStyle('meta',fontName='Arial',fontSize=8,leading=10,textColor=colors.HexColor('#475569'),spaceAfter=6),
 'body':ParagraphStyle('body',fontName='Arial',fontSize=9,leading=12,spaceAfter=5,textColor=colors.HexColor('#111827')),
 'h':ParagraphStyle('h',fontName='Arial-Bold',fontSize=11,leading=14,spaceBefore=7,spaceAfter=5,textColor=colors.HexColor('#164E63')),
 'cell':ParagraphStyle('cell',fontName='Arial',fontSize=8.2,leading=10.5,textColor=colors.HexColor('#111827')),
 'small':ParagraphStyle('small',fontName='Arial',fontSize=7.6,leading=9.7,spaceAfter=4,textColor=colors.HexColor('#475569'))
}
story=[]; coverage=[]
def p(text,style='body'):
 story.append(Paragraph(text,styles[style]));coverage.append(text)
def table(rows,widths):
 t=Table([[Paragraph(str(x),styles['cell']) for x in row] for row in rows],colWidths=widths,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#E2E8F0')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),('LINEBELOW',(0,0),(-1,0),.5,colors.HexColor('#CBD5E1')),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#E2E8F0'))]))
 story.append(t);story.append(Spacer(1,5));coverage.extend(' | '.join(map(str,row)) for row in rows)

cost=n('1_Cost_Job','B66');floor=n('2_Pricing','B7');effective=n('2_Pricing','B19');gm=n('2_Pricing','B21');be=n('2_Pricing','B64');legacy=n('2_Pricing','B33')
invoice=n('2_Pricing','B59');completed=n('1_Cost_Job','B11');attempted=n('1_Cost_Job','B9')
p('RAV-26 Monetization One-Pager','title')
p('Phùng Gia Khánh · P-026 · Day 22 · 08/10/2026 [0_README!A27; 5_90Day_Plan!B36; 6_Benchmarks!B3]','meta')
p('<b>Đề xuất:</b> bán workflow chọn batch frame lái xe để gán nhãn cho đội dữ liệu ADAS; Curator chỉnh, Reviewer duyệt. Khách mục tiêu như VinFast chưa được xác nhận trả tiền. Giá, volume và hiệu quả dưới đây là giả thuyết pilot. [5_90Day_Plan!B36,A49; 0_README!A28]')

p('1  Pricing','h')
p('<b>Ai trả:</b> Head of Data/ADAS đề xuất, chủ ngân sách R&amp;D/data operations ký cùng Procurement/IT (vai trò giả định). Chọn cách đóng gói “chuẩn bị batch để gán nhãn”, cạnh tranh với giờ chọn dữ liệu thủ công. [3_Value_Metric!B51:B55]')
p(f'<b>Job và hóa đơn:</b> một batch tối đa {n("1_Cost_Job","B83"):,.0f} frame đã qua PII gate, có score/shortlist + manifest, được Reviewer khách duyệt và xuất thành công; đếm một lần/job_id. <b>Hybrid {whole(n("2_Pricing","B57"))}/workspace/tháng + {whole(n("2_Pricing","B58"))}/batch hoàn thành.</b> Phí nền mua RBAC/audit/workflow/support, không bao gồm credits; retry/lỗi/duplicate không tính thêm. [1_Cost_Job!B5,B83; 2_Pricing!B57:B58,A79]')
p(f'<b>Lý do:</b> Attribution {n("3_Value_Metric","B10"):.0f}/10, Autonomy {n("3_Value_Metric","B18"):.0f}/10; chưa có eval giá trị/mAP và chưa được khách nghiệm thu định nghĩa billing. Không bán outcome mAP. [3_Value_Metric!B10,B18,B30:B34]')
table([
 ['Cost/Job hoàn thành','Giá sàn (3×)','Giá hiệu dụng','Gross Margin'],
 [f'<b>{usd(cost)}</b><br/>1_Cost_Job!B66',f'<b>{usd(floor)}</b><br/>2_Pricing!B7',f'<b>{usd(effective)}</b><br/>2_Pricing!B19',f'<b>{pc(gm)}</b><br/>2_Pricing!B21'],
 [f'{attempted:.0f} thử → {completed:.0f} xong; 90% là giả định<br/>1_Cost_Job!B9:B11',f'Hóa đơn {whole(invoice)}/tháng<br/>2_Pricing!B59',f'Ngưỡng Hybrid GM ≥60%: <b>{pc(be)}</b><br/>2_Pricing!B64',f'Giá cố định tương đương: {pc(legacy)}<br/>2_Pricing!B33']
],[131,131,131,130])
p(f'<b>Neo và điểm gãy:</b> baseline {n("2_Pricing","B67"):.1f} phút/frame, review còn {n("2_Pricing","B68"):.0f} giờ/job → tiết kiệm giả định {whole(n("2_Pricing","B71"))}/tháng; trần 25% = {whole(n("2_Pricing","B73"))}. Phải đo baseline ≥{n("2_Pricing","B74"):.3f} phút/frame để bảo vệ giá. COGS cố định ×2 → GM {pc(n("2_Pricing","C93"))}; support &gt;{n("2_Pricing","B76"):.2f} giờ/tháng → GM &lt;50%. Cost gồm OPEX: {usd(n("1_Cost_Job","B67"))}/job. [2_Pricing!B67:B76,C93; 1_Cost_Job!B67]','small')
p('Benchmark: Encord Index/Active tính theo platform/volume tiers, Enterprise báo giá riêng; Roboflow Data dùng credits, Core $39/tháng (20 credits), flex $6/credit; là job liền kề, không so giá ngang. [3_Value_Metric!A26:D27,A49; 6_Benchmarks!B56:B59]','small')

p('2  Go to market','h')
p(f'<b>Một kênh: Sales-Led do founder.</b> ARPU {whole(invoice)}; ngân sách CAC theo trần Enterprise = {whole(n("4_Channel_Fit","B9"))}. Rep benchmark: CPO {whole(n("4_Channel_Fit","B20"))} ÷ win {pc(n("4_Channel_Fit","B21"))} = CAC {whole(n("4_Channel_Fit","B22"))}, bằng {n("4_Channel_Fit","B23"):.2f}× budget; {n("4_Channel_Fit","B16"):.3f} deal/AE/ngày. Founder CAC giả định {whole(n("4_Channel_Fit","B50"))}, payback {n("4_Channel_Fit","B52"):.2f} tháng; chưa tuyển AE. [4_Channel_Fit!B5:B23,B38,B46:B58]')
p('<b>Pain moment giả thuyết:</b> 16:30 thứ Sáu, Curator khóa shortlist và Reviewer chờ xuất batch gán nhãn, đang dùng CVAT/kho dữ liệu. Điểm nhúng đề xuất: Import shortlist trong CVAT qua JSON manifest + object URI/webhook; connector chưa xác nhận đã làm. [5_90Day_Plan!B5:B8]')
p('<b>Kế hoạch do Phùng Gia Khánh phụ trách:</b> tháng đầu 5 phỏng vấn + 1 design partner; hai tháng tiếp theo chạy 2 pilot, mục tiêu 1 khách trả tiền trong 90 ngày (09/10/2026–06/01/2027). Tháng 4+ mới mở OEM tiếp theo nếu có 1 renewal và GM ≥60%. [5_90Day_Plan!B13:D18,B46:B47]')

p('3  Evidence','h')
table([
 ['Tài sản / hiện trạng','Việc cần làm · Phùng Gia Khánh phụ trách'],
 ['<b>Eval Results</b><br/>Có QA chức năng theo người dùng; 192 định nghĩa test, browser flows pass. Chưa có eval giá trị.', '23/10/2026: eval 500 frame và batch regression, log cost/completion/PII; không đổi test count thành containment. [5_90Day_Plan!C23:D23,B37:B42]'],
 ['<b>Procurement Q&amp;A</b><br/>Có bản nháp; chưa có DPA/config được kiểm chứng.', '30/10/2026: bằng văn bản về lỗi/PII, quyền dùng data để train, subprocessor và export/delete khi exit. [5_90Day_Plan!C24:D24,B43]'],
 ['<b>Pilot Report</b><br/>Protocol có; chưa có design partner hay kết quả.', '4 tuần dự kiến, 20 batch; report 10/12/2026: completion, chi phí, giờ tiết kiệm và mAP A/B nếu đủ nhãn. [5_90Day_Plan!C25:D25,B39:B44]']
],[185,338])
p('Stranger test bằng người thật chưa thực hiện; deadline 15/10/2026. Đây là mô hình để kiểm chứng, chưa phải báo cáo hiệu quả đã đạt. [5_90Day_Plan!B29:B32,B45]','small')

def footer(canvas,doc):
 canvas.setFont('Arial',7);canvas.setFillColor(colors.HexColor('#64748B'))
 canvas.drawString(36,23,'Nguồn giá đã kiểm tra và mọi giả định nằm trong Excel cùng tên · USD trước VAT')
 canvas.drawRightString(A4[0]-36,23,str(doc.page))
out=ROOT/'PhungGiaKhanh_Day22_onepager.pdf'
doc=SimpleDocTemplate(str(out),pagesize=A4,leftMargin=36,rightMargin=36,topMargin=30,bottomMargin=34,title='RAV-26 Monetization One-Pager',author='Phùng Gia Khánh',subject='Day 22 Monetization Lab')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
Path('tmp/qa/onepager_text.html').write_text('\n'.join(coverage),encoding='utf-8')
print(out.name)
