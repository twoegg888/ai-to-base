import { projectId, publicAnonKey } from "./info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-44d07f49`;

interface UserInfo {
  name: string;
  age: string;
}

interface SurveyData extends UserInfo {
  skinType?: string;
  [key: string]: any; // 추후 더 많은 설문 항목을 위한 확장성
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  surveyId?: string;
  message?: string;
  error?: string;
  // Health check 관련 필드
  status?: string;
  timestamp?: string;
  database?: string;
  tableExists?: boolean;
  sampleDataCount?: number;
  instructions?: any;
}

// 설문 데이터 생성 (사용자 정보 저장)
export async function createSurvey(
  userInfo: UserInfo,
): Promise<ApiResponse> {
  try {
    console.log("Creating survey with user info:", userInfo);

    const response = await fetch(`${BASE_URL}/survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(userInfo),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Survey creation failed:", result);
      throw new Error(
        result.error || "설문 생성에 실패했습니다.",
      );
    }

    console.log("Survey created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating survey:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

// 설문 데이터 업데이트 (피부 타입 등 추가 정보)
export async function updateSurvey(
  surveyId: string,
  data: Partial<SurveyData>,
): Promise<ApiResponse> {
  try {
    console.log("Updating survey:", surveyId, data);

    const response = await fetch(
      `${BASE_URL}/survey/${surveyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Survey update failed:", result);
      throw new Error(
        result.error || "설문 업데이트에 실패했습니다.",
      );
    }

    console.log("Survey updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating survey:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

// 설문 데이터 조회
export async function getSurvey(
  surveyId: string,
): Promise<ApiResponse> {
  try {
    console.log("Getting survey:", surveyId);

    const response = await fetch(
      `${BASE_URL}/survey/${surveyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Survey retrieval failed:", result);
      throw new Error(
        result.error || "설문 조회에 실패했습니다.",
      );
    }

    console.log("Survey retrieved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error getting survey:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

// 모든 설문 데이터 조회 (관리자용)
export async function getAllSurveys(): Promise<ApiResponse> {
  try {
    console.log("Getting all surveys");

    const response = await fetch(`${BASE_URL}/surveys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Surveys retrieval failed:", result);
      throw new Error(
        result.error || "설문 목록 조회에 실패했습니다.",
      );
    }

    console.log("Surveys retrieved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error getting surveys:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

// 서버 상태 확인
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const result = await response.json();
    console.log("Server health check:", result);

    return response.ok && result.status === "healthy";
  } catch (error) {
    console.error("Server health check failed:", error);
    return false;
  }
}

// 서버 헬스체크 상세 정보 조회
export async function getServerHealth(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const result = await response.json();
    console.log("Detailed server health:", result);

    return result;
  } catch (error) {
    console.error("Detailed health check failed:", error);
    return {
      success: false,
      error: "서버에 연결할 수 없습니다.",
    };
  }
}

// AI 추천 결과 조회
export async function getAIRecommendation(
  surveyId: string,
): Promise<ApiResponse> {
  try {
    console.log(
      "Getting AI recommendation for survey:",
      surveyId,
    );

    const response = await fetch(
      `${BASE_URL}/recommendation/${surveyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "AI recommendation retrieval failed:",
        result,
      );
      throw new Error(
        result.error || "AI 추천 조회에 실패했습니다.",
      );
    }

    console.log(
      "AI recommendation retrieved successfully:",
      result,
    );
    return result;
  } catch (error) {
    console.error("Error getting AI recommendation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

// AI 추천이 완료될 때까지 폴링
export async function waitForAIRecommendation(
  surveyId: string,
  maxAttempts: number = 10,
): Promise<ApiResponse> {
  console.log(
    `🤖 Waiting for AI recommendation for survey ${surveyId}...`,
  );

  // 먼저 설문 데이터가 존재하는지 확인
  const surveyCheck = await getSurvey(surveyId);
  if (!surveyCheck.success) {
    console.error(
      "❌ Survey not found, cannot wait for AI recommendation:",
      surveyCheck.error,
    );
    return {
      success: false,
      error:
        "설문 데이터를 찾을 수 없어 AI 추천을 기다릴 수 없습니다.",
    };
  }

  console.log(
    "✅ Survey found, starting AI recommendation polling...",
  );

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(
      `📡 Polling attempt ${attempt}/${maxAttempts} for AI recommendation...`,
    );

    try {
      const result = await getAIRecommendation(surveyId);

      if (result.success && result.data?.recommendation) {
        console.log("✅ AI recommendation received!");
        return result;
      }

      // 결과가 없지만 오류가 아닌 경우 계속 대기
      console.log(
        `⏳ No AI recommendation yet, waiting... (${result.error || "No recommendation available"})`,
      );
    } catch (error) {
      console.error(
        "❌ Error during AI recommendation polling:",
        error,
      );
    }

    // 5초 대기 후 다시 시도 (시간 단축)
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log(
    "⏰ AI recommendation polling timeout - Make.com may still be processing",
  );
  return {
    success: false,
    error:
      "AI 추천 생성이 시간 초과되었습니다. Make.com에서 여전히 처리 중일 수 있습니다.",
  };
}