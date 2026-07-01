import type React from "react";
import { MinimalTemplate } from "./minimal/minimal-template";
import { BoldTemplate } from "./bold/bold-template";
import { GalleryTemplate } from "./gallery/gallery-template";
import { AIChatWidget } from "@/components/ai/ai-chat-widget";
import type { StoreTemplateProps } from "@/lib/templates/store/types";
import type { StoreTemplateId } from "@/types";

interface TemplateRendererProps {
  templateId: StoreTemplateId;
  username: string;
  profile: StoreTemplateProps["profile"];
  store: StoreTemplateProps["store"];
  products: StoreTemplateProps["products"];
  links: StoreTemplateProps["links"];
}

const TEMPLATE_MAP: Record<StoreTemplateId, React.ComponentType<StoreTemplateProps>> = {
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  gallery: GalleryTemplate,
};

export function TemplateRenderer({
  templateId,
  username,
  profile,
  store,
  products,
  links,
}: TemplateRendererProps) {
  const TemplateComponent = TEMPLATE_MAP[templateId] ?? MinimalTemplate;

  const templateProps: StoreTemplateProps = {
    username,
    profile,
    store,
    products,
    links,
  };

  return (
    <>
      <TemplateComponent {...templateProps} />
      <AIChatWidget
        username={username}
        creatorName={profile.full_name ?? username}
        themeColor={store?.theme_color ?? "#7c3aed"}
      />
    </>
  );
}
