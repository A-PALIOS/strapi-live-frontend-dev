export interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

// utils/mapSecondaryMenu.ts
export type SecondaryMenuItem = {
  id: number | string;
  label: string;
  url: string;
  icon?:ImageProps;
};

export type SecondaryMenuProps = {
    title:string;
    slug:string;
    items: SecondaryMenuItem[];
};

export function mapSecondaryMenu(raw: any): SecondaryMenuProps | null {
  // support both {data:{attributes}} and flattened shapes
  const sm = raw?.data?.attributes ?? raw;
  if (!sm) return null;

  const items = (sm.items ?? []).map((it: any, idx: number): SecondaryMenuItem => ({
    id: it.id ?? idx,
    label: it.label,
    url: it.url,
    icon:it.icon
  }));

  // if you didn’t add logo on the menu, this stays null (that’s fine)
  const logo = sm.logo ?? null;

  return {
    title: sm.title ?? null,
    slug: sm.slug ?? null,
    items,
  };
}
