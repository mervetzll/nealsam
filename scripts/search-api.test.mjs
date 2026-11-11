import assert from 'node:assert/strict';
const base = process.env.TEST_SITE_URL || 'http://localhost:3000';
let cookie = '';
const answers = {relation:'arkadaş',style:'',interest:'',budget:'1000 orta',urgency:'normal',occasion:'',exclude:''};
async function search(interest, extra = {}) {
  const response = await fetch(`${base}/api/gift-search`, {method:'POST',headers:{'Content-Type':'application/json', ...(cookie ? {Cookie:cookie} : {})},body:JSON.stringify({answers:{...answers,interest},...extra})});
  const value = response.headers.get('set-cookie');
  if (value) cookie = value.split(';')[0];
  return {status:response.status,data:await response.json()};
}
for (const [index,interest] of ['kahve','kitap','dekor'].entries()) {
  const result = await search(interest);
  assert.equal(result.status,200,JSON.stringify(result.data));
  assert.ok(result.data.results.length > 0);
  assert.equal(result.data.remaining,2-index);
}
assert.equal((await search('teknoloji')).status,402);
assert.equal((await search('kahve')).status,200);
assert.equal((await search('kahve',{action:'plan',giftId:'fake',recipient:'Test',memory:''})).status,402);
const invalid = await fetch(`${base}/api/gift-search`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
assert.equal(invalid.status,400);
console.log('HTTP: 3 ücretsiz arama, dördüncüde Plus sınırı, tekrar arama ve yetkisiz plan engeli geçti.');
