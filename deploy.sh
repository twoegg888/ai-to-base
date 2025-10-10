#!/bin/bash

# 🚀 AI To BASE - 자동 배포 스크립트

echo "🧴 AI To BASE 배포를 시작합니다..."

# Git 상태 확인
echo "📝 Git 상태 확인 중..."
git status

# 모든 변경사항 스테이징
echo "📦 변경사항을 스테이징 중..."
git add .

# 커밋 메시지 입력받기
echo "💬 커밋 메시지를 입력하세요 (기본값: 'Deploy: Production release'):"
read -r commit_message
commit_message=${commit_message:-"Deploy: Production release"}

# 커밋 실행
echo "💾 커밋 중..."
git commit -m "$commit_message"

# 원격 저장소로 푸시
echo "🚀 GitHub에 푸시 중..."
git push origin main

echo "✅ GitHub 푸시 완료!"

# 빌드 테스트
echo "🔨 프로덕션 빌드 테스트 중..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 빌드 성공! 배포 준비 완료"
    echo ""
    echo "🌐 다음 단계:"
    echo "1. Netlify: https://app.netlify.com/sites/ai-to-base/deploys"
    echo "2. Vercel: https://vercel.com/dashboard"
    echo "3. 환경 변수 설정을 잊지 마세요!"
    echo ""
    echo "🎉 배포가 곧 완료됩니다!"
else
    echo "❌ 빌드 실패! 오류를 확인하세요."
    exit 1
fi