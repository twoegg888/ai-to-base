import { projectId, publicAnonKey } from './info';

// 스키마 업데이트 함수
export async function updateDatabaseSchema(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    console.log('🔧 Updating database schema...');
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-44d07f49/update-schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Schema update completed:', result.message);
      return { success: true, message: result.message };
    } else {
      console.error('❌ Schema update failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Schema update request failed:', error);
    return { 
      success: false, 
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// 스키마 상태 확인 함수
export async function checkSchemaStatus(): Promise<{ success: boolean; hasAnswersColumn?: boolean; error?: string }> {
  try {
    console.log('🔍 Checking schema status...');
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-44d07f49/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (response.ok) {
      return { success: true, hasAnswersColumn: true };
    } else {
      return { success: false, error: 'Server not responding' };
    }
  } catch (error) {
    console.error('Schema check failed:', error);
    return { 
      success: false, 
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}