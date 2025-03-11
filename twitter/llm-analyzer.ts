import Anthropic from '@anthropic-ai/sdk';

// Define the trading recommendation interface
interface TradingRecommendation {
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number; // 0-100
  reasoning: string;
  marketSentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  keyInsights: string[];
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

// The ScraperResult interface
interface ScraperResult {
  query: string;
  totalTweets: number;
  analysis: {
    totalCryptoTweets: number;
    potentiallyPositiveTweets: number;
    topHashtags: string[];
  };
}

class LLMTradingAnalyzer {
  private anthropic: Anthropic;
  
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey
    });
  }

  async analyzeTradingDecision(
    scraperResult: ScraperResult,
    cryptoSymbol: string
  ): Promise<TradingRecommendation> {
    try {
      // Create a prompt for the Anthropic Claude API
      const prompt = this.createTradingPrompt(scraperResult, cryptoSymbol);
      
      // Call the Claude API
      const message = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // Using Claude 3.7 Sonnet
        max_tokens: 1000,
        temperature: 0.2,
        system: "You are a cryptocurrency trading expert analyzing Twitter sentiment. You MUST respond ONLY with the JSON object as specified in the prompt, no other text.",
        messages: [
          { role: "user", content: prompt }
        ]
      });
      
      // Get the response text - fixing this part to correctly access Claude's response structure
      let responseText = "";
      // Content is an array of content blocks, we need to find text blocks
      for (const block of message.content) {
        if (block.type === 'text') {
          responseText += block.text;
        }
      }
      
      // Parse the JSON response
      try {
        // Extract JSON from the response (in case there's additional text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }
        
        const recommendation = JSON.parse(jsonMatch[0]) as TradingRecommendation;
        return recommendation;
      } catch (parseError) {
        console.error("Failed to parse Claude response:", parseError);
        // Return a default recommendation if parsing fails
        return this.getDefaultRecommendation();
      }
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return this.getDefaultRecommendation();
    }
  }

  private createTradingPrompt(scraperResult: ScraperResult, cryptoSymbol: string): string {
    const { query, totalTweets, analysis } = scraperResult;
    const { totalCryptoTweets, potentiallyPositiveTweets, topHashtags } = analysis;
    
    // Calculate a basic sentiment score based on positive tweets
    const sentimentScore = totalCryptoTweets > 0 
      ? (potentiallyPositiveTweets / totalCryptoTweets) * 100
      : 0;
    
    // Create the prompt for Claude
    return `
CRYPTO SYMBOL: ${cryptoSymbol}
TWITTER SENTIMENT ANALYSIS:
- Query: "${query}"
- Total tweets analyzed: ${totalTweets}
- Crypto-related tweets: ${totalCryptoTweets}
- Potentially positive tweets: ${potentiallyPositiveTweets}
- Sentiment score (0-100): ${Math.round(sentimentScore)}
- Top hashtags: ${topHashtags.join(', ')}

Based on this Twitter data, provide a trading recommendation in the following JSON format:
{
  "recommendation": "BUY" or "SELL" or "HOLD",
  "confidence": [number between 0-100],
  "reasoning": [concise explanation],
  "marketSentiment": "BULLISH" or "BEARISH" or "NEUTRAL",
  "keyInsights": [array of key observations from the data],
  "riskLevel": "LOW" or "MEDIUM" or "HIGH"
}

Respond ONLY with the JSON object, no other text.
    `;
  }

  private getDefaultRecommendation(): TradingRecommendation {
    return {
      recommendation: "HOLD",
      confidence: 0,
      reasoning: "Error processing sentiment analysis",
      marketSentiment: "NEUTRAL",
      keyInsights: ["Error in analysis"],
      riskLevel: "HIGH"
    };
  }
}

export default LLMTradingAnalyzer;