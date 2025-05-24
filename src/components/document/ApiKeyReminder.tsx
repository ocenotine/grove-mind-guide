
import React, { useEffect, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getOpenRouterApiKey } from '@/utils/openRouterUtils';

const ApiKeyReminder = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = getOpenRouterApiKey();
      
      if (!apiKey) {
        setApiStatus('invalid');
        return;
      }
      
      try {
        // Make a simple request to validate the API key is working
        const response = await fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mindgrove.app'
          }
        });
        
        if (response.ok) {
          setApiStatus('valid');
        } else {
          setApiStatus('invalid');
        }
      } catch (error) {
        console.error("Error checking API key:", error);
        setApiStatus('invalid');
      }
    };
    
    // Check the API key on component mount
    checkApiKey();
  }, []);
  
  // If API key is valid, don't show anything
  if (apiStatus === 'valid') {
    return null;
  }
  
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          {apiStatus === 'checking' ? (
            <div className="h-5 w-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300">
              {apiStatus === 'checking' ? 'Checking AI service connection...' : 'AI features enabled'}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              {apiStatus === 'checking' 
                ? 'Verifying connection to OpenRouter AI services...' 
                : 'OpenRouter API service is configured and ready to use.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyReminder;
