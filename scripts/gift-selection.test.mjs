import assert from 'node:assert/strict';
import { excludesGift, diversifyGifts } from '../src/lib/giftSelection.ts';

assert.equal(excludesGift({title:'Kokulu mum'},'parfüm|kokulu|oda kokusu'),true);
assert.equal(excludesGift({title:'Kupa',description:'Yanına parfüm ekle'},'parfüm'),false);
assert.equal(excludesGift({title:'Gümüş yüzük'},'giyim|yüzük'),true);
const ranked = [
  {gift:{title:'Kupa'},score:100},
  {gift:{title:'KUPA'},score:99},
  {gift:{title:'Kupa ve kahve'},score:98},
  {gift:{title:'Termos'},score:95},
  {gift:{title:'French press'},score:93},
  {gift:{title:'Kahve çekirdeği'},score:90},
  {gift:{title:'Kolye'},score:60},
];
assert.deepEqual(diversifyGifts(ranked).slice(0,4).map(x=>x.gift.title),['Kupa','Termos','French press','Kahve çekirdeği']);
assert.equal(diversifyGifts(ranked).length,6);
assert.deepEqual(diversifyGifts([]),[]);
console.log('6 eleme ve öneri çeşitliliği kontrolü geçti.');
