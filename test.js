/**
 * 명장시대 프로토타입 — 최소 테스트
 * node test.js 로 실행
 */
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ ${message}`);
    failed++;
  }
}

// --- 1. 파일 존재 확인 ---
console.log('\n📁 파일 존재 확인');

const expectedFiles = [
  'index.html',
  'concept2-japanese-minimal/index.html',
  'concept4-warm-artisan/index.html',
];

const deletedFiles = [
  'concept1-art-deco/index.html',
  'concept3-editorial/index.html',
  'concept5-modern-korean/index.html',
];

for (const file of expectedFiles) {
  const fullPath = path.join(__dirname, file);
  assert(fs.existsSync(fullPath), `${file} 존재`);
}

for (const file of deletedFiles) {
  const fullPath = path.join(__dirname, file);
  assert(!fs.existsSync(fullPath), `${file} 삭제됨`);
}

// --- 2. 톱 페이지 링크 검증 ---
console.log('\n🔗 톱 페이지 링크 검증');

const topHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

assert(topHtml.includes('concept2-japanese-minimal/index.html'), '톱 페이지에 와비사비 링크');
assert(topHtml.includes('concept4-warm-artisan/index.html'), '톱 페이지에 따뜻한 장인 링크');
assert(!topHtml.includes('concept1-art-deco'), '톱 페이지에서 아르데코 제거됨');
assert(!topHtml.includes('concept3-editorial'), '톱 페이지에서 에디토리얼 제거됨');
assert(!topHtml.includes('concept5-modern-korean'), '톱 페이지에서 모던코리안 제거됨');
assert(topHtml.includes('명장시대'), '톱 페이지에 브랜드명 포함');
assert(topHtml.includes('lang="ko"'), '톱 페이지 한국어 lang 속성');

// --- 3. 각 컨셉 페이지 필수 콘텐츠 검증 ---
console.log('\n📄 각 컨셉 페이지 콘텐츠 검증');

const requiredExact = [
  '명장시대',
  '김영수',
  '크루아상',
  '바게트',
  '서울시 강남구 도산대로 123',
  '02-1234-5678',
  '../index.html',
];

const requiredPatterns = [
  { name: '가격 표시 (₩ 또는 &won;)', test: (h) => h.includes('₩') || h.includes('&won;') || h.includes('&#8361;') },
  { name: '영업시간 (08:00~21:00)', test: (h) => h.includes('08:00') && h.includes('21:00') },
];

const conceptDirs = [
  'concept2-japanese-minimal',
  'concept4-warm-artisan',
];

for (const dir of conceptDirs) {
  console.log(`\n  [${dir}]`);
  const html = fs.readFileSync(path.join(__dirname, dir, 'index.html'), 'utf-8');

  for (const content of requiredExact) {
    assert(html.includes(content), `"${content}" 포함`);
  }
  for (const { name, test } of requiredPatterns) {
    assert(test(html), `${name}`);
  }

  // HTML 기본 구조
  assert(html.includes('<!DOCTYPE html'), 'DOCTYPE 선언');
  assert(html.includes('<meta charset="UTF-8"') || html.includes('<meta charset="utf-8"'), 'UTF-8 charset');
  assert(html.includes('viewport'), 'viewport 메타 태그');
  assert(html.includes('lang="ko"'), '한국어 lang 속성');
}

// --- 4. 빵 메뉴 가격 검증 ---
console.log('\n💰 빵 메뉴 가격 검증');

const expectedPrices = ['5,500', '7,000', '6,500', '9,000', '8,500', '12,000'];

for (const dir of conceptDirs) {
  const html = fs.readFileSync(path.join(__dirname, dir, 'index.html'), 'utf-8');
  const allPricesPresent = expectedPrices.every(price => html.includes(price));
  assert(allPricesPresent, `${dir}: 6개 빵 가격 모두 포함`);
}

// --- 5. 반응형 디자인 검증 ---
console.log('\n📱 반응형 디자인 검증');

for (const dir of conceptDirs) {
  const html = fs.readFileSync(path.join(__dirname, dir, 'index.html'), 'utf-8');
  assert(html.includes('@media'), `${dir}: 미디어 쿼리 포함`);
}

// --- 6. 이미지 검증 ---
console.log('\n🖼️  이미지 검증');

for (const dir of conceptDirs) {
  const html = fs.readFileSync(path.join(__dirname, dir, 'index.html'), 'utf-8');
  assert(html.includes('images.unsplash.com'), `${dir}: Unsplash 이미지 포함`);
  assert((html.match(/loading="lazy"/g) || []).length >= 3, `${dir}: lazy loading 적용`);
}

// --- 결과 출력 ---
console.log('\n' + '='.repeat(40));
console.log(`결과: ${passed} passed, ${failed} failed`);
console.log('='.repeat(40) + '\n');

process.exit(failed > 0 ? 1 : 0);
