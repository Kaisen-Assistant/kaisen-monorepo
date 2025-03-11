import TwitterScraperTool from './tools/twitter/scraper';
import LLMTradingAnalyzer from './tools/twitter/llm-analyzer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get Anthropic API key from environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function runTest() {
  // Step 1: Scrape Twitter
  console.log("Scraping Twitter...");
  const twitterScraper = new TwitterScraperTool();
  
  const options = {
    query: "cryptocurrency OR bitcoin OR crypto",
    maxTweets: 10
  };
  
  const scraperResult = await twitterScraper._call(JSON.stringify(options));
  console.log("Twitter Scraper Result:");
  console.log(scraperResult);
  
  // Step 2: Analyze with Claude if scraping was successful
  const parsedResult = JSON.parse(scraperResult);
  if (!parsedResult.error && ANTHROPIC_API_KEY) {
    console.log("\nAnalyzing with Claude...");
    const llmAnalyzer = new LLMTradingAnalyzer(ANTHROPIC_API_KEY);
    
    const tradingRecommendation = await llmAnalyzer.analyzeTradingDecision(
      parsedResult,
      "BTC"
    );
    
    console.log("\nTrading Recommendation:");
    console.log(JSON.stringify(tradingRecommendation, null, 2));
    
    // Final decision
    console.log("\n========== FINAL TRADING DECISION ==========");
    console.log(`Recommendation: ${tradingRecommendation.recommendation}`);
    console.log(`Confidence: ${tradingRecommendation.confidence}%`);
    console.log(`Risk Level: ${tradingRecommendation.riskLevel}`);
    console.log(`Reasoning: ${tradingRecommendation.reasoning}`);
    
    // Display key insights
    console.log("\nKey Insights:");
    tradingRecommendation.keyInsights.forEach((insight, index) => {
      console.log(`${index + 1}. ${insight}`);
    });
    
    return tradingRecommendation;
  } else if (!ANTHROPIC_API_KEY) {
    console.log("\nSkipping Claude analysis: No Anthropic API key found.");
    console.log("Please set the ANTHROPIC_API_KEY environment variable.");
    return null;
  } else {
    console.log("\nSkipping Claude analysis: Twitter scraping returned an error.");
    return null;
  }
}

// For running directly: node -r ts-node/register test-claude-analyzer.ts
if (require.main === module) {
  runTest().catch(console.error);
}

// For importing and testing programmatically
export async function testWithMockData() {
  console.log("\n========== RUNNING TEST WITH MOCK DATA ==========");
  
  // Skip Twitter scraping and use mock data instead
  const mockScraperResult = {
    query: "cryptocurrency OR bitcoin OR crypto",
    totalTweets: 10,
    analysis: {
      totalCryptoTweets: 8,
      potentiallyPositiveTweets: 6,
      topHashtags: ["#Bitcoin", "#Crypto", "#Blockchain", "#BTC"]
    }
  };
  
  if (ANTHROPIC_API_KEY) {
    console.log("Mock Data:");
    console.log(JSON.stringify(mockScraperResult, null, 2));
    
    console.log("\nAnalyzing with Claude...");
    const llmAnalyzer = new LLMTradingAnalyzer(ANTHROPIC_API_KEY);
    
    const tradingRecommendation = await llmAnalyzer.analyzeTradingDecision(
      mockScraperResult,
      "BTC"
    );
    
    console.log("\nTrading Recommendation:");
    console.log(JSON.stringify(tradingRecommendation, null, 2));
    
    return tradingRecommendation;
  } else {
    console.log("Skipping Claude analysis: No Anthropic API key found.");
    console.log("Please set the ANTHROPIC_API_KEY environment variable.");
    return null;
  }
}

// Export the main function for programmatic use
export { runTest };