import React from 'react';
import { Github, Linkedin, Globe, GraduationCap, Instagram, Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <a
              href="https://linkedin.com/in/goutham-swaminathan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/goutham1220"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://gswam.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Personal Website"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="https://scholar.google.com/citations?user=4rGXUFkAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Google Scholar"
            >
              <GraduationCap className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/gooths_photos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://buymeacoffee.com/gooth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Buy Me a Coffee"
            >
              <Coffee className="h-5 w-5" />
            </a>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Created by Goutham Swaminathan</p>
          </div>
        </div>
      </div>
    </footer>
  );
}