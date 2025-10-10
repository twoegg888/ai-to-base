#!/usr/bin/env node

// 빠른 빌드 테스트 스크립트
const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 빌드 테스트 시작...\n');

try {
  // Node 버전 확인
  console.log('📋 Node 버전:', process.version);
  
  // 패키지 설치 (이미 설치되어 있으면 빠름)
  console.log('📦 의존성 확인 중...');
  execSync('npm ci --silent', { stdio: 'inherit' });
  
  // 타입 체크
  console.log('🔍 TypeScript 타입 체크...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  // 빌드 실행
  console.log('🏗️  프로덕션 빌드...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ 빌드 성공! Netlify 배포 준비 완료');
  
} catch (error) {
  console.error('\n❌ 빌드 실패:', error.message);
  process.exit(1);
}