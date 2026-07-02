import type React from "react";
import { MinimalTemplate } from "./minimal/minimal-template";
import { BoldTemplate } from "./bold/bold-template";
import { GalleryTemplate } from "./gallery/gallery-template";
import { AIChatWidget } from "@/components/ai/ai-chat-widget";
import type { StoreTemplateProps } from "@/lib/templates/store/types";
import type { StoreTemplateId, StoreAppearance } from "@/types";

interface TemplateRendererProps {
  templateId: StoreTemplateId;
  username: string;
  profile: StoreTemplateProps["profile"];
  store: StoreTemplateProps["store"];
  products: StoreTemplateProps["products"];
  links: StoreTemplateProps["links"];
  appearance: StoreAppearance;
  // cssVars: the resolved CSS custom properties string, injected
  // as a <style> tag so section components can read --store-*
  // variables without prop-drilling.
  cssVars: string;
}

const TEMPLATE_MAP: Record<StoreTemplateId, React.ComponentType<StoreTemplateProps>> = {
  minimal: MinimalTemplate,
  bold:    BoldTemplate,
  gallery: GalleryTemplate,
};

export function TemplateRenderer({
  templateId,
  username,
  profile,
  store,
  products,
  links,
  appearance,
  cssVars,
}: TemplateRendererProps) {
  const TemplateComponent = TEMPLATE_MAP[templateId] ?? MinimalTemplate;

  const templateProps: StoreTemplateProps = {
    username,
    profile,
    store,
    products,
    links,
    appearance,
  };

  return (
    <>
      {/* Inject store CSS variables into this page scope.
          dangerouslySetInnerHTML is safe here because cssVars is
          generated entirely server-side from typed StoreAppearance
          values — it is never derived from user-controlled free text,
          only from validated color hex strings and enum values. */}
      <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />

      <TemplateComponent {...templateProps} />

      <AIChatWidget
        username={username}
        creatorName={profile.full_name ?? username}
        themeColor={store?.theme_color ?? "#7c3aed"}
      />
    </>
  );
}
