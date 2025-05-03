
import { ExternalLink } from "lucide-react";
import { Link } from "@/components/ui/link";

export function Footer() {
  return (
    <footer className="border-t bg-card py-6 mt-auto">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Link 
          href="https://perryong.github.io/linktree/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <span>Perry Ong</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </footer>
  );
}
