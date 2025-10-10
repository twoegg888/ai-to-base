import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Supabase 클라이언트 생성
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-44d07f49/health", (c) => {
  return c.json({ status: "ok" });
});

// 스키마 업데이트 강제 실행 엔드포인트
app.post("/make-server-44d07f49/update-schema", async (c) => {
  try {
    console.log('🔧 Manually updating database schema...');
    
    // Step 1: answers 컬럼 추가
    try {
      const { error: alterError } = await supabase
        .from('ai_cosmetic_surveys')
        .update({ answers: null })
        .eq('id', -1); // 존재하지 않는 ID로 테스트
        
      console.log('✅ answers column already exists or was added successfully');
      return c.json({ 
        success: true, 
        message: 'Schema update completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log('❌ Error during schema update:', error);
      return c.json({ 
        success: false, 
        error: 'Schema update failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Schema update error:', error);
    return c.json({ 
      success: false, 
      error: 'Schema update failed',
      details: error.message 
    });
  }
});

// 테이블 초기화 (앱 시작 시 한 번 실행)
async function initializeTable() {
  try {
    console.log('🚀 Initializing ai_cosmetic_surveys table...');
    
    // 1. 테이블 생성 (이미 존재하면 무시)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ai_cosmetic_surveys (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        skin_type VARCHAR(50),
        answers JSONB,
        recommendation TEXT,
        status VARCHAR(20) DEFAULT 'in_progress',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      -- 기존 테이블에 필요한 컬럼들 추가 (없을 경우)
      DO $ 
      BEGIN 
        -- recommendation 컬럼 추가
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'ai_cosmetic_surveys' 
          AND column_name = 'recommendation'
        ) THEN
          ALTER TABLE ai_cosmetic_surveys ADD COLUMN recommendation TEXT;
        END IF;
        
        -- answers 컬럼 추가 (JSONB 타입)
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'ai_cosmetic_surveys' 
          AND column_name = 'answers'
        ) THEN
          ALTER TABLE ai_cosmetic_surveys ADD COLUMN answers JSONB;
        END IF;
      END $;
      
      -- 인덱스 생성
      CREATE INDEX IF NOT EXISTS idx_ai_cosmetic_surveys_created_at ON ai_cosmetic_surveys(created_at);
      CREATE INDEX IF NOT EXISTS idx_ai_cosmetic_surveys_status ON ai_cosmetic_surveys(status);
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableQuery
    });
    
    if (createError) {
      console.log('⚠️ Table creation via RPC failed, trying direct query...');
      
      // RPC가 없으면 직접 raw SQL 실행
      const { error: directError } = await supabase
        .from('ai_cosmetic_surveys')
        .select('count')
        .limit(1);
        
      if (directError && directError.message.includes('relation "ai_cosmetic_surveys" does not exist')) {
        console.log('❌ Table does not exist. Manual creation required.');
        console.log('📋 Please run this SQL in Supabase Dashboard > SQL Editor:');
        console.log(createTableQuery);
        return;
      }
    }
    
    // 2. 샘플 데이터 확인 및 삽입
    const { data: existingData, error: selectError } = await supabase
      .from('ai_cosmetic_surveys')
      .select('count')
      .limit(1);
    
    if (!selectError) {
      console.log('✅ Table exists! Checking for sample data...');
      
      const { data: sampleCheck } = await supabase
        .from('ai_cosmetic_surveys')
        .select('id')
        .eq('name', '테스트사용자1')
        .limit(1);
      
      if (!sampleCheck || sampleCheck.length === 0) {
        console.log('📝 Inserting sample data...');
        
        const { error: insertError } = await supabase
          .from('ai_cosmetic_surveys')
          .insert([
            { name: '테스트사용자1', age: 25, skin_type: '건성', status: 'completed' },
            { name: '테스트사용자2', age: 30, skin_type: '지성', status: 'in_progress' },
            { name: '테스트사용자3', age: 28, skin_type: '중성', status: 'completed' }
          ]);
        
        if (insertError) {
          console.log('⚠️ Sample data insertion failed:', insertError);
        } else {
          console.log('✅ Sample data inserted successfully!');
        }
      } else {
        console.log('✅ Sample data already exists');
      }
    }
    
    console.log('🎉 Table initialization completed successfully!');
    
  } catch (error) {
    console.log('❌ Table initialization error:', error);
    console.log('📋 Manual table creation may be required. Please check Supabase Dashboard.');
  }
}

// 앱 시작 시 테이블 초기화
initializeTable();

// 헬스체크 및 테이블 상태 확인 엔드포인트
app.get("/make-server-44d07f49/health", async (c) => {
  try {
    // 1. 서버 상태 확인
    const serverStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'unknown',
      tableExists: false,
      sampleDataCount: 0
    };

    // 2. 데이터베이스 연결 확인
    try {
      const { data, error } = await supabase
        .from('ai_cosmetic_surveys')
        .select('count')
        .limit(1);
      
      if (!error) {
        serverStatus.database = 'connected';
        serverStatus.tableExists = true;
        
        // 3. 데이터 개수 확인
        const { count } = await supabase
          .from('ai_cosmetic_surveys')
          .select('*', { count: 'exact', head: true });
        
        serverStatus.sampleDataCount = count || 0;
      } else {
        serverStatus.database = 'table_not_found';
        if (error.message.includes('relation "ai_cosmetic_surveys" does not exist')) {
          serverStatus.tableExists = false;
        }
      }
    } catch (dbError) {
      serverStatus.database = 'connection_error';
      console.log('Database health check error:', dbError);
    }

    return c.json({
      success: true,
      ...serverStatus,
      instructions: !serverStatus.tableExists ? {
        message: "테이블이 존재하지 않습니다. 수동으로 생성하세요.",
        sql: `
CREATE TABLE IF NOT EXISTS ai_cosmetic_surveys (
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
('테스트사용자3', 28, '중성', 'completed');
        `.trim()
      } : null
    });

  } catch (error) {
    console.log("Health check error:", error);
    return c.json({
      success: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 설문 데이터 저장 엔드포인트
app.post("/make-server-44d07f49/survey", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Received survey data:", body);

    // 데이터 검증
    if (!body.name || !body.age) {
      console.log("Missing required fields: name or age");
      return c.json({ 
        success: false, 
        error: "이름과 나이는 필수 입력 항목입니다." 
      }, 400);
    }

    // PostgreSQL 테이블에 데이터 삽입
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .insert({
        name: body.name,
        age: parseInt(body.age),
        skin_type: body.skinType || null,
        status: 'in_progress',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.log("Database error:", error);
      return c.json({ 
        success: false, 
        error: "데이터베이스 오류가 발생했습니다: " + error.message 
      }, 500);
    }
    
    console.log("Survey data saved successfully:", data.id);
    
    return c.json({ 
      success: true, 
      surveyId: data.id.toString(),
      message: "설문 데이터가 성공적으로 저장되었습니다."
    });

  } catch (error) {
    console.log("Error saving survey data:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다. 다시 시도해주세요." 
    }, 500);
  }
});

// 설문 데이터 업데이트 엔드포인트 (피부 타입 등 추가 정보)
app.put("/make-server-44d07f49/survey/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    const body = await c.req.json();
    
    console.log(`🔄 Updating survey data for surveyId: "${surveyIdParam}"`, body);

    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }

    // PostgreSQL 테이블 업데이트
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // 개별 필드 업데이트
    if (body.skinType) updateData.skin_type = body.skinType;
    if (body.status) updateData.status = body.status;
    if (body.answers) updateData.answers = body.answers;

    console.log(`📊 Updating database for surveyId: ${surveyId}`);

    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .update(updateData)
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      console.log(`❌ Database update error for surveyId ${surveyId}:`, error);
      return c.json({ 
        success: false, 
        error: `설문 데이터 업데이트 실패: ${error.message}` 
      }, 404);
    }
    
    if (!data) {
      console.log(`❌ No data found for surveyId: ${surveyId}`);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다." 
      }, 404);
    }
    
    console.log(`✅ Survey data updated successfully for surveyId: ${surveyId}`);
    
    return c.json({ 
      success: true, 
      data: data,
      message: "설문 데이터가 성공적으로 업데이트되었습니다."
    });

  } catch (error) {
    console.log("❌ Error updating survey data:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다: " + error.message 
    }, 500);
  }
});

// 설문 데이터 조회 엔드포인트
app.get("/make-server-44d07f49/survey/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    console.log(`🔍 Retrieving survey for surveyId: "${surveyIdParam}"`);
    
    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }
    
    console.log(`📊 Querying database for surveyId: ${surveyId}`);
    
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (error) {
      console.log(`❌ Database query error for surveyId ${surveyId}:`, error);
      return c.json({ 
        success: false, 
        error: `설문 데이터 조회 실패: ${error.message}` 
      }, 404);
    }
    
    if (!data) {
      console.log(`❌ No data found for surveyId: ${surveyId}`);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다." 
      }, 404);
    }

    console.log(`✅ Survey data found for surveyId ${surveyId}`);

    return c.json({ 
      success: true, 
      data: data 
    });

  } catch (error) {
    console.log("❌ Error retrieving survey data:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다: " + error.message 
    }, 500);
  }
});

// 모든 설문 데이터 조회 엔드포인트 (관리자용)
app.get("/make-server-44d07f49/surveys", async (c) => {
  try {
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log("Database error:", error);
      return c.json({ 
        success: false, 
        error: "데이터베이스 오류가 발생했습니다: " + error.message 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.log("Error retrieving surveys:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다." 
    }, 500);
  }
});

// Make.com에서 AI 추천 결과를 받을 엔드포인트
app.post("/make-server-44d07f49/ai-recommendation", async (c) => {
  try {
    console.log("🤖 AI recommendation endpoint called");
    console.log("🔍 Request headers:", c.req.header());
    
    let body;
    try {
      body = await c.req.json();
      console.log("🤖 Received AI cosmetic recipe from Make.com:", body);
    } catch (jsonError) {
      console.log("❌ JSON parsing error:", jsonError);
      return c.json({ 
        success: false, 
        error: "잘못된 JSON 형식입니다: " + jsonError.message 
      }, 400);
    }

    // Make.com에서 보낼 데이터 구조:
    // {
    //   surveyId: "123",
    //   recommendation: JSON.stringify({
    //     recipe: [{ name: "알로에 젤", percentage: 86.5 }, ...],
    //     descriptions: { "알로에 젤": "설명...", ... },
    //     tools: ["플라스틱 비커", ...],
    //     steps: ["단계 1...", ...],
    //     summary: "총평 텍스트...",
    //     storage: "보관 안내..."
    //   })
    // }

    if (!body.surveyId || !body.recommendation) {
      console.log("❌ Missing required fields: surveyId or recommendation");
      return c.json({ 
        success: false, 
        error: "surveyId와 recommendation은 필수 항목입니다." 
      }, 400);
    }

    // 레시피 데이터 검증
    try {
      const recipeData = JSON.parse(body.recommendation);
      
      // 필수 필드 검증
      if (!recipeData.recipe || !Array.isArray(recipeData.recipe)) {
        throw new Error("recipe 배열이 필요합니다");
      }
      
      if (!recipeData.descriptions || typeof recipeData.descriptions !== 'object') {
        throw new Error("descriptions 객체가 필요합니다");
      }
      
      // 레시피 총 퍼센트 검증
      const totalPercentage = recipeData.recipe.reduce((sum: number, item: any) => sum + (item.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.1) {
        console.warn(`⚠️ 레시피 총 퍼센트가 100%가 아님: ${totalPercentage}%`);
      }
      
      console.log("✅ Recipe validation passed:", {
        ingredientCount: recipeData.recipe.length,
        totalPercentage: totalPercentage,
        hasSteps: !!recipeData.steps,
        hasSummary: !!recipeData.summary
      });
      
    } catch (validationError) {
      console.log("❌ Recipe validation error:", validationError);
      return c.json({ 
        success: false, 
        error: "잘못된 레시피 데이터 형식입니다: " + validationError.message 
      }, 400);
    }

    // surveyId 검증 및 변환
    const surveyId = parseInt(body.surveyId);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${body.surveyId}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }

    // 해당 설문 데이터에 추천 결과 업데이트
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .update({
        recommendation: body.recommendation,
        status: 'completed_ai',
        updated_at: new Date().toISOString()
      })
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      console.log("❌ Database error:", error);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다: " + error.message 
      }, 404);
    }
    
    console.log("✅ AI cosmetic recipe saved successfully for survey:", body.surveyId);
    
    return c.json({ 
      success: true, 
      data: data,
      message: "맞춤 화장품 레시피가 성공적으로 저장되었습니다."
    });

  } catch (error) {
    console.log("❌ Error saving AI recipe:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다. 다시 시도해주세요." 
    }, 500);
  }
});

// 개인화된 카드 이미지 생성 엔드포인트
app.get("/make-server-44d07f49/card-image/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    console.log(`🖼️ Generating card image for surveyId: "${surveyIdParam}"`);
    
    // 데모 모드 처리
    if (surveyIdParam === 'demo') {
      console.log('🎯 Demo mode activated for card image');
      const demoData = {
        name: "김예진",
        age: 25,
        skin_type: "복합성",
        recommendation: JSON.stringify({
          recipe: [
            { name: "알로에 젤", percentage: 86.5 },
            { name: "히알루론산", percentage: 10 },
            { name: "글리세린", percentage: 3.5 }
          ]
        })
      };
      
      const recipeTitle = "수분 지킴이";
      const ingredients = [
        { name: "알로에 젤", percentage: 86.5 },
        { name: "히알루론산", percentage: 10 },
        { name: "글리세린", percentage: 3.5 }
      ];
      
      console.log('🎨 Generating demo card for:', demoData.name);
      return generateCardSvg(demoData, recipeTitle, ingredients);
    }
    
    // surveyId 검증
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      return c.text("Invalid survey ID", 400);
    }
    
    // 설문 데이터 조회
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('id, name, age, skin_type, recommendation, status')
      .eq('id', surveyId)
      .single();

    if (error || !data) {
      return c.text("Survey not found", 404);
    }

    // AI 추천 결과 파싱
    let recipeTitle = "맞춤형 레시피";
    let ingredients = [];
    
    if (data.recommendation) {
      try {
        const rec = JSON.parse(data.recommendation);
        if (rec.recipe && Array.isArray(rec.recipe) && rec.recipe.length > 0) {
          const mainIngredient = rec.recipe[0]?.name || "수분";
          recipeTitle = `${mainIngredient} 베이스`;
          ingredients = rec.recipe.slice(0, 6); // 상위 6개 성분
        }
      } catch (parseError) {
        console.log("⚠️ Error parsing recommendation:", parseError);
      }
    }

    return generateCardSvg(data, recipeTitle, ingredients);

  } catch (error) {
    console.log("❌ Error generating card image:", error);
    return c.text("Error generating image", 500);
  }
});

// SVG 카드 생성 함수
function generateCardSvg(data: any, recipeTitle: string, ingredients: any[]) {
  const cardSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 메인 그라디언트 (Figma 디자인 매칭) -->
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#91beff;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#7db4ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6ba3ff;stop-opacity:1" />
          </linearGradient>
          
          <!-- 배경 그라디언트 -->
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
          </linearGradient>
          
          <!-- 그림자 효과 -->
          <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="rgba(16,42,113,0.15)"/>
          </filter>
          
          <!-- 텍스트 그림자 -->
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
          </filter>
        </defs>
        
        <!-- 배경 -->
        <rect width="1200" height="630" fill="url(#bgGradient)"/>
        
        <!-- 메인 카드 (Figma 디자인 매칭) -->
        <rect x="80" y="60" width="1040" height="510" rx="28" fill="url(#cardGradient)" filter="url(#cardShadow)"/>
        
        <!-- 배경 장식 요소들 (Figma SVG 패스 스타일) -->
        <g opacity="0.15">
          <!-- 메인 장식 원 -->
          <circle cx="980" cy="140" r="45" fill="white"/>
          <circle cx="1050" cy="180" r="28" fill="white"/>
          <circle cx="920" cy="220" r="18" fill="white"/>
          
          <!-- 추가 장식 요소들 -->
          <path d="M950 300 Q970 280 990 300 Q970 320 950 300" fill="white" opacity="0.8"/>
          <rect x="900" y="350" width="4" height="40" rx="2" fill="white" opacity="0.6"/>
          <rect x="910" y="360" width="4" height="20" rx="2" fill="white" opacity="0.6"/>
        </g>
        
        <!-- AI ToBase 브랜딩 -->
        <g>
          <rect x="100" y="85" width="200" height="40" rx="20" fill="rgba(255,255,255,0.2)"/>
          <text x="200" y="110" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600">
            🧴 AI ToBase
          </text>
        </g>
        
        <!-- 메인 텍스트 콘텐츠 -->
        <g filter="url(#textShadow)">
          <!-- 첫 번째 줄: "이름님은" -->
          <text x="600" y="240" text-anchor="middle" fill="white" font-family="Pretendard, system-ui, -apple-system, sans-serif" font-size="52" font-weight="300" letter-spacing="-0.02em">
            ${data.name.length > 6 ? data.name.substring(0, 6) + '...' : data.name}님은
          </text>
          
          <!-- 두 번째 줄: 레시피 제목 (메인) -->
          <text x="600" y="340" text-anchor="middle" fill="#e0eef4" font-family="Pretendard, system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" letter-spacing="-0.02em">
            ${recipeTitle.length > 12 ? recipeTitle.substring(0, 12) + '...' : recipeTitle}
          </text>
          
          <!-- 세 번째 줄: "화장품이 필요해요" -->
          <text x="600" y="430" text-anchor="middle" fill="white" font-family="Pretendard, system-ui, -apple-system, sans-serif" font-size="52" font-weight="300" letter-spacing="-0.02em">
            화장품이 필요해요
          </text>
        </g>
        
        <!-- 하단 성분 미리보기 카드들 -->
        <g opacity="0.9">
          ${ingredients.slice(0, 3).map((ingredient, index) => `
            <g>
              <!-- 성분 카드 배경 -->
              <rect x="${160 + index * 290}" y="480" width="240" height="90" rx="16" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
              
              <!-- 성분명 -->
              <text x="${280 + index * 290}" y="510" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600">
                ${ingredient.name ? (ingredient.name.length > 8 ? ingredient.name.substring(0, 8) + '...' : ingredient.name) : `성분 ${index + 1}`}
              </text>
              
              <!-- 함량 -->
              <text x="${280 + index * 290}" y="540" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400">
                ${ingredient.percentage ? `${ingredient.percentage}%` : ingredient.amount || '적정량'}
              </text>
            </g>
          `).join('')}
        </g>
        
        <!-- 하단 브랜딩 -->
        <text x="600" y="590" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400">
          ${data.skin_type ? `${data.skin_type} 피부 • ` : ''}${data.age}세 • AI 맞춤 분석
        </text>
      </svg>
    `;

  console.log(`✅ Generated card image SVG for ${data.name}`);

  // SVG를 Response 객체로 반환 (캐시 방지 강화)
  return new Response(cardSvg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
      'Last-Modified': new Date().toUTCString()
    }
  });
}

// 동적 Open Graph를 위한 공유 페이지 엔드포인트
app.get("/make-server-44d07f49/share/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    console.log(`🔗 Generating share page for surveyId: "${surveyIdParam}"`);
    
    // 데모 모드 처리
    if (surveyIdParam === 'demo') {
      console.log('🎯 Demo mode activated for share page');
      const demoData = {
        id: 'demo',
        name: "김예진",
        age: 25,
        skin_type: "복합성",
        recommendation: JSON.stringify({
          recipe: [
            { name: "알로에 젤", percentage: 86.5 },
            { name: "히알루론산", percentage: 10 },
            { name: "글리세린", percentage: 3.5 }
          ]
        }),
        status: 'completed',
        created_at: new Date().toISOString()
      };
      
      const recipeTitle = "수분 지킴이";
      
      // 성분 정보 생성
      const keyIngredients = "알로에 젤 86.5%, 히알루론산 10%, 글리세린 3.5%";
      
      // 개인화된 메타 태그 생성
      const shareTitle = `${demoData.name}님은 ${recipeTitle}가 필요해요!`;
      const shareDescription = `🧴 ${keyIngredients} 등으로 구성된 맞춤형 화장품 레시피를 확인해보세요!`;
      
      // 개인화된 카드 이미지 URL 생성 (캐시 방지)
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://ccsakhalazqsvluqokhi.supabase.co';
      const timestamp = Date.now();
      const cardImageUrl = `${supabaseUrl}/functions/v1/make-server-44d07f49/card-image/demo?v=${timestamp}`;
      const shareImage = cardImageUrl;
      
      // 환경에 따른 동적 URL 설정
      const baseUrl = c.req.header('referer') || 
                     c.req.header('origin') || 
                     'https://ai-to-base.netlify.app';
      
      const shareUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      console.log(`✅ Generated demo share page for ${demoData.name}`);

      return c.html(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${shareTitle}</title>
          <meta name="description" content="${shareDescription}">
          
          <!-- Open Graph -->
          <meta property="og:type" content="website">
          <meta property="og:url" content="${shareUrl}">
          <meta property="og:title" content="${shareTitle}">
          <meta property="og:description" content="${shareDescription}">
          <meta property="og:image" content="${shareImage}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:site_name" content="AI ToBase">
          <meta property="og:locale" content="ko_KR">
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${shareTitle}">
          <meta name="twitter:description" content="${shareDescription}">
          <meta name="twitter:image" content="${shareImage}">
          
          <!-- 카카오톡 최적화 -->
          <meta property="kakao:title" content="${shareTitle}">
          <meta property="kakao:description" content="${shareDescription}">
          <meta property="kakao:image" content="${shareImage}">
          
          <!-- 캐시 방지 (강제 새로고침) -->
          <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
          <meta http-equiv="Pragma" content="no-cache">
          <meta http-equiv="Expires" content="0">
          
          <!-- 자동 리다이렉트 -->
          <meta http-equiv="refresh" content="0; url=${shareUrl}">
          
          <style>
            body {
              font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 2rem;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 2rem;
              max-width: 400px;
              width: 100%;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .loading {
              font-size: 1.2rem;
              margin-bottom: 1rem;
            }
            .progress {
              width: 100%;
              height: 8px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 4px;
              overflow: hidden;
              margin: 1rem 0;
            }
            .progress-bar {
              height: 100%;
              background: linear-gradient(90deg, #102A71, #667eea);
              border-radius: 4px;
              animation: progress 2s ease-in-out;
            }
            @keyframes progress {
              from { width: 0%; }
              to { width: 100%; }
            }
            .manual-link {
              color: white;
              text-decoration: underline;
              font-size: 0.9rem;
              margin-top: 1rem;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="loading">🧴 AI ToBase 로딩 중...</div>
            <div class="progress">
              <div class="progress-bar"></div>
            </div>
            <p style="font-size: 0.9rem; opacity: 0.8;">잠시만 기다려주세요...</p>
            <a href="${shareUrl}" class="manual-link">수동으로 이동하기</a>
          </div>
        </body>
        </html>
      `);
    }
    
    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.html(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>AI ToBase - 잘못된 링크</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, sans-serif; text-align: center; padding: 2rem;">
          <h1>❌ 잘못된 링크입니다</h1>
          <p>올바른 공유 링크가 아닙니다.</p>
          <a href="https://ai-to-base.netlify.app/" style="color: #102A71;">🏠 홈으로 가기</a>
        </body>
        </html>
      `);
    }
    
    // 설문 데이터 조회
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('id, name, age, skin_type, recommendation, status, created_at')
      .eq('id', surveyId)
      .single();

    if (error || !data) {
      console.log(`❌ Survey not found for surveyId: ${surveyId}`);
      return c.html(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>AI ToBase - 설문을 찾을 수 없음</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, sans-serif; text-align: center; padding: 2rem;">
          <h1>❌ 설문을 찾을 수 없습니다</h1>
          <p>요청하신 설문 데이터가 존재하지 않습니다.</p>
          <a href="https://ai-to-base.netlify.app/" style="color: #102A71;">🏠 홈으로 가기</a>
        </body>
        </html>
      `);
    }

    // AI 추천 결과 파싱
    let recipeTitle = "맞춤형 화장품 레시피";
    let keyIngredients = "";
    
    if (data.recommendation) {
      try {
        const rec = JSON.parse(data.recommendation);
        if (rec.recipe && Array.isArray(rec.recipe) && rec.recipe.length > 0) {
          // 첫 번째 성분 이름으로 레시피 제목 생성
          const mainIngredient = rec.recipe[0]?.name || "수분";
          recipeTitle = `${mainIngredient} 베이스 레시피`;
          
          // 상위 3개 성분 목록
          keyIngredients = rec.recipe
            .slice(0, 3)
            .map(item => `${item.name} ${item.percentage}%`)
            .join(", ");
        }
      } catch (parseError) {
        console.log("⚠️ Error parsing recommendation:", parseError);
      }
    }

    // 개인화된 메타 태그 생성
    const shareTitle = `${data.name}님은 ${recipeTitle}가 필요해요!`;
    const shareDescription = data.recommendation 
      ? `🧴 ${keyIngredients} 등으로 구성된 맞춤형 화장품 레시피를 확인해보세요!`
      : `🤖 AI가 ${data.name}님의 ${data.skin_type || data.age + "세"} 피부를 분석해서 맞춤형 화장품 레시피를 추천해드립니다!`;
    
    // 개인화된 카드 이미지 URL 생성 (캐시 방지)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://ccsakhalazqsvluqokhi.supabase.co';
    const timestamp = Date.now();
    const cardImageUrl = `${supabaseUrl}/functions/v1/make-server-44d07f49/card-image/${surveyId}?v=${timestamp}`;
    const shareImage = cardImageUrl;
    
    // 환경에 따른 동적 URL 설정
    const baseUrl = c.req.header('referer') || 
                   c.req.header('origin') || 
                   'https://ai-to-base.netlify.app';
    
    const shareUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    console.log(`✅ Generated personalized share page for ${data.name}`);

    return c.html(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${shareTitle}</title>
        <meta name="description" content="${shareDescription}">
        
        <!-- Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${shareUrl}">
        <meta property="og:title" content="${shareTitle}">
        <meta property="og:description" content="${shareDescription}">
        <meta property="og:image" content="${shareImage}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:site_name" content="AI ToBase">
        <meta property="og:locale" content="ko_KR">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${shareTitle}">
        <meta name="twitter:description" content="${shareDescription}">
        <meta name="twitter:image" content="${shareImage}">
        
        <!-- 카카오톡 최적화 -->
        <meta property="kakao:title" content="${shareTitle}">
        <meta property="kakao:description" content="${shareDescription}">
        <meta property="kakao:image" content="${shareImage}">
        
        <!-- 캐시 방지 (강제 새로고침) -->
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        
        <!-- 자동 리다이렉트 -->
        <meta http-equiv="refresh" content="0; url=${shareUrl}">
        
        <style>
          body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          .loading {
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }
          .progress {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin: 1rem 0;
          }
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #102A71, #667eea);
            border-radius: 4px;
            animation: progress 2s ease-in-out;
          }
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
          .manual-link {
            margin-top: 1.5rem;
            padding: 12px 24px;
            background: #102A71;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            transition: background 0.3s ease;
          }
          .manual-link:hover {
            background: #0f1f5a;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="loading">
            🧴 ${data.name}님의 맞춤 레시피로 이동 중...
          </div>
          <div class="progress">
            <div class="progress-bar"></div>
          </div>
          <p style="font-size: 0.9rem; opacity: 0.8;">
            ${data.recommendation ? '✅ AI 분석 완료' : '🔄 AI 분석 진행 중'}
          </p>
          <a href="${shareUrl}" class="manual-link">
            🏠 AI ToBase 바로가기
          </a>
        </div>
        
        <script>
          // 2초 후 자동 리다이렉트 (meta refresh 백업)
          setTimeout(() => {
            window.location.href = '${shareUrl}';
          }, 2000);
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.log("❌ Error generating share page:", error);
    return c.html(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>AI ToBase - 오류</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: system-ui, sans-serif; text-align: center; padding: 2rem;">
        <h1>❌ 페이지를 불러올 수 없습니다</h1>
        <p>잠시 후 다시 시도해주세요.</p>
        <a href="https://ai-to-base.netlify.app/" style="color: #102A71;">🏠 홈으로 가기</a>
      </body>
      </html>
    `);
  }
});

// 특정 설문의 AI 추천 결과 조회 엔드포인트
app.get("/make-server-44d07f49/recommendation/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    console.log(`🔍 Retrieving recommendation for surveyId: "${surveyIdParam}"`);
    
    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }
    
    console.log(`📊 Querying database for surveyId: ${surveyId}`);
    
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('id, name, age, skin_type, recommendation, status, created_at, updated_at')
      .eq('id', surveyId)
      .single();

    if (error) {
      console.log(`❌ Database query error for surveyId ${surveyId}:`, error);
      return c.json({ 
        success: false, 
        error: `설문 데이터 조회 실패: ${error.message}` 
      }, 404);
    }
    
    if (!data) {
      console.log(`❌ No data found for surveyId: ${surveyId}`);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다." 
      }, 404);
    }

    console.log(`✅ Survey data found for surveyId ${surveyId}. Has recommendation: ${!!data.recommendation}`);
    
    return c.json({ 
      success: true, 
      data: data,
      hasRecommendation: !!data.recommendation
    });

  } catch (error) {
    console.log("❌ Error retrieving recommendation:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다: " + error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);