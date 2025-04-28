
import React from 'react';
import { 
  FileText, FileImage, FileVideo, FileAudio, 
  FileCode, FilePen, FileSpreadsheet, FileQuestion, FilePdf, FileX
} from 'lucide-react';

interface DocumentIconProps {
  fileType?: string;
  className?: string;
  size?: number;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ 
  fileType, 
  className = "h-5 w-5",
  size
}) => {
  const iconProps = {
    className,
    size: size || undefined
  };

  // Determine the appropriate icon based on file type
  if (!fileType) {
    return <FileText {...iconProps} />;
  }

  const type = fileType.toLowerCase();
  
  if (type.includes('image') || type.endsWith('png') || type.endsWith('jpg') || type.endsWith('jpeg') || type.endsWith('svg') || type.endsWith('gif')) {
    return <FileImage {...iconProps} />;
  }
  
  if (type.includes('video') || type.endsWith('mp4') || type.endsWith('mov') || type.endsWith('avi')) {
    return <FileVideo {...iconProps} />;
  }
  
  if (type.includes('audio') || type.endsWith('mp3') || type.endsWith('wav')) {
    return <FileAudio {...iconProps} />;
  }
  
  if (type.includes('code') || type.endsWith('js') || type.endsWith('ts') || type.endsWith('html') || type.endsWith('css')) {
    return <FileCode {...iconProps} />;
  }
  
  if (type.endsWith('doc') || type.endsWith('docx')) {
    return <FilePen {...iconProps} color="#4285f4" />;
  }
  
  if (type.endsWith('xls') || type.endsWith('xlsx') || type.endsWith('csv')) {
    return <FileSpreadsheet {...iconProps} color="#21a366" />;
  }
  
  if (type.endsWith('pdf')) {
    return <FilePdf {...iconProps} color="#ff5733" />;
  }
  
  if (type.endsWith('ppt') || type.endsWith('pptx')) {
    return <FileQuestion {...iconProps} color="#FF9900" />;
  }
  
  // Default case
  return <FileText {...iconProps} />;
};

export default DocumentIcon;
