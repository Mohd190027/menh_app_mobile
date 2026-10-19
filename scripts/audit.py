import re,sys
src=open('/home/z/my-project/download/dameen.html',encoding='utf-8').read()
js=re.search(r'<script>([\s\S]*)</script>',src).group(1)
# defined functions
defined=set(re.findall(r'function\s+([A-Za-z_$][\w$]*)\s*\(',js))
defined|=set(re.findall(r'const\s+([A-Za-z_$][\w$]*)\s*=',js))
defined|=set(re.findall(r'let\s+([A-Za-z_$][\w$]*)\s*=',js))
# identifiers invoked inside event-handler attributes and inline JS strings
calls=set()
for ev in ['onclick','onchange','onkeydown','onerror','onload','onsubmit','oninput']:
    for m in re.finditer(ev+r'="([^"]*)"',src):
        body=m.group(1)
        for c in re.findall(r'([A-Za-z_$][\w$]*)\s*\(',body):calls.add(c)
        for c in re.findall(r'([A-Za-z_$][\w$]*)\s*=',body):calls.add(c)  # assignments like CK.pay=
        for c in re.findall(r'([A-Za-z_$][\w$]*)\.\w',body):calls.add(c)
missing=sorted(c for c in calls if c not in defined and c not in
 {'if','return','this','event','true','false','Math','Date','String','Object','encodeURIComponent','navigator','JSON','parseInt','parseFloat','window','document','confirm','alert','function','showToast'})
# also verify every onclick function truly exists as function (not just const string)
undef_fn=[c for c in sorted(calls) if re.search(r'\bfunction\s+'+re.escape(c)+r'\b',js) is None and c in missing]
print('Called identifiers not defined anywhere:',missing if missing else 'NONE ✔')
# check data functions used in template strings like onclick="go('...')"
# quick sanity: ensure page render functions exist
pages=['pgHome','pgSearch','pgSection','pgStore','pgProduct','pgCart','pgOrders','pgDisputes','pgAccount','pgFavs','pgMDash','pgMProds','pgMOrders','pgMWallet','pgMDisputes','pgMSet','pgAOver','pgADisputes','pgAStores','pgAUsers','pgARev']
miss=[p for p in pages if ('function '+p) not in js]
print('Missing page renderers:',miss if miss else 'NONE ✔')
print('File size KB:',round(len(src)/1024,1))
