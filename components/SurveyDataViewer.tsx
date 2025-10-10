import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getAllSurveys, checkServerHealth, getServerHealth } from '../utils/supabase/survey';
import { updateDatabaseSchema } from '../utils/supabase/schema';

interface SurveyItem {
  id: number;
  name: string;
  age: number;
  skin_type?: string;
  created_at: string;
  updated_at?: string;
  status: string;
}

interface SurveyDataViewerProps {
  onBack: () => void;
}

export function SurveyDataViewer({ onBack }: SurveyDataViewerProps) {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<boolean>(false);
  const [healthInfo, setHealthInfo] = useState<any>(null);

  useEffect(() => {
    loadSurveys();
    checkServer();
  }, []);

  const checkServer = async () => {
    const isHealthy = await checkServerHealth();
    setServerStatus(isHealthy);
    
    // 상세 헬스 정보 가져오기
    const health = await getServerHealth();
    setHealthInfo(health);
  };

  const loadSurveys = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('설문 데이터 로딩 중...');
      const result = await getAllSurveys();
      
      if (result.success && result.data) {
        setSurveys(result.data);
        console.log('설문 데이터 로딩 완료:', result.data.length, '개');
      } else {
        setError(result.error || '설문 데이터를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('설문 데이터 로딩 오류:', error);
      setError('설문 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              AI TO BASE 설문 데이터
            </h1>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              돌아가기
            </button>
          </div>

          {/* 서버 상태 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${serverStatus ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                서버: {serverStatus ? '정상' : '오프라인'}
              </span>
            </div>
            {healthInfo && (
              <>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${healthInfo.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    DB: {healthInfo.database === 'connected' ? '연결됨' : '오류'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${healthInfo.tableExists ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm text-gray-600">
                    테이블: {healthInfo.tableExists ? '생성됨' : '없음'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  데이터: {healthInfo.sampleDataCount || 0}개
                </span>
              </>
            )}
          </div>

          {/* 새로고침 버튼 */}
          <button
            onClick={loadSurveys}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mr-3"
          >
            {loading ? '로딩 중...' : '새로고침'}
          </button>
          
          {/* 스키마 업데이트 버튼 */}
          <button
            onClick={async () => {
              const result = await updateDatabaseSchema();
              if (result.success) {
                alert('✅ 스키마 업데이트 완료!\n페이지를 새로고침하세요.');
              } else {
                alert(`❌ 스키마 업데이트 실패:\n${result.error}\n\n수동으로 Supabase Dashboard에서 SQL을 실행해주세요.`);
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🔧 스키마 업데이트
          </button>
        </motion.div>

        {/* 테이블 생성 가이드 */}
        {healthInfo && !healthInfo.tableExists && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">!</span>
              </div>
              <h3 className="font-bold text-yellow-800">데이터베이스 테이블이 필요합니다</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              설문 데이터를 저장하기 위해 PostgreSQL 테이블을 생성해야 합니다.
            </p>
            <div className="bg-yellow-100 p-4 rounded border mb-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Supabase Dashboard → SQL Editor</strong>에서 아래 SQL을 실행하세요:
              </p>
              <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS ai_cosmetic_surveys (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  skin_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ai_cosmetic_surveys (name, age, skin_type, status) VALUES 
('테스트사용자1', 25, '건성', 'completed'),
('테스트사용자2', 30, '지성', 'in_progress'),
('테스트사용자3', 28, '중성', 'completed');`}
              </pre>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(healthInfo.instructions?.sql || '');
                alert('SQL이 클립보드에 복사되었습니다!');
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              SQL 복사하기
            </button>
          </motion.div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">설문 데이터를 불러오는 중...</p>
          </motion.div>
        )}

        {/* 설문 데이터 목록 */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 text-sm text-gray-600">
              총 {surveys.length}개의 설문 응답
            </div>

            {surveys.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                저장된 설문 데이터가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {surveys.map((survey, index) => (
                  <motion.div
                    key={survey.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">이름</label>
                        <p className="text-gray-900">{survey.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">나이</label>
                        <p className="text-gray-900">{survey.age}세</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">피부 타입</label>
                        <p className="text-gray-900">
                          {survey.skin_type || '미선택'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">상태</label>
                        <p className="text-gray-900">{survey.status}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">생성일:</span> {formatDate(survey.created_at)}
                        </div>
                        {survey.updated_at && (
                          <div>
                            <span className="font-medium">수정일:</span> {formatDate(survey.updated_at)}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        ID: {survey.id}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}