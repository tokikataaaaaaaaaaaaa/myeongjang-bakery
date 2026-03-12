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
  'concept1-art-deco/index.html',
  'concept2-japanese-minimal/index.html',
  'concept3-editorial/index.html',
  'concept4-warm-artisan/index.html',
  'concept5-modern-korean/index.html',
];

for (const file of expectedFiles) {
  const fullPath = path.join(__dirname, file);
  assert(fs.existsSync(fullPath), `${file} 존재`);
}

// --- 2. 톱 페이지 링크 검증 ---
console.log('\n🔗 톱 페이지 링크 검증');

const topHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

for (const file of expectedFiles.slice(1)) {
  assert(topHtml.includes(file), `톱 페이지에 ${file} 링크 존재`);
}

assert(topHtml.includes('명장시대'), '톱 페이지에 브랜드명 포함');
assert(topHtml.includes('lang="ko"'), '톱 페이지 한국어 lang 속성');

// --- 3. 각 컨셉 페이지 필수 콘텐츠 검증 ---
console.log('\n📄 각 컨셉 페이지 콘텐츠 검증');

// 정확한 문자열 매칭
const requiredExact = [
  '명장시대',
  '김영수',
  '크루아상',
  '바게트',
  '서울시 강남구 도산대로 123',
  '02-1234-5678',
  '../index.html',
];

// 패턴 매칭 (여러 형식 허용)
const requiredPatterns = [
  { name: '가격 표시 (₩ 또는 &won;)', test: (h) => h.includes('₩') || h.includes('&won;') || h.includes('&#8361;') },
  { name: '영업시간 (08:00~21:00)', test: (h) => h.includes('08:00') && h.includes('21:00') },
];

const conceptDirs = [
  'concept1-art-deco',
  'concept2-japanese-minimal',
  'concept3-editorial',
  'concept4-warm-artisan',
  'concept5-modern-korean',
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

// --- 결과 출력 ---
console.log('\n' + '='.repeat(40));
console.log(`결과: ${passed} passed, ${failed} failed`);
console.log('='.repeat(40) + '\n');

process.exit(failed > 0 ? 1 : 0);
