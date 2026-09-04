"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getContent } from "@/data/loaders";
import { PaginationComponent } from "@/components/PaginationComponent";
import type { ArticleProps } from "@/types";

interface QueryContext {
  path: string;
  featured?: boolean;
  sector?: string;
  topic?: string;
  pageSize?: number;
}

export interface ContentListViewProps {
  headline: string;
  headlineAlignment: "center" | "right" | "left";
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  layout: "grid" | "vertical";
  showPagination?: boolean;
  queryContext: QueryContext;
  initialArticles: ArticleProps[];
  initialPageCount: number;
  defaultPage: string;
  defaultQuery: string;
}

function ContentListGrid({
  headline,
  headlineAlignment,
  component: Component,
  layout,
  showPagination,
  basePath,
  articles,
  pageCount,
  loading,
}: Pick<
  ContentListViewProps,
  "headline" | "headlineAlignment" | "component" | "layout" | "showPagination"
> & {
  basePath: string;
  articles: ArticleProps[];
  pageCount: number;
  loading: boolean;
}) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[headlineAlignment];

  return (
    <section className="w-full py-10">
      <div className="px-6 md:px-10 lg:px-16 xl:px-20">
        {/* Mobile + Tablet row */}
        <div className="lg:hidden">
          <div className="mb-6 flex items-end justify-between gap-4 py-5 tracking-[-1.2px]">
            {headline && (
              <h3
                className={`text-[22px] sm:text-[24px] font-bold ${alignmentClass} font-agenda-medium`}
              >
                {headline}
              </h3>
            )}

            {showPagination && <PaginationComponent pageCount={pageCount} />}
            <div
              className="mt-16 border-t border-[#dedede] -mx-6 md:-mx-10"
              style={{ borderColor: "#626262" }}
            />
          </div>
        </div>

        <div className="mb-8 hidden items-baseline justify-between gap-4 lg:flex">
          {headline ? (
            <h3
              className={`text-2xl font-bold sm:text-3xl ${alignmentClass} font-agenda-medium`}
            >
              {headline}
            </h3>
          ) : (
            <div />
          )}

          <div className="flex translate-y-0 items-center gap-4">
            {showPagination && <PaginationComponent pageCount={pageCount} />}
          </div>
        </div>
      </div>

      <div
        aria-busy={loading}
        className={
          layout === "grid"
            ? "grid grid-cols-1 gap-8 px-6 md:px-10 lg:grid-cols-4 lg:px-16 xl:px-20"
            : "flex flex-col gap-6"
        }
      >
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={basePath} />
        ))}
      </div>
    </section>
  );
}

function ContentListViewInner(props: ContentListViewProps) {
  const {
    queryContext,
    initialArticles,
    initialPageCount,
    defaultPage,
    defaultQuery,
  } = props;

  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? defaultPage;
  const query = searchParams.get("query") ?? defaultQuery;
  const isDefault = page === defaultPage && query === defaultQuery;

  const [articles, setArticles] = useState(initialArticles);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDefault) {
      setArticles(initialArticles);
      setPageCount(initialPageCount);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getContent(
      queryContext.path,
      queryContext.featured,
      query || undefined,
      page,
      queryContext.sector,
      queryContext.topic,
      queryContext.pageSize
    )
      .then(({ data, meta }) => {
        if (cancelled) return;
        setArticles((data as ArticleProps[]) || []);
        setPageCount(meta?.pagination?.pageCount || 1);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, isDefault]);

  return (
    <ContentListGrid
      headline={props.headline}
      headlineAlignment={props.headlineAlignment}
      component={props.component}
      layout={props.layout}
      showPagination={props.showPagination}
      basePath={queryContext.path}
      articles={articles}
      pageCount={pageCount}
      loading={loading}
    />
  );
}

export function ContentListView(props: ContentListViewProps) {
  return (
    <Suspense
      fallback={
        <ContentListGrid
          headline={props.headline}
          headlineAlignment={props.headlineAlignment}
          component={props.component}
          layout={props.layout}
          showPagination={props.showPagination}
          basePath={props.queryContext.path}
          articles={props.initialArticles}
          pageCount={props.initialPageCount}
          loading={false}
        />
      }
    >
      <ContentListViewInner {...props} />
    </Suspense>
  );
}
