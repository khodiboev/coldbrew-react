import axios from "axios";
import { serverApi } from "../../lib/config";
import { Term, Faq } from "../../lib/types/content";

class ContentService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTerms(): Promise<Term[]> {
    try {
      const url = `${this.path}/content/terms`;
      const result = await axios.get(url);
      console.log("getTerms:", result);
      return result.data;
    } catch (err) {
      console.log("Error, getTerms: ", err);
      throw err;
    }
  }

  public async getFaqs(): Promise<Faq[]> {
    try {
      const url = `${this.path}/content/faqs`;
      const result = await axios.get(url);
      console.log("getFaqs:", result);
      return result.data;
    } catch (err) {
      console.log("Error, getFaqs: ", err);
      throw err;
    }
  }
}

export default ContentService;
