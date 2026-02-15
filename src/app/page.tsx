'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, MapPin, Zap, Droplets, Loader2 } from 'lucide-react';

interface AnalysisResult {
  terrain: string;
  population: string;
  existing: string;
  recommendations: {
    roads: string[];
    water: string[];
    electricity: string[];
  };
  priority: string;
  impact: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, location }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Infrastructure Vision AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Using satellite imagery and AI to help developing regions plan sustainable infrastructure
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Satellite Imagery</CardTitle>
              <CardDescription>
                Provide satellite or aerial images of the region you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location/Region Name</Label>
                <Input
                  id="location"
                  placeholder="e.g., Rural Ghana, Northern India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Satellite Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    {image ? (
                      <div className="space-y-2">
                        <img src={image} alt="Uploaded" className="max-h-64 mx-auto rounded" />
                        <p className="text-sm text-gray-500">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload satellite imagery
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button
                onClick={analyzeImage}
                disabled={!image || analyzing}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Infrastructure Needs'
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {result ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>{location || 'Analysis Region'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1">Terrain Analysis</h3>
                      <p className="text-sm text-gray-600">{result.terrain}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1">Population Density</h3>
                      <p className="text-sm text-gray-600">{result.population}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1">Existing Infrastructure</h3>
                      <p className="text-sm text-gray-600">{result.existing}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Road Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.roads.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      Water Systems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.water.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Electricity Grid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.electricity.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Implementation Priority</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-blue-800">{result.priority}</p>
                    <div className="pt-2 border-t border-blue-200">
                      <h4 className="font-semibold text-sm text-blue-900 mb-1">Expected Impact</h4>
                      <p className="text-sm text-blue-800">{result.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Upload an image and click analyze to see infrastructure recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
