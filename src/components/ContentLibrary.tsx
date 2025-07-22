import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Library, Search, Upload, FileText, Video, 
  Image, Download, Eye, Tag, Filter,
  ArrowLeft, Folder, Star, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  type: 'document' | 'video' | 'image' | 'text';
  description: string;
  tags: string[];
  file_url?: string;
  content?: string;
  created_at: string;
  created_by: string;
  usage_count: number;
}

const ContentLibrary = () => {
  const navigate = useNavigate();
  const { canManageContent, loading } = useUserRole();
  const { toast } = useToast();
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [newContent, setNewContent] = useState({
    title: '',
    type: 'text',
    description: '',
    tags: '',
    content: ''
  });

  // Mock data for demonstration - in real app this would come from Supabase
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockData: ContentItem[] = [
      {
        id: '1',
        title: 'Guida Completa al Prompt Engineering',
        type: 'document',
        description: 'Documento PDF con tecniche avanzate di prompt engineering',
        tags: ['prompt', 'ai', 'guide', 'avanzato'],
        file_url: '/documents/prompt-guide.pdf',
        created_at: '2024-01-15',
        created_by: 'admin',
        usage_count: 156
      },
      {
        id: '2',
        title: 'Video Tutorial: Chain of Thought',
        type: 'video',
        description: 'Video esplicativo sulla tecnica Chain of Thought',
        tags: ['video', 'tutorial', 'chain-of-thought'],
        file_url: '/videos/cot-tutorial.mp4',
        created_at: '2024-01-10',
        created_by: 'instructor',
        usage_count: 89
      },
      {
        id: '3',
        title: 'Template Prompt per Marketing',
        type: 'text',
        description: 'Collezione di template prompt ottimizzati per marketing',
        tags: ['template', 'marketing', 'prompt'],
        content: 'Raccogli di template pronti all\'uso...',
        created_at: '2024-01-08',
        created_by: 'admin',
        usage_count: 234
      },
      {
        id: '4',
        title: 'Diagramma AI Architecture',
        type: 'image',
        description: 'Schema dell\'architettura di sistemi AI moderni',
        tags: ['diagramma', 'architettura', 'ai'],
        file_url: '/images/ai-architecture.png',
        created_at: '2024-01-05',
        created_by: 'instructor',
        usage_count: 67
      }
    ];
    setContentItems(mockData);
    setLoadingData(false);
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-400 bg-blue-400/10';
      case 'video': return 'text-red-400 bg-red-400/10';
      case 'image': return 'text-green-400 bg-green-400/10';
      case 'text': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading Content Library...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/admin-lms')} 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard Admin
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium text-xl">
              Content Library
            </div>
            <div className="text-slate-400 text-sm">
              Repository centralizzato per tutti i contenuti formativi
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-amber-300 border-amber-500/50">
              Knowledge Base
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Cerca contenuti, tag, descrizioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-slate-200"
              />
            </div>
          </div>
          <div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="document">Documenti</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="image">Immagini</SelectItem>
                <SelectItem value="text">Testi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            {canManageContent() && (
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Carica Contenuto
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <DialogHeader>
                    <DialogTitle>Carica Nuovo Contenuto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Titolo</Label>
                      <Input 
                        value={newContent.title}
                        onChange={(e) => setNewContent(prev => ({...prev, title: e.target.value}))}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select value={newContent.type} onValueChange={(val: any) => setNewContent(prev => ({...prev, type: val}))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="text">Testo</SelectItem>
                          <SelectItem value="document">Documento</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="image">Immagine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Descrizione</Label>
                      <Input 
                        value={newContent.description}
                        onChange={(e) => setNewContent(prev => ({...prev, description: e.target.value}))}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label>Tag (separati da virgola)</Label>
                      <Input 
                        value={newContent.tags}
                        onChange={(e) => setNewContent(prev => ({...prev, tags: e.target.value}))}
                        placeholder="prompt, ai, tutorial"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Carica Contenuto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <CardTitle className="text-slate-200 text-sm">{item.title}</CardTitle>
                      <CardDescription className="text-slate-400 text-xs">
                        {item.created_at}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Eye className="w-3 h-3" />
                    <span>{item.usage_count}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-3">{item.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-slate-300">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-300">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" className="text-slate-300">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Library className="w-16 h-16 mx-auto text-slate-500 mb-4" />
            <div className="text-slate-400 text-lg">Nessun contenuto trovato</div>
            <div className="text-slate-500 text-sm">
              {searchTerm ? 'Prova con altri termini di ricerca' : 'Inizia caricando i primi contenuti'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;