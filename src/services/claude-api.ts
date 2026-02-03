import type { AssessmentData, AnalysisConfig, QuadrantWeights, LifeContext } from '../types';
import { LIFE_CONTEXT_OPTIONS } from '../types';

// Try to auto-discover the API server port
// Start at 3010 to avoid common dev ports (3000-3009)
const DEFAULT_PORT = 3010;
const MAX_PORT = 3020;

let discoveredPort: number | null = null;

export const getApiBaseUrl = async (): Promise<string> => {
  // If we already found it, use it
  if (discoveredPort) {
    return `http://localhost:${discoveredPort}/api`;
  }
  
  // Try ports 3001-3010
  for (let port = DEFAULT_PORT; port <= MAX_PORT; port++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 500);
      
      // Check health endpoint
      const response = await fetch(`http://localhost:${port}/api/health`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        const data = await response.json();
        // Verify it's OUR server - check for our specific response format
        if (data.status === 'ok' && data.app === 'ikigai-compass') {
          discoveredPort = port;
          return `http://localhost:${port}/api`;
        } else {
          console.log(`Port ${port} has server but not Ikigai Compass, continuing...`);
        }
      }
    } catch {
      // Port not available, try next
    }
  }
  
  throw new Error(
    `Could not find Ikigai Compass server on ports ${DEFAULT_PORT}-${MAX_PORT}. ` +
    `Please ensure the server is running with: npm run server`
  );
};

const getLifeContextGuidance = (context: LifeContext): string => {
  const contextInfo = LIFE_CONTEXT_OPTIONS.find(c => c.id === context);
  const guidance: Record<LifeContext, string> = {
    exploring: `This person is in an EXPLORATORY phase - early in their journey, discovering options. Focus on breadth over depth, experimentation, building foundational skills, and keeping options open. Emphasize low-risk ways to test different paths. Acknowledge that their ikigai may evolve significantly.`,
    transitioning: `This person is TRANSITIONING - changing careers or roles. Focus on leveraging transferable skills, bridging current experience to new directions, managing the uncertainty of change, and practical steps to pivot. Address potential fears about starting over and how existing strengths apply to new contexts.`,
    established: `This person is ESTABLISHED - stable career, seeking deeper meaning. Focus on finding purpose within or alongside current work, subtle shifts rather than dramatic changes, mentorship opportunities, and integrating passion projects. They may need permission to want more despite external success.`,
    reinventing: `This person is REINVENTING - major life change, starting fresh. Focus on embracing the blank slate, redefining success on their own terms, building new identity, and finding meaning in the rebuilding process. Acknowledge both the liberation and challenge of reinvention.`,
    retiring: `This person is approaching RETIREMENT or legacy phase. Focus on contribution, wisdom-sharing, mentorship, meaningful leisure, and leaving a lasting impact. Shift emphasis from earning to fulfillment, from building to giving back. Consider health, relationships, and sustainable engagement.`,
  };
  return `Life Stage: ${contextInfo?.label} - ${contextInfo?.description}\n${guidance[context]}`;
};

const getWeightingContext = (weights: QuadrantWeights): string => {
  const sorted = Object.entries(weights)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => {
      const labels: Record<string, string> = {
        love: 'What You Love',
        goodAt: 'What You\'re Good At',
        worldNeeds: 'What the World Needs',
        paidFor: 'What You Can Be Paid For',
      };
      return { key, label: labels[key], value };
    });

  const isBalanced = Math.max(...Object.values(weights)) - Math.min(...Object.values(weights)) <= 15;

  if (isBalanced) {
    return `The person values all four dimensions relatively equally (${sorted.map(s => `${s.label}: ${s.value}%`).join(', ')}). Seek a balanced center point where all four intersect harmoniously.`;
  }

  const primary = sorted[0];
  const secondary = sorted[1];
  const lowest = sorted[3];

  return `Priority weighting reveals important values:
- PRIMARY (${primary.value}%): ${primary.label} - This is their anchor. Weight recommendations heavily toward this dimension.
- SECONDARY (${secondary.value}%): ${secondary.label} - Strong supporting factor.
- LOWER PRIORITY (${lowest.value}%): ${lowest.label} - Less critical to their fulfillment. It's okay if paths don't maximize this dimension.

This weighting suggests they may find fulfillment even without perfect balance - the traditional "center" of ikigai may be less important than honoring their ${primary.label.toLowerCase()}.`;
};

export const buildIkigaiPrompt = (data: AssessmentData, config: AnalysisConfig): string => {
  const love = data.quadrants.find(q => q.id === 'love');
  const goodAt = data.quadrants.find(q => q.id === 'goodAt');
  const worldNeeds = data.quadrants.find(q => q.id === 'worldNeeds');
  const paidFor = data.quadrants.find(q => q.id === 'paidFor');

  const formatQuadrantWithGroups = (q: typeof love) => {
    if (!q) return 'Not provided';
    const groupedSelections: string[] = [];

    q.groups.forEach(group => {
      const selectedInGroup = q.selected
        .map(id => group.options.find(o => o.id === id))
        .filter(Boolean)
        .map(o => o!.label);
      if (selectedInGroup.length > 0) {
        groupedSelections.push(`${group.label}: ${selectedInGroup.join(', ')}`);
      }
    });

    const custom = q.customInputs.filter(i => i.trim());
    if (custom.length > 0) {
      groupedSelections.push(`Custom additions: ${custom.join(', ')}`);
    }

    return groupedSelections.length > 0 ? groupedSelections.join('\n') : 'Not provided';
  };

  return `You are a thoughtful guide deeply versed in ikigai (生き甲斐) - the Japanese concept of "a reason for being."

## Important Cultural Context

The Western "Venn diagram" interpretation of ikigai (four overlapping circles) is a modern adaptation. Traditional Japanese ikigai is more nuanced:

- **Ikigai is not just about career** - It can be found in small daily joys, relationships, hobbies, or service to others
- **It emphasizes the journey** - Finding ikigai is a lifelong process of discovery, not a destination
- **It values harmony (wa/和)** - Balance and integration matter more than optimization
- **It connects to kaizen (改善)** - Continuous small improvements toward alignment
- **It acknowledges seasons** - One's ikigai naturally evolves through life stages
- **It prizes meaning over money** - While income matters, it's rarely the primary driver

Your role is to synthesize their selections into insights that honor both the practical Western framework AND these deeper Japanese principles.

---

## Person's Life Context

${getLifeContextGuidance(config.lifeContext)}

---

## Their Stated Priorities

${getWeightingContext(config.weights)}

---

## Assessment Data

### WHAT YOU LOVE (情熱 - Passion)
${formatQuadrantWithGroups(love)}

### WHAT YOU'RE GOOD AT (才能 - Talent/Skill)
${formatQuadrantWithGroups(goodAt)}

### WHAT THE WORLD NEEDS (使命 - Mission)
${formatQuadrantWithGroups(worldNeeds)}

### WHAT YOU CAN BE PAID FOR (職業 - Vocation)
${formatQuadrantWithGroups(paidFor)}

---

## Your Task

Create a deeply personalized ikigai analysis. Structure your response as follows:

# Your Ikigai Analysis

## 1. First Impressions
A warm, insightful 2-3 paragraph reflection on what stands out about this person's unique combination. What patterns do you notice? What tensions or synergies exist between their selections? Speak directly to them.

## 2. The Four Dimensions

### 情熱 What You Love
Go beyond listing - analyze what these passions reveal about their intrinsic motivations, values, and sources of energy. What themes connect their choices?

### 才能 What You're Good At
How do these skills complement their passions? Which skills are foundational vs. differentiating? Where might there be hidden strengths?

### 使命 What The World Needs
What draws them to these causes? How do the world's needs intersect with their personal story? Consider both local and global impact.

### 職業 What You Can Be Paid For
Realistic assessment of market opportunities. Consider emerging fields, non-obvious applications, and how their combination creates unique value.

## 3. The Intersections & Tensions

Analyze the four classical ikigai intersections, BUT also:
- Identify any **tensions** between quadrants (e.g., loving solitary work but skills in leadership)
- Note where **trade-offs** may be necessary given their priorities
- Suggest how their weighted priorities might resolve apparent conflicts

### Where Passion Meets Mission (Your Calling)
### Where Passion Meets Skill (Your Flow State)
### Where Mission Meets Market (Your Contribution)
### Where Skill Meets Market (Your Craft)
### The Center - Or Not
Based on their weightings, discuss whether pursuing the "perfect center" makes sense, or if they might find deeper fulfillment emphasizing certain intersections over others.

## 4. Potential Paths

Propose 3-5 specific paths aligned with their ikigai. For each:
- **The Path**: Concrete description
- **Why It Fits**: Connection to their specific selections and priorities
- **The Journey**: How to explore this (appropriate for their life stage)
- **Honest Challenges**: What would be hard about this path
- **A Small First Step**: Something they could do this week

## 5. Your Ikigai Roadmap

Tailored to their life stage (${config.lifeContext}):

### Immediate (This Month)
Small experiments and reflections to begin.

### Near-term (3-6 Months)
Building blocks and exploration.

### Longer Horizon
Vision of deeper alignment, acknowledging that ikigai evolves.

## 6. Signs of Alignment

How will they know they're moving toward their ikigai? Offer both external markers and internal indicators (energy, meaning, flow).

## 7. A Final Reflection

Close with something meaningful - perhaps a relevant Japanese concept, a reframe of their situation, or encouragement for their specific journey. Make it personal to their data.

---

Important guidelines:
- Be specific to THEIR selections - avoid generic advice
- Honor their stated priorities and life stage
- Acknowledge complexity and trade-offs honestly
- Balance inspiration with practicality
- Write in a warm but substantive tone
- Format in clean Markdown with clear hierarchy
- **DO NOT ask clarifying questions** - work with the data provided and make reasonable inferences
- **DO NOT offer to elaborate further** - provide the complete analysis in this single response
- If information seems limited, acknowledge it briefly and work with what you have`;
};

export const callClaudeAPI = async (prompt: string, model?: string): Promise<string> => {
  const apiBaseUrl = await getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
};
