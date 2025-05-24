
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ChatSettingsProps {
  onSettingsChange?: (settings: ChatSettings) => void;
}

export interface ChatSettings {
  responseStyle: 'concise' | 'detailed' | 'conversational';
  creativity: number;
  autoSave: boolean;
  soundEffects: boolean;
  model: 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4o';
}

const defaultSettings: ChatSettings = {
  responseStyle: 'conversational',
  creativity: 50,
  autoSave: true,
  soundEffects: true,
  model: 'gpt-3.5-turbo'
};

export const ChatSettings: React.FC<ChatSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    
    // Notify parent component
    onSettingsChange?.(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('chatSettings', JSON.stringify(defaultSettings));
    onSettingsChange?.(defaultSettings);
    
    toast({
      title: 'Settings Reset',
      description: 'Chat settings have been reset to defaults.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">AI Assistant Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Customize how your AI assistant responds and behaves
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Response Style</CardTitle>
          <CardDescription>
            Choose how detailed you want the AI responses to be
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.responseStyle}
            onValueChange={(value: ChatSettings['responseStyle']) => 
              updateSetting('responseStyle', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concise">Concise - Brief and to the point</SelectItem>
              <SelectItem value="conversational">Conversational - Natural and friendly</SelectItem>
              <SelectItem value="detailed">Detailed - Comprehensive explanations</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Model</CardTitle>
          <CardDescription>
            Select which AI model to use for responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.model}
            onValueChange={(value: ChatSettings['model']) => 
              updateSetting('model', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo - Fast and efficient</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini - Balanced performance</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o - Most capable (slower)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Creativity Level</CardTitle>
          <CardDescription>
            Adjust how creative or conservative the AI responses are
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[settings.creativity]}
              onValueChange={([value]) => updateSetting('creativity', value)}
              max={100}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General Settings</CardTitle>
          <CardDescription>
            Configure general chat preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save conversations</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save chat sessions
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSetting('autoSave', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound effects</Label>
              <p className="text-xs text-muted-foreground">
                Play sounds for notifications
              </p>
            </div>
            <Switch
              checked={settings.soundEffects}
              onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default ChatSettings;
