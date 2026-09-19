'use strict';
const http = require('node:http');
const { performance } = require('node:perf_hooks');
const os = require('node:os');
const instance = process.env.RENDER_INSTANCE_ID || os.hostname();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function log(entry) { console.log(JSON.stringify({timestamp:new Date().toISOString(),instance,...entry})); }
const plans = {standard:{discount:{percent:5}},enterprise:{}};
function calculateQuote(plan) {
  return 1000 * (1 - plans[plan].discount.percent / 100);
}
http.createServer(async (req,res) => {
  const started = performance.now();
  const url = new URL(req.url,'http://localhost');
  const requestId = req.headers['x-request-id'] || req.headers['rndr-id'] || 'unknown';
  let status = 200, body;
  if (url.pathname === '/health') body = {status:'ok'};
  else if (url.pathname === '/') body = {service:'Northwind Quote API',version:'1.0.0'};
  else if (url.pathname === '/api/quote') {
    const plan = url.searchParams.get('plan') || 'standard';
    if (!Object.hasOwn(plans,plan)) {status=400; body={error:'Unknown plan'};}
    else {
      for(let attempt=1;attempt<=3;attempt++){
        try {body={plan,quote:calculateQuote(plan)}; break;}
        catch(error){
          log({level:'error',event:'quote_calculation_failed',request_id:requestId,path:url.pathname,plan,attempt,error_name:error.name,message:error.message,stack:error.stack});
          if(attempt<3) await delay(250);
          else {status=500;body={error:'Unable to calculate quote',request_id:requestId};}
        }
      }
    }
  } else {status=404;body={error:'Not found'};}
  res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});
  res.end(JSON.stringify(body));
  log({level:status>=500?'error':'info',event:'http_request',request_id:requestId,method:req.method,path:url.pathname,plan:url.searchParams.get('plan'),status,duration_ms:Math.round((performance.now()-started)*100)/100});
}).listen(Number(process.env.PORT)||10000,'0.0.0.0',()=>log({level:'info',event:'server_started',version:'1.0.0',fixture:true}));
