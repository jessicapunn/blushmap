/**
 * Drop-in replacement for affiliate <a> tags.
 * - Signed-in users: tracks click silently, awards 10 pts, opens link, shows toast.
 * - Guests: shows AffiliateSignInPrompt modal with "continue as guest" fallback.
 */
import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { AffiliateSignInPrompt } from "./AffiliateSignInPrompt";
import { trackAffiliateClick, retailerFromUrl } from "@/lib/points";
import { useToast } from "@/hooks/use-toast";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  productId?: string;
  productName?: string;
  children: React.ReactNode;
}

export function AffiliateButton({ href, productId, productName, children, className, style, ...rest }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPrompt, setShowPrompt] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!user) {
      setShowPrompt(true);
      return;
    }

    // Signed in — track & award
    const retailer = retailerFromUrl(href);
    const result = await trackAffiliateClick({ url: href, productId, productName, retailer });

    if (result && result.awarded > 0) {
      toast({
        title: `+${result.awarded} BlushPoints earned!`,
        description: `You now have ${result.totalPoints} points. Keep shopping to unlock rewards.`,
        duration: 3500,
      });
    }

    window.open(href, "_blank", "noopener");
  }, [user, href, productId, productName, toast]);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} style={style} {...rest}>
        {children}
      </a>
      {showPrompt && (
        <AffiliateSignInPrompt
          productName={productName}
          affiliateUrl={href}
          onClose={() => setShowPrompt(false)}
        />
      )}
    </>
  );
}
