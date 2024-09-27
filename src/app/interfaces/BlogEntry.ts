export interface BlogEntry {
    blogId :number;
    title: string;
    content: string;
    categoryIds: number[];
    publicationDate: string; 
    userId: number;    
    categoryNames:  string[];  
  }