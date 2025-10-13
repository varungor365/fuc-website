'use client';

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface LiveModeProfileProps {
  username: string;
  location?: string;
}

export default function LiveModeProfile({ username, location = 'Mumbai' }: LiveModeProfileProps) {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [weather, setWeather] = useState<any>(null);
  const [mood, setMood] = useState<'sunny' | 'rainy' | 'cloudy' | 'night'>('sunny');

  useEffect(() => {
    // Fetch weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) setMood('night');
        else if (data.weather[0].main === 'Rain') setMood('rainy');
        else if (data.weather[0].main === 'Clouds') setMood('cloudy');
        else setMood('sunny');
      });
  }, [location]);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let particles: any[] = [];

      p.setup = () => {
        p.createCanvas(400, 400);
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-1, 1),
            vy: p.random(-1, 1),
            size: p.random(2, 8)
          });
        }
      };

      p.draw = () => {
        // Dynamic background based on mood
        if (mood === 'sunny') p.background(255, 220, 100, 10);
        else if (mood === 'rainy') p.background(100, 120, 150, 10);
        else if (mood === 'cloudy') p.background(180, 180, 180, 10);
        else p.background(20, 20, 40, 10);

        // Animate particles
        particles.forEach(particle => {
          p.fill(255, 255, 255, 150);
          p.noStroke();
          p.circle(particle.x, particle.y, particle.size);

          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
        });

        // Display username
        p.fill(255);
        p.textSize(24);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`@${username}`, p.width / 2, p.height / 2);
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, [username, mood]);

  return (
    <div className="relative">
      <div ref={sketchRef} className="rounded-xl overflow-hidden" />
      {weather && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white">
          <p className="text-sm">{Math.round(weather.main.temp - 273.15)}°C</p>
          <p className="text-xs">{weather.weather[0].main}</p>
        </div>
      )}
    </div>
  );
}
