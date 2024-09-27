export interface BlogEntry {
    blogEntryId?: number;
    title: string;
    content: string;
    categoryId: number;
    publicationDate: string; 
    userId: number;          
    categoryNames: string[];
  }