export interface MessageModel {
  from:  'content' | 'popup' | 'background';
  to:  'content' | 'popup' | 'background';
  msg:  'success' | 'pass' | 'failed' | string;
  content:  any;  
};
