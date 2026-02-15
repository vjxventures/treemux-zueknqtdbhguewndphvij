import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const analysisSchema = z.object({
  terrain: z.string().describe('Description of the terrain and geography'),
  population: z.string().describe('Estimated population density and settlement patterns'),
  existing: z.string().describe('Description of existing infrastructure visible'),
  recommendations: z.object({
    roads: z.array(z.string()).describe('Specific road infrastructure recommendations'),
    water: z.array(z.string()).describe('Water infrastructure recommendations including wells, purification, distribution'),
    electricity: z.array(z.string()).describe('Electricity infrastructure recommendations including solar, grid, microgrids'),
  }),
  priority: z.string().describe('Which infrastructure should be prioritized and why'),
  impact: z.string().describe('Expected impact on the community if recommendations are implemented'),
});

export async function POST(req: Request) {
  try {
    const { image, location } = await req.json();

    if (!image) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const prompt = `You are an expert infrastructure planner specializing in sustainable development for underserved regions.

Analyze this satellite/aerial image of ${location || 'the region'} and provide detailed infrastructure recommendations.

Consider:
1. Terrain and geographical features that affect infrastructure placement
2. Visible population density and settlement patterns
3. Existing infrastructure (roads, buildings, water sources)
4. Climate and environmental factors visible
5. Accessibility and connectivity needs

Provide specific, actionable recommendations for:
- Road networks (placement, type, priority routes)
- Water infrastructure (wells, purification systems, distribution networks)
- Electricity systems (solar grids, microgrids, main grid connections)

Focus on cost-effective, sustainable solutions appropriate for developing regions. Be specific about placement, scale, and phasing.`;

    const result = await generateObject({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image },
          ],
        },
      ],
      schema: analysisSchema,
      temperature: 0.7,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
