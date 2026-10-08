import json, math, openpyxl
from pathlib import Path
d=json.loads(Path('scripts/inputs.json').read_text(encoding='utf-8'))
i,r=d['inputs'],d['rates']
f=openpyxl.load_workbook('PhungGiaKhanh_Day22_model.xlsx',data_only=False)
v=openpyxl.load_workbook('PhungGiaKhanh_Day22_model.xlsx',data_only=True)
o=openpyxl.load_workbook('references/Day22_template.xlsx',data_only=False)
compute=(i['frames_per_job']*i['gpu_seconds_per_frame']*r['gpu_second']+i['cpu_seconds_per_job']*i['cpu_cores']*r['cpu_core_second']+i['cpu_seconds_per_job']*i['memory_gib']*r['memory_gib_second'])*i['region_multiplier']
storage=i['attempts']*i['frames_per_job']*i['frame_mib']/1024*i['derivative_multiplier']*i['retention_months']*r['storage_gib_month']
fixed=r['modal_team_month']+i['db_monthly']+i['logs_backups_monthly']+(i['delivery_support_hours']+i['security_eval_hours'])*i['hourly_cost']
qa=i['qa_fraction']*i['qa_minutes']/60*i['hourly_cost']
cogs=fixed+storage+i['attempts']*(compute*(1+i['retry_rate'])+i['egress_gib_per_job']*r['egress_gib']+i['request_reserve_per_job']+qa)
completed=i['attempts']*i['completion']
invoice=i['base_fee']+i['usage_fee']*completed
expected={
 '1_Cost_Job!B66':cogs/completed,
 '1_Cost_Job!B67':(cogs+i['rd_overhead']+i['sales_overhead'])/completed,
 '1_Cost_Job!B118':compute*i['retry_rate']*i['attempts'],
 '2_Pricing!B7':3*cogs/completed,
 '2_Pricing!B19':invoice/completed,
 '2_Pricing!B21':1-cogs/invoice,
 '2_Pricing!B33':(cogs/i['attempts'])/((invoice/completed)*.4),
 '2_Pricing!B59':invoice,
 '2_Pricing!B64':(cogs/.4-i['base_fee'])/(i['usage_fee']*i['attempts']),
 '2_Pricing!B65':(cogs/.5-i['base_fee'])/(i['usage_fee']*i['attempts']),
 '2_Pricing!B74':(invoice/.25/i['hourly_cost']+completed*i['customer_review_hours_per_job'])*60/(completed*i['frames_per_job']),
 '2_Pricing!B76':i['delivery_support_hours']+(.5*invoice-cogs)/i['hourly_cost'],
 '4_Channel_Fit!B9':(invoice-cogs)*24,
 '4_Channel_Fit!B16':i['ae_quota']/(invoice*12)/i['working_days'],
 '4_Channel_Fit!B22':r['enterprise_cpo']/i['win_rate'],
 '4_Channel_Fit!B50':(i['founder_hours_per_opportunity']*i['hourly_cost']+i['founder_cash_per_opportunity'])/i['win_rate']
}
checks=[]
for ref,x in expected.items():
 s,a=ref.split('!');actual=v[s][a].value
 assert isinstance(actual,(int,float)) and math.isclose(actual,x,rel_tol=1e-9,abs_tol=1e-7),(ref,actual,x)
 checks.append({'cell':ref,'actual':actual,'independent':x,'pass':True})
formula_changes=[];yellow_blanks=[];non_yellow_changes=[];errors=[]
for sn in o.sheetnames:
 for row in o[sn]:
  for c in row:
   if c.data_type=='f' and c.value!=f[sn][c.coordinate].value:formula_changes.append(f'{sn}!{c.coordinate}')
   if sn!='0_README' and c.fill.fgColor.rgb=='FFFFF2CC' and f[sn][c.coordinate].value is None:yellow_blanks.append(f'{sn}!{c.coordinate}')
   if c.value is not None and c.fill.fgColor.rgb!='FFFFF2CC' and c.value!=f[sn][c.coordinate].value:non_yellow_changes.append(f'{sn}!{c.coordinate}')
for s in v:
 for row in s:
  for c in row:
   if c.data_type=='e':errors.append((s.title,c.coordinate,c.value))
assert not formula_changes,formula_changes
assert not yellow_blanks,yellow_blanks
assert not non_yellow_changes,non_yellow_changes
assert not errors,errors
shares=[v['1_Cost_Job'][f'C{j}'].value for j in range(72,78)]
assert math.isclose(sum(shares),1,abs_tol=1e-9),shares
assert f.sheetnames==o.sheetnames
result={'status':'PASS','checks':checks,'original_gray_formula_changes':formula_changes,'non_yellow_content_changes':non_yellow_changes,'unfilled_original_yellow_inputs':yellow_blanks,'formula_errors':errors,'cost_share_sum':sum(shares),'limitations':['Không mở native Microsoft Excel để kiểm tra lại. Artifact engine đã tính và cached values đã kiểm tra độc lập.','Stranger test bằng người ngoài chưa thực hiện.','Không có actual containment, eval value, mAP, WTP hay pilot.']}
Path('tmp/qa/verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':'PASS','independent_financial_checks':len(checks),'formula_changes':0,'non_yellow_changes':0,'yellow_blanks':0,'formula_errors':0},ensure_ascii=False))
