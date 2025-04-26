import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PageTransition } from '@/components/animations/PageTransition';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Users, Bookmark, Download, Upload, Palette, Image } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface InstitutionData {
  id: string;
  name: string;
  domain: string;
  is_premium: boolean;
  logo_url: string | null;
  branding_colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface ActivityData {
  date: string;
  uploads: number;
  searches: number;
}

interface TopicData {
  name: string;
  count: number;
  color: string;
}

interface ResearchGapData {
  department1: string;
  department2: string;
  collaborationScore: number;
}

interface Institution {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  selar_co_id: string | null;
  branding_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#7C3AED',
  secondary: '#4F46E5',
  accent: '#06B6D4'
};

const CHART_COLORS = [
  '#7C3AED', '#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', 
  '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'
];

const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [researchGaps, setResearchGaps] = useState<ResearchGapData[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  
  useEffect(() => {
    if (!user || user.account_type !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchInstitutionData = async () => {
      try {
        setLoading(true);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('institution_id')
          .eq('id', user.id)
          .single();
          
        if (profileData?.institution_id) {
          const { data: institutionData, error } = await supabase
            .from('institutions')
            .select('*')
            .eq('id', profileData.institution_id)
            .single();
            
          if (error) throw error;
          
          setInstitution(institutionData);
          
          if (institutionData.branding_colors) {
            setColors(institutionData.branding_colors);
          }
          
          fetchActivityData(institutionData.id);
          
          fetchTopicData(institutionData.id);
          
          fetchResearchGapsData(institutionData.id);
        }
      } catch (error) {
        console.error("Error fetching institution data:", error);
        toast({
          title: "Error",
          description: "Could not load institution data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstitutionData();
  }, [user, navigate]);
  
  const fetchActivityData = async (institutionId: string) => {
    try {
      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      const sampleData = last7Days.map(date => ({
        date,
        uploads: Math.floor(Math.random() * 10),
        searches: Math.floor(Math.random() * 20)
      }));
      
      setActivityData(sampleData);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  };
  
  const fetchTopicData = async (institutionId: string) => {
    try {
      const sampleTopics = [
        { name: "Machine Learning", count: 24, color: CHART_COLORS[0] },
        { name: "Climate Change", count: 18, color: CHART_COLORS[1] },
        { name: "Public Health", count: 15, color: CHART_COLORS[2] },
        { name: "Quantum Physics", count: 12, color: CHART_COLORS[3] },
        { name: "Economics", count: 9, color: CHART_COLORS[4] }
      ];
      
      setTopicData(sampleTopics);
    } catch (error) {
      console.error("Error fetching topic data:", error);
    }
  };
  
  const fetchResearchGapsData = async (institutionId: string) => {
    try {
      const sampleGaps = [
        { department1: "Computer Science", department2: "Biology", collaborationScore: 2 },
        { department1: "Medicine", department2: "Engineering", collaborationScore: 3 },
        { department1: "Economics", department2: "Environmental Science", collaborationScore: 1 },
        { department1: "Psychology", department2: "Statistics", collaborationScore: 4 }
      ];
      
      setResearchGaps(sampleGaps);
    } catch (error) {
      console.error("Error fetching research gaps:", error);
    }
  };
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
    }
  };
  
  const uploadLogo = async () => {
    if (!logoFile || !institution) return;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `logos/${institution.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('institution_assets')
        .upload(filePath, logoFile, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('institution_assets')
        .getPublicUrl(filePath);
        
      const { error: updateError } = await supabase
        .from('institutions')
        .update({ logo_url: publicUrl })
        .eq('id', institution.id);
        
      if (updateError) throw updateError;
      
      setInstitution({
        ...institution,
        logo_url: publicUrl
      });
      
      toast({
        title: 'Institution settings updated',
        description: 'Your institution settings have been successfully updated.',
        variant: 'default'
      });
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: 'Upload Failed',
        description: 'Could not upload logo. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const updateBrandingColors = async () => {
    if (!institution) return;
    
    try {
      const { error } = await supabase
        .from('institutions')
        .update({
          branding_colors: colors
        })
        .eq('id', institution.id);
        
      if (error) throw error;
      
      toast({
        title: 'Settings updated',
        description: 'Your institution branding settings have been saved.',
        variant: 'default'
      });
    } catch (error) {
      console.error("Error updating branding:", error);
      toast({
        title: 'Update Failed',
        description: 'Could not update branding colors.',
        variant: 'destructive'
      });
    }
  };
  
  const generateReport = async (reportType: string) => {
    if (!institution) return;
    
    try {
      setReportLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          reportType,
          institutionId: institution.id
        }
      });
      
      if (error) throw error;
      
      if (data.success && data.reportPdf) {
        const byteString = atob(data.reportPdf);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType.replace('_', ' ')}_report_${institution.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: 'PDF Report Generated',
          description: 'Your report has been successfully generated and is ready for download.',
          variant: 'default'
        });
      } else {
        throw new Error("Report generation failed");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: 'Report Generation Failed',
        description: 'Could not generate the requested report.',
        variant: 'destructive'
      });
    } finally {
      setReportLoading(false);
    }
  };
  
  if (loading) {
    return (
      <PageTransition>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="animate-pulse">
            <p className="text-xl font-medium text-foreground">Loading institution data...</p>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  if (!institution) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>No Institution Found</CardTitle>
              <CardDescription>
                You need to be part of an institution with admin privileges to access this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
              {institution.name} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Institutional insights and research analytics
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {institution.is_premium ? (
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                Premium Account
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => window.open('https://selar.com/o54g54', '_blank')}
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5" style={{ color: colors.primary }} />
                    Research Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activityData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="uploads" name="Uploads" fill={colors.primary} />
                      <Bar dataKey="searches" name="Searches" fill={colors.secondary} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Bookmark className="mr-2 h-5 w-5" style={{ color: colors.primary }} />
                    Top Research Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={topicData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {topicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5" style={{ color: colors.primary }} />
                    Collaboration Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {researchGaps.map((gap, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{gap.department1} + {gap.department2}</span>
                          <span className="font-medium">
                            Score: {gap.collaborationScore}/10
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${gap.collaborationScore * 10}%`,
                              backgroundColor: gap.collaborationScore < 3 ? colors.accent : colors.primary
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {institution.is_premium && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Based on your institution's research patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Potential Collaboration Opportunities</h3>
                    <p className="text-sm mb-4">
                      Our AI has detected potential synergies between departments that could lead to breakthrough research.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Computer Science + Medicine: AI-driven diagnostic tools</li>
                      <li>Economics + Environmental Science: Sustainable economy models</li>
                      <li>Psychology + Statistics: Advanced behavioral analytics</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Trending Research Topics</h3>
                    <p className="text-sm mb-4">
                      Based on global research trends and your institution's expertise, these topics may present opportunities:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Sustainable AI: Reducing the carbon footprint of machine learning</li>
                      <li>Post-pandemic mental health interventions</li>
                      <li>Climate-resilient agriculture techniques</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Activity Report</CardTitle>
                  <CardDescription>
                    Summary of all research uploads and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => generateReport('research_activity')}
                    disabled={reportLoading}
                  >
                    {reportLoading ? 'Generating...' : 'Generate Report'}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Collaboration Report</CardTitle>
                  <CardDescription>
                    Analysis of research groups and joint projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => generateReport('collaboration')}
                    disabled={reportLoading}
                  >
                    {reportLoading ? 'Generating...' : 'Generate Report'}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Engagement Report</CardTitle>
                  <CardDescription>
                    Analytics on researcher activity and contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => generateReport('user_engagement')}
                    disabled={reportLoading}
                  >
                    {reportLoading ? 'Generating...' : 'Generate Report'}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {!institution.is_premium && (
              <div className="mt-8 p-6 border border-dashed rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Premium Reports</h3>
                <p className="mb-4 text-muted-foreground">
                  Upgrade to Premium to unlock advanced analytics and custom reports.
                </p>
                <Button 
                  variant="default" 
                  onClick={() => window.open('https://selar.com/o54g54', '_blank')}
                >
                  Upgrade Now
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="branding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Image className="mr-2 h-5 w-5" />
                    Institution Logo
                  </CardTitle>
                  <CardDescription>
                    Upload your institution's logo for use throughout the app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    {institution.logo_url && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border">
                        <img 
                          src={institution.logo_url} 
                          alt={institution.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    
                    <Label htmlFor="logo">Select Logo Image</Label>
                    <Input 
                      id="logo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
                    />
                    
                    <Button 
                      onClick={uploadLogo} 
                      disabled={!logoFile}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Brand Colors
                  </CardTitle>
                  <CardDescription>
                    Customize the color scheme to match your institution's branding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full border" 
                          style={{ backgroundColor: colors.primary }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">Change Primary Color</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <SketchPicker
                              color={colors.primary}
                              onChange={(color) => setColors({...colors, primary: color.hex})}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full border" 
                          style={{ backgroundColor: colors.secondary }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">Change Secondary Color</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <SketchPicker
                              color={colors.secondary}
                              onChange={(color) => setColors({...colors, secondary: color.hex})}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full border" 
                          style={{ backgroundColor: colors.accent }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">Change Accent Color</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <SketchPicker
                              color={colors.accent}
                              onChange={(color) => setColors({...colors, accent: color.hex})}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <Button onClick={updateBrandingColors}>
                      Save Brand Colors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default InstitutionDashboard;
