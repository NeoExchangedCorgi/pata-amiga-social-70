
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'agora';
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }
};

export const formatDateBR = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const getUserInitials = (fullName: string): string => {
  return fullName.charAt(0).toUpperCase();
};

export const abbreviateName = (fullName: string, maxLength: number = 20): string => {
  if (fullName.length <= maxLength) {
    return fullName;
  }

  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length <= 1) {
    return fullName.slice(0, maxLength - 3) + '...';
  }

  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  // Se primeiro + último nome cabem no limite
  if ((firstName + ' ' + lastName).length <= maxLength) {
    return `${firstName} ${lastName}`;
  }
  
  // Se não cabem, abreviar o primeiro nome
  const abbreviatedFirst = firstName.slice(0, Math.max(3, maxLength - lastName.length - 6)) + '...';
  return `${abbreviatedFirst} ${lastName}`;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
