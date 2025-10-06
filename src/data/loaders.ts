import qs from "qs";
import { getStrapiURL, getStrapiURL2 } from "@/utils/get-strapi-url";
import { fetchAPI } from "@/utils/fetch-api";

const homePageQuery = qs.stringify(
  {
    populate: {
      blocks: {
        on: {


           "blocks.hero-section-main": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              logo: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
              cta: true,
               milestones: {
                populate: true,
              },
            },
          },
          // "blocks.hero-section": {
          //   populate: {
          //     image: {
          //       fields: ["url", "alternativeText"],
          //     },
          //     logo: {
          //       populate: {
          //         image: {
          //           fields: ["url", "alternativeText"],
          //         },
          //       },
          //     },
          //     cta: true,
          //   },
          // },
          "blocks.info-block": {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              cta: true,
            },
          },
          "blocks.milestones-block": {
            populate: {
              milestones: {
                populate: true,
              },
            },
          },
          "blocks.vertical-accordion-block": {
            populate: {
              items: {
                populate: {
                  cta: true,
                },
              },
              cta: true
            },
          },
          "blocks.services-accordion-block": {
            populate: {
              items: true,
              image: {
                fields: ["url", "alternativeText"],
              },
              cta: true,
            },
          },
          "blocks.leading-institution-block":{
              populate:
              {
                cta: true,
              }
            },
          "blocks.logo-carousel-block": {
            populate: {
              items: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
            },
          },
          "blocks.testimonials-block": {
            populate: {
              items: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
              cta: true,
            },
          },
          "blocks.features-block": {
            populate: {
             
              cta: true,
            },
          },
        },
      },
    },
  },
  { encodeValuesOnly: true }
);

const BLOG_PAGE_SIZE = 3;
const BASE_URL = getStrapiURL();
const BASE_URL2 = getStrapiURL2()





export async function getHomePage() {
  const path = "/api/home-page";
  const url = new URL(path, BASE_URL);


  url.search = homePageQuery;



  return fetchAPI(url.href, { method: "GET" });
}








const globalSettingQuery = qs.stringify({
    populate: {
      header: {
        populate: {
          logo: {
            populate: {
              image: { fields: ["url", "alternativeText"] },
            },
          },
          // 👇 add this
          logoWhite: {
            populate: {
              image: { fields: ["url", "alternativeText"] },
            },
          },

          navigation: true,
          cta: true,
        },
      },
      footer: {
        populate: {
          logo: {
            populate: {
              image: { fields: ["url", "alternativeText"] },
            },
          },
          column: { populate: { link: true } },
          socialLink: true,
          bottomLink: true,
          contactBackground: { fields: ["url", "alternativeText"] },
        },
      },
    },
  },
  { encodeValuesOnly: true }

);


export async function getGlobalSettings() {
  const path = "/api/global-page";
  console.log(BASE_URL);
  const url = new URL(path, BASE_URL);
  url.search = globalSettingQuery;
  console.log("url.search",url.search);
  return fetchAPI(url.href, { method: "GET" });
}



const pageBySlugQuery = (slug: string) =>
  qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
          secondary_menus: {
          populate: {
            items: {
              populate: {
                icon: {
                  fields: ["url", "alternativeText"],
                },
              },
            },
          },
        },
        blocks: {
          on: {
            "blocks.hero-section": {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
                logo: {
                  populate: {
                    image: {
                      fields: ["url", "alternativeText"],
                    },
                  },
                },
                cta: true,
              },
            },

             "blocks.hero-section-digital": {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
                logo: {
                  populate: {
                    image: {
                      fields: ["url", "alternativeText"],
                    },
                  },
                },
                cta: true,
              },
            },

            "blocks.sticky-menu": {
              populate: {
                logo: {
                  populate: {
                    image: {
                      fields: ["url", "alternativeText"],
                    },
                  },
                },
                navigation:true,
                hamnavigation:true,
              },
            },

            "blocks.info-block": {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
                cta: true,
              },
            },
            "blocks.featured-article": {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
                link: true,
              },
            },
            "blocks.about-section": {
              populate: {
                infographic: {
                  fields: ["url", "alternativeText"],
                },
              },
            },
            "blocks.about-info": true,
            "blocks.what-believe": {
              populate: { items: { fields: ["title", "blurb", "iconKey", "sortOrder"] } },
            },
            "blocks.magic-bento-block": true,
            "blocks.service-info": true,
            "blocks.timeline-block": {
              populate: {
                items: {
                  populate: {
                    images: { fields: ["url", "alternativeText"] },
                  },
                },
              },
            },

            "blocks.team-grid": {
              populate: {
                team_members: {
                  populate: {
                    ProfileImage: {
                      fields: ["url", "alternativeText"],
                    },
                    CoverImage:{
                      fields: ["url", "alternativeText"],
                    }
                  },
                },
                },
              },

          },
        },
      },
    },
    { encodeValuesOnly: true }
  );


export async function getPageBySlug(slug: string) {
  const path = "/api/pages";
  const url = new URL(path, BASE_URL);
  url.search = pageBySlugQuery(slug);
  return await fetchAPI(url.href, { method: "GET" });
}



export async function getContent(path: string, featured?: boolean, query?: string, page?: string, category?: string) {
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify({
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
      image: {
        fields: ["url", "alternativeText"],
      },
      imageAuthor: {
        fields: ["url", "alternativeText"],
      },
      categories: {
        fields: ["name"], // ✅ get category names
      },
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}

export async function getContent2(path: string, featured?: boolean, query?: string, page?: string, category?: string) {
  const url = new URL(path, BASE_URL2);

  url.search = qs.stringify({
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
      image: {
        fields: ["url", "alternativeText"],
      },
      imageAuthor: {
        fields: ["url", "alternativeText"],
      },
      categories: {
        fields: ["name"], // ✅ get category names
      },
    },
  });

  console.log("This is the url -> ",url.toString());

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
// export async function getContent(path: string, featured?:boolean,query?:string, page?:string) {
//   const url = new URL(path, BASE_URL);

//   url.search = qs.stringify({
//     sort: ["createdAt:desc"],
//        filters: {
//          $or: [
//         { title: { $containsi: query } },
//         { description: { $containsi: query } },
//       ],
    
//       ...(featured && { featured: { $eq: featured } }),
//     },
//      pagination: {
//       pageSize: BLOG_PAGE_SIZE,
//       page: parseInt(page || "1"),
//     },
//     populate: {
//       image: {
//         fields: ["url", "alternativeText"],
//       },
//       imageAuthor: {
//         fields: ["url", "alternativeText"], // ✅ ADD THIS
//       },
//        categories: {
//         fields: ["name"], // ✅ include category names
//      },
      
//     },
//   });

//   return fetchAPI(url.href, { method: "GET" });
// }

const blogPopulate = {
  blocks: {
    on: {
      "blocks.hero-section": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          cta: true,
        },
      },
      "blocks.info-block": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          cta: true,
        },
      },
      "blocks.featured-article": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          link: true,
        },
      },
      
      "blocks.heading": {
        populate: true,
      },
      "blocks.paragraph-with-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "blocks.paragraph": {
        populate: true,
      },
      "blocks.full-image": {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
  },
};





export async function getContentBySlug(slug: string, path: string) {
  const url = new URL(path, BASE_URL);
  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      imageAuthor: {
            fields: ["url", "alternativeText"],
      },
      ...blogPopulate,
    },
  });

  return fetchAPI(url.href, { method: "GET" });
}


export async function getArticleOfTheDay() {
  const url = new URL("/api/articles", getStrapiURL());

  url.search = qs.stringify({
    filters: {
      articleOfTheDay: { $eq: true },
    },
    populate: {
      image: { fields: ["url", "alternativeText"] },
      imageAuthor: { fields: ["url", "alternativeText"] },
    },
    sort: ["createdAt:desc"],
    pagination: { pageSize: 1 }, // Only one
  });

  const res = await fetchAPI(url.href, { method: "GET" });
  return res?.data?.[0]; // return single article
}

const memberPopulate = {
  ProfileImage: {
    fields: ["url", "alternativeText"],
  },
  LinkedInUrl: true,
  Bio: true,
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
  return await fetchAPI(url.href, { method: "GET" });
}

export async function fetchTeamMember(slug: string) {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        ProfileImage: { fields: ["url", "alternativeText"] },
        CoverImage: { fields: ["url", "alternativeText"] },
      },
    },
    { encodeValuesOnly: true }
  );
 
  const res = await fetch(`${BASE_URL}/api/team-members?${query}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return data?.data?.[0];
}

