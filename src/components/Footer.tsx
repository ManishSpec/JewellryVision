import { Diamond } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Diamond className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              Jewelry<span className="text-primary font-bold">Vision</span>
            </h2>
          </div>
          
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} JewelryVision. All rights reserved.
          </div>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;