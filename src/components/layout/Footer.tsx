
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 mt-16 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
