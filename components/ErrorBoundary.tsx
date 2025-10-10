import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRestart = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 h-full overflow-y-auto flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-2xl text-red-600 mb-4 font-['Pretendard:SemiBold',_sans-serif]">
              앗, 오류가 발생했어요
            </h2>
            
            <p className="text-gray-600 mb-8 font-['Pretendard:Regular',_sans-serif]">
              예상치 못한 오류가 발생했습니다.<br />
              페이지를 새로고침하거나 다시 시도해보세요.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-red-50 p-4 rounded-lg mb-6 text-sm">
                <summary className="cursor-pointer text-red-700 font-medium mb-2">
                  개발자 정보 (클릭하여 확장)
                </summary>
                <pre className="text-red-600 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleRestart}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-['Pretendard:SemiBold',_sans-serif] hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
              >
                <RefreshCw size={18} />
                다시 시도
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-[#102A71] text-white rounded-xl font-['Pretendard:SemiBold',_sans-serif] hover:bg-[#0d2260] transition-colors duration-300 flex items-center gap-2"
              >
                <RefreshCw size={18} />
                페이지 새로고침
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}