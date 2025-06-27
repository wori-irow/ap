
import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Dialog, DialogRoot, DialogClose } from '~/components/ui/Dialog';
import { Card } from '~/components/ui/Card';

export const meta: MetaFunction = () => {
  return [
    { title: '인테리어 견적 계산기' },
    { name: 'description', content: '간편한 인테리어 비용 견적 계산기' }
  ];
};

export const loader = () => json({});

// 초기 인테리어 항목 단가 데이터
const initialPrices = {
  flooring: { name: '바닥재', price: 50000 },
  wallpaper: { name: '벽지', price: 30000 },
  paint: { name: '페인트', price: 20000 },
  lighting: { name: '조명', price: 100000 },
  tiles: { name: '타일', price: 80000 },
  door: { name: '문', price: 300000 },
  window: { name: '창문', price: 200000 },
  kitchen: { name: '주방', price: 2000000 },
  bathroom: { name: '욕실', price: 1500000 },
};

export default function Index() {
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [prices, setPrices] = useState(initialPrices);
  const [areas, setAreas] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleAdminLogin = () => {
    if (adminId === 'suwon1234' && adminPassword === '1234') {
      setIsAdminLoggedIn(true);
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handlePriceUpdate = (key: string, newPrice: number) => {
    setPrices(prev => ({
      ...prev,
      [key]: { ...prev[key], price: newPrice }
    }));
  };

  const handleAreaChange = (key: string, value: number) => {
    setAreas(prev => ({ ...prev, [key]: value }));
  };

  const handleQuantityChange = (key: string, value: number) => {
    setQuantities(prev => ({ ...prev, [key]: value }));
  };

  const calculateTotal = () => {
    return Object.entries(prices).reduce((total, [key, item]) => {
      const area = areas[key] || 0;
      const quantity = quantities[key] || 0;
      const isAreaBased = ['flooring', 'wallpaper', 'paint', 'tiles'].includes(key);
      const multiplier = isAreaBased ? area : quantity;
      return total + (item.price * multiplier);
    }, 0);
  };

  const closeAdminDialog = () => {
    setIsAdminDialogOpen(false);
    setIsAdminLoggedIn(false);
    setAdminId('');
    setAdminPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <BackgroundRays />
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 헤더와 관리자 버튼 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              인테리어 견적 계산기
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              쉽고 빠른 인테리어 비용 계산
            </p>
          </div>
          <Button
            onClick={() => setIsAdminDialogOpen(true)}
            variant="outline"
            className="px-6 py-2 bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:bg-gray-800/80 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
          >
            관리자 모드
          </Button>
        </div>

        {/* 견적 계산 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 항목별 입력 */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              항목별 면적/수량 입력
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(prices).map(([key, item]) => {
                const isAreaBased = ['flooring', 'wallpaper', 'paint', 'tiles'].includes(key);
                return (
                  <Card key={key} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          {item.price.toLocaleString()}원/{isAreaBased ? '㎡' : '개'}
                        </span>
                      </div>
                      <div>
                        <Label htmlFor={key} className="text-sm text-gray-600 dark:text-gray-300">
                          {isAreaBased ? '면적 (㎡)' : '수량 (개)'}
                        </Label>
                        <Input
                          id={key}
                          type="number"
                          min="0"
                          step="0.1"
                          value={isAreaBased ? (areas[key] || '') : (quantities[key] || '')}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (isAreaBased) {
                              handleAreaChange(key, value);
                            } else {
                              handleQuantityChange(key, value);
                            }
                          }}
                          className="mt-1 bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 견적 결과 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              견적 결과
            </h2>
            
            <Card className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-0 shadow-lg">
              <div className="space-y-4">
                {Object.entries(prices).map(([key, item]) => {
                  const isAreaBased = ['flooring', 'wallpaper', 'paint', 'tiles'].includes(key);
                  const multiplier = isAreaBased ? (areas[key] || 0) : (quantities[key] || 0);
                  const subtotal = item.price * multiplier;
                  
                  if (multiplier === 0) return null;
                  
                  return (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-white/20 last:border-b-0">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                          ({multiplier}{isAreaBased ? '㎡' : '개'})
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {subtotal.toLocaleString()}원
                      </span>
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t-2 border-purple-200 dark:border-purple-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      총 견적 금액
                    </span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {calculateTotal().toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 관리자 모드 다이얼로그 */}
        <DialogRoot open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
          <Dialog className="max-w-2xl" showCloseButton={false}>
            <div className="p-8 bg-white dark:bg-gray-900">
              {!isAdminLoggedIn ? (
                // 로그인 화면
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      관리자 로그인
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      단가 설정을 위해 로그인해주세요
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        아이디
                      </Label>
                      <Input
                        id="adminId"
                        type="text"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="mt-1"
                        placeholder="아이디를 입력하세요"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        비밀번호
                      </Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="mt-1"
                        placeholder="비밀번호를 입력하세요"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={closeAdminDialog}>
                      취소
                    </Button>
                    <Button onClick={handleAdminLogin} className="bg-purple-600 hover:bg-purple-700">
                      로그인
                    </Button>
                  </div>
                </div>
              ) : (
                // 단가 설정 화면
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      단가 설정
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      각 항목의 단가를 설정할 수 있습니다
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {Object.entries(prices).map(([key, item]) => {
                      const isAreaBased = ['flooring', 'wallpaper', 'paint', 'tiles'].includes(key);
                      return (
                        <div key={key} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.name} (원/{isAreaBased ? '㎡' : '개'})
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={item.price}
                                onChange={(e) => handlePriceUpdate(key, parseInt(e.target.value) || 0)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={closeAdminDialog}>
                      완료
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Dialog>
        </DialogRoot>
      </div>
    </div>
  );
}
