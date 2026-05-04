import qs from "qs";
import { getStrapiURL, getStrapiURL2 } from "@/utils/get-strapi-url";
import { fetchAPI } from "@/utils/fetch-api";

const BLOG_PAGE_SIZE = 4;
const BASE_URL = getStrapiURL();
const BASE_URL2 = getStrapiURL2();

const media = true;

const cta = true;

const logoPopulate = {
  populate: {
    image: media,
  },
};

const secondaryMenusPopulate = {
  populate: {
    items: {
      populate: {
        icon: media,
      },
    },
  },
};

const homePageQuery = qs.stringify(
  {
    populate: {
      blocks: {
        on: {
          "blocks.hero-section-main": {
            populate: {
              image: media,
              logo: logoPopulate,
              cta,
              milestones: true,
            },
          },

          "blocks.info-block": {
            populate: {
              image: media,
              cta,
            },
          },

          "blocks.milestones-block": {
            populate: {
              milestones: true,
            },
          },

          "blocks.vertical-accordion-block": {
            populate: {
              items: {
                populate: {
                  cta,
                },
              },
              cta,
            },
          },

          "blocks.services-accordion-block": {
            populate: {
              items: true,
              image: media,
              cta,
            },
          },

          "blocks.leading-institution-block": {
            populate: {
              cta,
            },
          },

          "blocks.logo-carousel-block": {
            populate: {
              items: {
                populate: {
                  image: media,
                },
              },
            },
          },

          "blocks.testimonials-block": {
            populate: {
              items: {
                populate: {
                  image: media,
                },
              },
              cta,
            },
          },

          "blocks.features-block": {
            populate: {
              cta,
            },
          },
        },
      },
    },
  },
  { encodeValuesOnly: true }
);

export async function getHomePage() {
  const url = new URL("/api/home-page", BASE_URL);
  url.search = homePageQuery;

  return fetchAPI(url.href, { method: "GET" });
}

const globalSettingQuery = qs.stringify(
  {
    populate: {
      header: {
        populate: {
          logo: logoPopulate,
          logoWhite: logoPopulate,
          navigation: true,
          cta: true,
        },
      },
      footer: {
        populate: {
          logo: logoPopulate,
          column: {
            populate: {
              link: true,
            },
          },
          socialLink: true,
          bottomLink: true,
          contactBackground: media,
        },
      },
    },
  },
  { encodeValuesOnly: true }
);

export async function getGlobalSettings() {
  const url = new URL("/api/global-page", BASE_URL);
  url.search = globalSettingQuery;

  return fetchAPI(url.href, { method: "GET" });
}

function buildParentFilter(parentSegments: string[]): any {
  if (parentSegments.length === 0) {
    return { $null: true };
  }

  return {
    slug: {
      $eq: parentSegments[parentSegments.length - 1],
    },
    parent: buildParentFilter(parentSegments.slice(0, -1)),
  };
}

const pageBlocksPopulate = {
  on: {
    "blocks.hero-section": {
      populate: {
        image: media,
        logo: logoPopulate,
        cta,
      },
    },

    "blocks.hero-section-services": {
      populate: {
        video: media,
        logo: logoPopulate,
        cta,
      },
    },

    "blocks.hero-section-digital": {
      populate: {
        image: media,
        logo: logoPopulate,
        cta,
      },
    },

    "blocks.sticky-menu": {
      populate: {
        logo: logoPopulate,
        navigation: true,
        hamnavigation: true,
      },
    },

    "blocks.relevant-projects": {
      populate: {
        cta,
        projects: {
          populate: {
            logo: media,
            backgroundImage: media,
            tags: true,
          },
        },
      },
    },

    "blocks.related-service-grid": {
      populate: {
        items: true,
      },
    },

    "blocks.impact-navigation": {
      populate: {
        items: {
          populate:
          {
            url: true
          }
        },
      },
    },

    "blocks.info-block": {
      populate: {
        image: media,
        cta,
      },
    },

    "blocks.moving-text": {
      populate: {
        image: media,
        cta,
      },
    },

    "blocks.leading-institution-block": {
      populate: {
        cta,
      },
    },

    "blocks.featured-article": {
      populate: {
        image: media,
        link: true,
      },
    },

    "blocks.about-section": {
      populate: {
        infographic: media,
      },
    },

    "blocks.about-info": true,
    "blocks.info-box": true,
    "blocks.service-info": true,
    "blocks.dashboard-section1": true,
    "blocks.dashboard-section2": true,
    "blocks.dashboard-section3": true,
    "blocks.dashboard-section4": true,
    "blocks.dashboard-section5": true,
    "blocks.statement-section": true,
    "blocks.about-us-statement": true,
    "blocks.two-column-text": true,

    "blocks.mission-section": {
      populate: {
        values: true,
      },
    },

    "blocks.what-believe": {
      populate: {
        items: true,
      },
    },

    "blocks.magic-bento-block": {
      populate: {
        items: {
          sort: ["order:asc"],
          populate: {
            link: true,
          },
        },
      },
    },

    "blocks.timeline-block": {
      populate: {
        items: {
          populate: {
            images: media,
          },
        },
      },
    },

    "blocks.team-grid": {
      populate: {
        team_members: {
          populate: {
            ProfileImage: media,
            CoverImage: media,
          },
        },
      },
    },
    // "blocks.key-projects": {
    //   populate: {
        
    //     projects: {
    //       populate: {
    //         image: media,
    //         type_of_work: true,
    //         sector: true,
    //       },
    //     },
    //   },
    // },
    "blocks.key-projects": {
        populate: {
          projects: {
            populate: "*",
          },
        },
      },

    "blocks.impact-links": {
      populate: {
        backgroundImage: media,
        items: true,
      },
    },

    "blocks.what-sets-us-apart": {
      populate: {
        rightList: true,
        topImage: media,
      },
    },

    "blocks.services-accordion-block": {
      populate: {
        items: true,
        image: media,
        cta,
      },
    },

    "blocks.accordion-about": {
      populate: {
        items: true,
        image: media,
        cta,
      },
    },

    "blocks.link-list-about": {
      populate: {
        items: true,
        cta,
      },
    },

    "blocks.process-steps": {
      populate: {
        steps: true,
      },
    },

    "blocks.expertise-video-tabs": {
      populate: {
        items: {
          populate: {
            icon: media,
            video: media,
          },
        },
      },
    },

    "blocks.company-highlights": {
      populate: {
        items: {
          populate: {
            icon: media,
          },
        },
      },
    },

    "blocks.expertise-grid": {
      populate: {
        items: true,
      },
    },

    "blocks.ai-cards": {
      populate: {
        Cards: {
          populate: {
            Icon_Image: media,
          },
        },
      },
    },

    "blocks.use-cases-section": {
      populate: {
        items: true,
        image: media,
        cta,
      },
    },

    "blocks.coverflow-showcase": {
      populate: {
        items: {
          populate: {
            thumb: media,
            screenshots: media,
            tags: true,
            stack: true,
          },
        },
      },
    },

    "blocks.case-highlight": {
      populate: {
        image: media,
        cta,
      },
    },
  },
};

const pageBySlugQuery = (slugSegments: string[]) => {
  const lastSegment = slugSegments[slugSegments.length - 1];
  const parentSegments = slugSegments.slice(0, -1);

  return qs.stringify(
    {
      filters: {
        slug: {
          $eq: lastSegment,
        },
        parent: buildParentFilter(parentSegments),
      },
      populate: {
        parent: {
          fields: ["slug"],
        },
        secondary_menus: secondaryMenusPopulate,
        blocks: pageBlocksPopulate,
      },
    },
    { encodeValuesOnly: true }
  );
};

export async function getPageBySlug(slugSegments: string[]) {
  const url = new URL("/api/pages", BASE_URL);
  url.search = pageBySlugQuery(slugSegments);

  return fetchAPI(url.href, { method: "GET" });
}

export async function getContent(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  category?: string
) {
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify(
    {
      sort: ["createdAt:desc"],
      filters: {
        ...(query && {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
          ],
        }),
        ...(featured && { featured: { $eq: featured } }),
        ...(category && {
          categories: {
            name: {
              $eq: category,
            },
          },
        }),
      },
      pagination: {
        pageSize: BLOG_PAGE_SIZE,
        page: parseInt(page || "1"),
      },
      populate: {
        image: media,
        imageAuthor: media,
        categories: true,
      },
    },
    { encodeValuesOnly: true }
  );

  return fetchAPI(url.href, { method: "GET" });
}

export async function getContent2(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  category?: string
) {
  const url = new URL(path, BASE_URL2);

  url.search = qs.stringify(
    {
      sort: ["createdAt:desc"],
      filters: {
        ...(query && {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
          ],
        }),
        ...(featured && { featured: { $eq: featured } }),
        ...(category && {
          categories: {
            name: {
              $eq: category,
            },
          },
        }),
      },
      pagination: {
        pageSize: BLOG_PAGE_SIZE,
        page: parseInt(page || "1"),
      },
      populate: {
        image: media,
        imageAuthor: media,
        categories: true,
      },
    },
    { encodeValuesOnly: true }
  );

  return fetchAPI(url.href, { method: "GET" });
}

export async function getCategories() {
  const res = await fetchAPI(`${BASE_URL}/api/categories?fields[0]=name`, {
    method: "GET",
  });

  const raw = res?.data || [];
  const unique = new Map();

  for (const cat of raw) {
    const id = cat.id;
    const name = cat.name;

    if (!unique.has(name)) {
      unique.set(name, { id, name });
    }
  }

  return Array.from(unique.values());
}

export async function getCategories2() {
  const res = await fetchAPI(`${BASE_URL2}/api/categories?fields[0]=name`, {
    method: "GET",
  });

  const raw = res?.data || [];
  const unique = new Map();

  for (const cat of raw) {
    const id = cat.id;
    const name = cat.name;

    if (!unique.has(name)) {
      unique.set(name, { id, name });
    }
  }

  return Array.from(unique.values());
}

const blogPopulate = {
  blocks: {
    on: {
      "blocks.hero-section": {
        populate: {
          image: media,
          logo: logoPopulate,
          cta,
        },
      },

      "blocks.info-block": {
        populate: {
          image: media,
          cta,
        },
      },

      "blocks.featured-article": {
        populate: {
          image: media,
          link: true,
        },
      },

      "blocks.heading": true,

      "blocks.paragraph-with-image": {
        populate: {
          image: media,
        },
      },

      "blocks.paragraph": true,

      "blocks.full-image": {
        populate: {
          image: media,
        },
      },
    },
  },
};

export async function getContentBySlug(slug: string, path: string) {
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        image: media,
        imageAuthor: media,
        ...blogPopulate,
      },
    },
    { encodeValuesOnly: true }
  );

  return fetchAPI(url.href, { method: "GET" });
}

export async function getArticleOfTheDay() {
  const url = new URL("/api/articles", BASE_URL);

  url.search = qs.stringify(
    {
      filters: {
        articleOfTheDay: {
          $eq: true,
        },
      },
      populate: {
        image: media,
        imageAuthor: media,
      },
      sort: ["createdAt:desc"],
      pagination: {
        pageSize: 1,
      },
    },
    { encodeValuesOnly: true }
  );

  const res = await fetchAPI(url.href, { method: "GET" });

  return res?.data?.[0];
}

const memberPopulate = {
  ProfileImage: true,
  CoverImage: true,
  secondary_menus: {
    populate: {
      items: {
        populate: {
          icon: true,
        },
      },
    },
  },
};

export async function getTeamMemberBySlug(slug: string) {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: memberPopulate,
    },
    { encodeValuesOnly: true }
  );

  const url = new URL(`/api/team-members?${query}`, BASE_URL);

  return fetchAPI(url.href, { method: "GET" });
}
export async function fetchTeamMember(slug: string) {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: memberPopulate,
    },
    { encodeValuesOnly: true }
  );

  const res = await fetch(`${BASE_URL}/api/team-members?${query}`, {
    next: { revalidate: 60 },
  });

  const data = await res.json();

  return data?.data?.[0];
}

//key projects logic

const keyProjectPopulate = {
  image: true,
  type_of_work: true,
  sector: true,
  secondary_menus: secondaryMenusPopulate,
  blocks: pageBlocksPopulate,
};

export async function getKeyProjects() {
  const query = qs.stringify(
    {
      sort: ["createdAt:desc"],
      populate: keyProjectPopulate,
    },
    { encodeValuesOnly: true }
  );

  const url = new URL(`/api/key-projects?${query}`, BASE_URL);

  return fetchAPI(url.href, { method: "GET" });
}

export async function getKeyProjectBySlug(slug: string) {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: keyProjectPopulate,
    },
    { encodeValuesOnly: true }
  );

  const url = new URL(`/api/key-projects?${query}`, BASE_URL);

  return fetchAPI(url.href, { method: "GET" });
}