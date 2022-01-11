import request from '@/utils/request';
let api = process.env;


export function queryAccounttx(data) {
  return request.post(api + 'getaccounttx', { data });
}

export function queryMiner(data) {
  return request.post(api + 'getminer', { data });
}








