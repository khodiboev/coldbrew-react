export interface Term {
  _id: string;
  termText: string;
  termOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faq {
  _id: string;
  faqQuestion: string;
  faqAnswer: string;
  faqOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
