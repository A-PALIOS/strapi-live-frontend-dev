import type { ImageProps } from "@/types";

/**
 * Article images.
 *
 * An article's `image` is its picture everywhere by default: the listing
 * cards and the hero inside the article page both read it directly.
 *
 * `OutImage` is the one exception. It is an optional override used only
 * where the article is promoted as a banner — today that is the
 * article-of-the-day on the insights page, plus the social preview for the
 * article. Most articles leave it empty, which is why it falls back to
 * `image` rather than rendering nothing.
 */

type ArticleImageFields = {
  OutImage?: ImageProps | null;
  image?: ImageProps | null;
};

/**
 * Picture for a promoted/banner placement: the article-of-the-day and
 * OG/social previews. Uses OutImage when an editor has set one, otherwise
 * the article's normal image.
 */
export function getOutImage(
  article: ArticleImageFields | null | undefined
): ImageProps | null {
  if (!article) return null;
  return article.OutImage ?? article.image ?? null;
}
